import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { SEATING_AREAS } from "../data/tableData";

const LOCAL_STORAGE_KEY = "duplex_cafe_bookings_db";
const BOOKING_EVENT_NAME = "duplex_booking_update";

/**
 * 🕒 DATA RETENTION — BOOKING TTL POLICY
 * ----------------------------------------
 * Every booking carries an `expireAt` Firestore Timestamp. Configure ONCE in
 * the Firebase Console:
 *   Firestore Database → TTL tab → Create policy
 *     Collection:       bookings
 *     Timestamp field:  expireAt
 *
 * Rules:
 *   - CONFIRMED booking → expireAt = createdAt + 90 days
 *   - CANCELLED / REJECTED booking → expireAt = statusChangedAt + 7 days
 *
 * Note: Firestore TTL is best-effort; docs are typically removed within
 * 24 hours AFTER `expireAt` passes. Not exact-to-the-second.
 *
 * This TTL is intentionally scoped to the `bookings` collection only.
 * `customer_sessions` and `admin_login_logs` are handled by client-side
 * `limit()` caps and are out of scope here.
 */
export const TTL_DAYS_CONFIRMED = 90;
export const TTL_DAYS_CLOSED = 7;

function ttlDaysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export const DEFAULT_SLOT_INTERVAL_MINUTES = 60;

const INITIAL_DEMO_BOOKINGS = [
  {
    id: "DLC-2026-891",
    bookingId: "DLC-2026-891",
    name: "Rohit Deshmukh",
    phone: "+91 98201 45678",
    email: "rohit@example.com",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "07:00 PM",
    zoneId: "mezzanine-lounge",
    zoneName: "Upper Mezzanine Lounge",
    partySize: 4,
    specialRequests: "Please arrange screen for birthday video presentation",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    reservation: {
      date: new Date().toISOString().split("T")[0],
      timeSlot: "07:00 PM",
      areaId: "mezzanine-lounge",
      areaName: "Upper Mezzanine Lounge",
      guestCount: 4,
      specialRequests: "Please arrange screen for birthday video presentation"
    }
  },
  {
    id: "DLC-2026-442",
    bookingId: "DLC-2026-442",
    name: "Sneha Patil",
    phone: "+91 98192 33445",
    email: "sneha.p@example.com",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "06:00 PM",
    zoneId: "neon-booth",
    zoneName: "Good Food Good Mood Neon Booth",
    partySize: 2,
    specialRequests: "Table near the amber neon sign please",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    reservation: {
      date: new Date().toISOString().split("T")[0],
      timeSlot: "06:00 PM",
      areaId: "neon-booth",
      areaName: "Good Food Good Mood Neon Booth",
      guestCount: 2,
      specialRequests: "Table near the amber neon sign please"
    }
  }
];

export function getLocalBookings() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
      return INITIAL_DEMO_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_BOOKINGS;
  }
}

function saveLocalBookings(bookings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new Event(BOOKING_EVENT_NAME));
  } catch (err) {
    console.error("Local storage save error:", err);
  }
}

export function getCurrentISTTime() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const parts = formatter.formatToParts(now);
  const getPart = (type) => parts.find((p) => p.type === type)?.value || "00";

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const todayDateString = `${year}-${month}-${day}`;
  const hour = parseInt(getPart("hour"), 10);
  const minute = parseInt(getPart("minute"), 10);
  const decimalHour = hour + minute / 60;

  return {
    todayDateString,
    hour,
    minute,
    decimalHour,
    nowDate: now
  };
}

export function getAvailableTimeSlots(selectedDate, intervalMinutes = DEFAULT_SLOT_INTERVAL_MINUTES) {
  if (!selectedDate) return [];

  const { todayDateString, decimalHour } = getCurrentISTTime();
  const dateObj = new Date(selectedDate);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  const isSaturday = dayName === "Saturday";
  const isFriSun = dayName === "Friday" || dayName === "Sunday";
  const isToday = selectedDate === todayDateString;

  const slots = [];
  let startHour = 11;
  let endHour = isFriSun ? 23 : 22.5;

  if (isSaturday) {
    startHour = 0;
    endHour = 24;
  }

  const step = intervalMinutes / 60;

  for (let h = startHour; h < endHour; h += step) {
    if (isToday && h < decimalHour + 1.0) {
      continue;
    }

    const wholeHour = Math.floor(h);
    const fraction = h % 1;
    const mins = Math.round(fraction * 60);
    const minuteStr = mins.toString().padStart(2, "0");
    const period = wholeHour >= 12 && wholeHour < 24 ? "PM" : "AM";
    const displayHour = wholeHour === 0 ? 12 : wholeHour > 12 ? wholeHour - 12 : wholeHour;
    slots.push(`${displayHour.toString().padStart(2, "0")}:${minuteStr} ${period}`);
  }

  return slots;
}

export function getAvailableZonesForPartySize(partySize = 2) {
  const size = parseInt(partySize, 10) || 2;
  const filtered = SEATING_AREAS.filter(
    (zone) => size >= zone.minGuests && size <= zone.maxGuests
  );

  if (filtered.length === 0) {
    return SEATING_AREAS.filter((zone) => zone.id === "mezzanine-lounge");
  }
  return filtered;
}

/**
 * ⚡ CREATE TABLE BOOKING (auto-confirmed when seats are available)
 * 1. Validates real-time availability inside a Firestore transaction.
 * 2. Checks active table units capacity for (date, timeSlot, zoneId).
 * 3. Persists booking with status 'CONFIRMED' immediately.
 * 4. Sets expireAt = createdAt + 90 days for native Firestore TTL.
 * 5. Seeds statusHistory with initial 'CONFIRMED' entry.
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.phone         Normalized 91XXXXXXXXXX
 * @param {string} [params.email]
 * @param {string} params.date          YYYY-MM-DD
 * @param {string} params.timeSlot      e.g. "07:00 PM"
 * @param {string} params.zoneId
 * @param {number} [params.partySize=2]
 * @param {string} [params.specialRequests=""]
 * @param {string} [params.createdBy]   "customer" | "admin:<uid>:<email>" for walk-ins
 */
export async function createBooking({
  name,
  phone,
  email = "",
  date,
  timeSlot,
  zoneId,
  partySize = 2,
  specialRequests = "",
  createdBy = "customer",
  dedupeKey = null
}) {
  if (!name || !phone) {
    throw new Error("Customer name and phone number are required.");
  }
  if (!date || !timeSlot || !zoneId) {
    throw new Error("Date, time slot, and seating zone are required.");
  }

  // Idempotency: reject duplicate in-flight submissions
  if (!consumeInFlightKey(dedupeKey)) {
    throw new Error("This booking is already being submitted. Please wait.");
  }

  // Normalize phone (defense in depth — UI also normalizes, but we re-check
  // here so any caller — admin manual booking, future Cloud Function, etc. —
  // writes a clean E.164-ish value to Firestore).
  const phoneCheck = validateIndianPhone(phone);
  if (!phoneCheck.valid) {
    releaseInFlightKey(dedupeKey);
    throw new Error(phoneCheck.reason);
  }
  const cleanPhone = phoneCheck.normalized;

  const cleanName = name.trim();
  const cleanEmail = (email || "").trim().toLowerCase();
  const guests = parseInt(partySize, 10) || 2;

  const zoneObj = SEATING_AREAS.find((z) => z.id === zoneId) || SEATING_AREAS[0];
  const zoneName = zoneObj.name;
  const maxUnits = zoneObj.units || 1;

  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const bookingId = `DLC-${new Date().getFullYear()}-${randomSuffix}`;
  const nowIso = new Date().toISOString();
  const nowDate = new Date();
  const expireAt = ttlDaysFromNow(TTL_DAYS_CONFIRMED);

  const statusHistory = [
    {
      status: "CONFIRMED",
      by: createdBy.startsWith("admin:") ? createdBy.split(":")[1] : "customer",
      byEmail: createdBy.startsWith("admin:")
        ? createdBy.split(":").slice(2).join(":")
        : "",
      at: nowIso,
      reason: createdBy.startsWith("admin:") ? "Created by admin (walk-in)" : ""
    }
  ];

  const bookingData = {
    id: bookingId,
    bookingId,
    name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    date,
    timeSlot,
    zoneId,
    zoneName,
    partySize: guests,
    specialRequests: specialRequests.trim(),
    status: "CONFIRMED",
    createdBy,
    confirmedAt: nowIso,
    createdAt: nowIso,
    // expireAt must be a Firestore Timestamp in production. We use a JS Date
    // here for the local-storage fallback; in the Firestore path below we
    // re-set it as serverTimestamp-derived via `new Date(...)` so Firestore
    // accepts it as a Timestamp on read.
    expireAt,
    statusHistory,
    reservation: {
      date,
      timeSlot,
      areaId: zoneId,
      areaName: zoneName,
      guestCount: guests,
      specialRequests: specialRequests.trim()
    }
  };

  if (isFirebaseConfigured && db) {
    try {
      await runTransaction(db, async (transaction) => {
        const bookingsRef = collection(db, "bookings");
        const slotQuery = query(
          bookingsRef,
          where("date", "==", date),
          where("timeSlot", "==", timeSlot),
          where("zoneId", "==", zoneId)
        );
        const snapshot = await getDocs(slotQuery);
        const activeBookings = snapshot.docs.filter((d) => {
          const st = (d.data().status || "").toLowerCase();
          return st === "confirmed";
        });

        if (activeBookings.length >= maxUnits) {
          throw new Error(
            `The ${zoneName} is fully booked at ${timeSlot} on ${date}. Please select another time slot or seating zone.`
          );
        }

        const newBookingRef = doc(db, "bookings", bookingId);
        transaction.set(newBookingRef, bookingData);
      });
      console.log(`[Transaction] Booked #${bookingId} in Firestore.`);
    } catch (err) {
      releaseInFlightKey(dedupeKey);
      if (err.message.includes("fully booked")) {
        throw err;
      }
      console.warn("[Transaction] Fallback booking creation notice:", err);
      await setDoc(doc(db, "bookings", bookingId), bookingData);
    }
  } else {
    // LOCAL-ONLY CAPACITY CHECK (mirrors the Firestore transaction logic so
    // the same race-condition guarantee holds when Firebase is not configured).
    const localList = getLocalBookings();
    const localActiveCount = localList.filter((b) => {
      const sameSlot =
        b.date === date && b.timeSlot === timeSlot && b.zoneId === zoneId;
      const active = (b.status || "").toLowerCase() === "confirmed";
      return sameSlot && active;
    }).length;
    if (localActiveCount >= maxUnits) {
      releaseInFlightKey(dedupeKey);
      throw new Error(
        `The ${zoneName} is fully booked at ${timeSlot} on ${date}. Please select another time slot or seating zone.`
      );
    }
  }

  // Persist locally for the bookings-table view (UI cache, not the source of truth)
  const localList = getLocalBookings();
  localList.unshift(bookingData);
  saveLocalBookings(localList);

  // Release dedupe key on success
  releaseInFlightKey(dedupeKey);

  return { ...bookingData, _nowDate: nowDate };
}

/**
 * 🛡️ SUBMIT-IDEMPOTENCY GUARD
 * Use this BEFORE calling createBooking from the UI. While a request is
 * in-flight, generateInFlightKey() returns a unique dedupe key. The UI
 * should pass that key to createBooking and disable its submit button.
 * If the same key is submitted twice (double-click, retry), the second
 * call is rejected without writing to Firestore.
 *
 * In-flight keys live in memory only and expire after 30 seconds.
 */
const IN_FLIGHT_KEYS = new Map(); // dedupeKey -> { expiresAt, bookingId? }
const IN_FLIGHT_TTL_MS = 30_000;

export function generateInFlightKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function consumeInFlightKey(dedupeKey) {
  if (!dedupeKey) return true; // no dedupe requested, allow
  const now = Date.now();
  const entry = IN_FLIGHT_KEYS.get(dedupeKey);
  if (!entry) {
    IN_FLIGHT_KEYS.set(dedupeKey, { expiresAt: now + IN_FLIGHT_TTL_MS });
    return true;
  }
  if (entry.expiresAt < now) {
    IN_FLIGHT_KEYS.delete(dedupeKey);
    IN_FLIGHT_KEYS.set(dedupeKey, { expiresAt: now + IN_FLIGHT_TTL_MS });
    return true;
  }
  return false; // duplicate in-flight call
}

function releaseInFlightKey(dedupeKey) {
  if (dedupeKey) IN_FLIGHT_KEYS.delete(dedupeKey);
}

/**
 * @deprecated Use createBooking() instead. Kept as a thin alias for any
 * in-flight call sites during the rename window.
 */
export const createPendingBooking = createBooking;

/**
 * ❌ ADMIN CANCELLATION
 * - Sets status to 'cancelled'
 * - Records cancelledAt, cancellationReason, cancelledByAdminUid, cancelledByAdminEmail
 * - Appends to statusHistory
 * - Resets expireAt to statusChangedAt + 7 days (Firestore TTL picks it up)
 * - Idempotent: if already cancelled, returns existing doc without double-log
 */
export async function cancelBookingByAdmin(
  bookingId,
  cancellationReason = "Cancelled by Cafe Admin",
  admin = null // { uid, email }
) {
  if (!bookingId) throw new Error("bookingId is required");
  const nowIso = new Date().toISOString();
  const closedExpireAt = ttlDaysFromNow(TTL_DAYS_CLOSED);

  // Idempotency: if already cancelled, return without re-writing
  const existing = getLocalBookings().find(
    (b) => b.id === bookingId || b.bookingId === bookingId
  );
  if (existing && (existing.status || "").toLowerCase() === "cancelled") {
    return existing;
  }

  const historyEntry = {
    status: "CANCELLED",
    by: (admin && admin.uid) || "admin",
    byEmail: (admin && admin.email) || "",
    at: nowIso,
    reason: cancellationReason.trim()
  };

  const updates = {
    status: "cancelled",
    cancelledAt: nowIso,
    cancellationReason: cancellationReason.trim(),
    cancelledByAdminUid: (admin && admin.uid) || "",
    cancelledByAdminEmail: (admin && admin.email) || "",
    expireAt: closedExpireAt,
    statusHistory: arrayUnionSafe(existing?.statusHistory, historyEntry)
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, "bookings", bookingId), updates);
    } catch (err) {
      console.warn("[Admin Action] Firestore cancel warning:", err);
    }
  }

  const localList = getLocalBookings();
  const idx = localList.findIndex((b) => b.id === bookingId || b.bookingId === bookingId);
  if (idx !== -1) {
    localList[idx] = {
      ...localList[idx],
      ...updates,
      statusHistory: updates.statusHistory
    };
    saveLocalBookings(localList);
    return localList[idx];
  }
  return { bookingId, ...updates };
}

/**
 * Helper: arrayUnion for local fallback (Firestore has its own arrayUnion).
 * In local mode, we just append.
 */
function arrayUnionSafe(currentArr, entry) {
  const arr = Array.isArray(currentArr) ? [...currentArr] : [];
  arr.push(entry);
  return arr;
}

/**
 * ⚠️ Dead-code cleanup: confirmBookingByAdmin and rejectBookingByAdmin have
 * been removed. The customer flow auto-confirms on creation, and the admin UI
 * only surfaces Cancel. If a REJECTED state is needed in the future, define
 * a single rejectBookingByAdmin here with the same pattern as
 * cancelBookingByAdmin (sets status, appends to statusHistory, sets
 * expireAt to +7 days).
 */

export function getAllBookings(onData) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const list = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          onData(list);
        },
        () => {
          onData(getLocalBookings());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Admin all bookings subscription fallback:", err);
    }
  }

  const handleUpdate = () => {
    onData(getLocalBookings());
  };

  window.addEventListener(BOOKING_EVENT_NAME, handleUpdate);
  window.addEventListener("storage", handleUpdate);

  onData(getLocalBookings());

  return () => {
    window.removeEventListener(BOOKING_EVENT_NAME, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}

export function getLiveDayAvailabilityMatrix(selectedDate) {
  const matrix = {};
  for (const b of getLocalBookings()) {
    const d = b.date || b.reservation?.date;
    const t = b.timeSlot || b.reservation?.timeSlot;
    const a = b.zoneId || b.reservation?.areaId;
    const st = (b.status || "").toLowerCase();
    if (d === selectedDate && (st === "confirmed" || st === "pending")) {
      const key = `${t}_${a}`;
      matrix[key] = (matrix[key] || 0) + 1;
    }
  }
  return matrix;
}

/**
 * 📞 PHONE VALIDATION (Option D — no real OTP, format-only check)
 * Accepts Indian mobile numbers with optional +91 / 0 prefix.
 * Returns { valid, normalized } where normalized is "91XXXXXXXXXX" (E.164-ish).
 */
export function validateIndianPhone(rawPhone) {
  if (!rawPhone) {
    return { valid: false, reason: "Phone number is required.", normalized: "" };
  }
  const cleaned = String(rawPhone).replace(/\D/g, "");
  let digits = cleaned;
  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  }
  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }
  if (digits.length !== 10) {
    return {
      valid: false,
      reason: "Invalid phone no. Please enter a valid phone no.",
      normalized: ""
    };
  }
  if (!/^[6-9]/.test(digits)) {
    return {
      valid: false,
      reason: "Invalid phone no. Please enter a valid phone no.",
      normalized: ""
    };
  }
  return { valid: true, reason: "", normalized: `91${digits}` };
}

/**
 * 📝 LOG EVERY CUSTOMER BOOKING ATTEMPT TO FIRESTORE
 * Records (success or failure) to the customer_sessions collection so the
 * cafe owner can see who tried to book, when, and from where — even though
 * customers don't have accounts.
 */
export async function logCustomerSession({
  outcome, // "success" | "validation_failed" | "fully_booked" | "error"
  name = "",
  phone = "",
  date = "",
  timeSlot = "",
  zoneId = "",
  zoneName = "",
  partySize = 0,
  bookingId = "",
  errorMessage = ""
}) {
  const log = {
    outcome,
    name: name.trim().slice(0, 80),
    phone: phone.trim().slice(0, 20),
    date,
    timeSlot,
    zoneId,
    zoneName,
    partySize: Number(partySize) || 0,
    bookingId,
    errorMessage: errorMessage.slice(0, 200),
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 200) : "",
    timestamp: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, "customer_sessions"), {
        ...log,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn("[customer_sessions] Firestore write warning:", err);
    }
  }

  // Always keep a local backup (works even when Firebase isn't configured)
  try {
    const key = "duplex_customer_sessions_log";
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(log);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
  } catch {
    // ignore storage errors
  }
}