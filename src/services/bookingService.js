import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { MENU_ITEMS } from "../data/menuData";
import { sendBookingConfirmationEmail } from "./emailService";

// Local storage key for development / offline fallback
const LOCAL_STORAGE_KEY = "duplex_cafe_bookings_db";
const BOOKING_EVENT_NAME = "duplex_booking_update";

// Initial demo bookings for testing Admin Dashboard immediately
const INITIAL_DEMO_BOOKINGS = [
  {
    id: "DLC-2026-891",
    bookingId: "DLC-2026-891",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: "CONFIRMED",
    customer: {
      userId: "cust_demo_rohit",
      name: "Rohit Deshmukh",
      phone: "+91 98201 45678",
      email: "rohit@example.com"
    },
    reservation: {
      date: new Date().toISOString().split("T")[0],
      timeSlot: "07:30 PM",
      areaId: "mezzanine-lounge",
      areaName: "Upper Mezzanine Lounge",
      guestCount: 4,
      occasion: "Birthday Celebration",
      specialRequests: "Please arrange screen for birthday video presentation"
    },
    preOrder: {
      hasPreOrder: true,
      items: [
        {
          id: "pz-1",
          name: "Margherita Pizza",
          variant: "8 Inch",
          price: 149,
          quantity: 2,
          itemTotal: 298,
          isVeg: true
        },
        {
          id: "mc-2",
          name: "Blue Ocean Mojito",
          variant: "Standard",
          price: 160,
          quantity: 2,
          itemTotal: 320,
          isVeg: true
        },
        {
          id: "fr-2",
          name: "Peri Peri Fries",
          variant: "Standard",
          price: 79,
          quantity: 1,
          itemTotal: 79,
          isVeg: true
        }
      ],
      subtotal: 697,
      taxIncluded: true,
      totalBill: 697
    },
    payment: {
      method: "UPI_QR",
      status: "PAID",
      transactionId: "TXN-DLC-M19Z-4120",
      amount: 697,
      paidAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    notification: {
      emailSent: true,
      emailSentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      sentTo: "rohit@example.com"
    },
    adminNotes: "Customer requested extra chairs for 2 more friends."
  },
  {
    id: "DLC-2026-442",
    bookingId: "DLC-2026-442",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "PENDING",
    customer: {
      userId: null,
      name: "Sneha Patil",
      phone: "+91 98192 33445",
      email: "sneha.p@example.com"
    },
    reservation: {
      date: new Date().toISOString().split("T")[0],
      timeSlot: "06:00 PM",
      areaId: "neon-booth",
      areaName: "Good Food Good Mood Neon Booth",
      guestCount: 2,
      occasion: "Romantic Date",
      specialRequests: "Table near the amber neon sign please"
    },
    preOrder: {
      hasPreOrder: true,
      items: [
        {
          id: "wr-1",
          name: "Chicken Jalfrezi Wrap",
          variant: "Standard",
          price: 99,
          quantity: 2,
          itemTotal: 198,
          isVeg: false
        },
        {
          id: "cbv-1",
          name: "Spanish Iced Latte",
          variant: "Standard",
          price: 190,
          quantity: 2,
          itemTotal: 380,
          isVeg: true
        }
      ],
      subtotal: 578,
      taxIncluded: true,
      totalBill: 578
    },
    payment: {
      method: "PAY_AT_COUNTER",
      status: "PENDING",
      transactionId: null,
      amount: 578,
      paidAt: null
    },
    notification: {
      emailSent: true,
      emailSentAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      sentTo: "sneha.p@example.com"
    },
    adminNotes: "Pay at counter on arrival."
  }
];

// Helper: Get local bookings from localStorage
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

// Helper: Save local bookings
function saveLocalBookings(bookings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new Event(BOOKING_EVENT_NAME));
  } catch (err) {
    console.error("Local storage save error:", err);
  }
}

/**
 * 🔒 TRUSTED BILL RECALCULATION
 */
export function calculateTrustedBill(selectedItems = []) {
  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    return {
      hasPreOrder: false,
      items: [],
      subtotal: 0,
      taxIncluded: true,
      totalBill: 0,
      count: 0
    };
  }

  const verifiedItems = [];
  let subtotal = 0;
  let totalCount = 0;

  for (const selection of selectedItems) {
    const qty = parseInt(selection.quantity, 10);
    if (isNaN(qty) || qty <= 0) continue;

    const menuItem = MENU_ITEMS.find((m) => m.id === selection.itemId);
    if (!menuItem) continue;

    let trustedPrice = 0;
    let variantLabel = selection.variantLabel || "Standard";

    if (menuItem.variants && menuItem.variants.length > 0) {
      const matchedVariant = menuItem.variants.find(
        (v) => v.label.toLowerCase() === variantLabel.toLowerCase()
      ) || menuItem.variants[0];
      trustedPrice = matchedVariant.price;
      variantLabel = matchedVariant.label;
    } else {
      trustedPrice = menuItem.price || 0;
    }

    const itemTotal = qty * trustedPrice;
    subtotal += itemTotal;
    totalCount += qty;

    verifiedItems.push({
      id: menuItem.id,
      name: menuItem.name,
      category: menuItem.category,
      variant: variantLabel,
      price: trustedPrice,
      quantity: qty,
      itemTotal: itemTotal,
      isVeg: Boolean(menuItem.isVeg),
      image: menuItem.image || null
    });
  }

  return {
    hasPreOrder: verifiedItems.length > 0,
    items: verifiedItems,
    subtotal: subtotal,
    taxIncluded: true,
    totalBill: subtotal,
    count: totalCount
  };
}

/**
 * 🔒 DOUBLE BOOKING PREVENTION
 */
export async function checkSlotAvailability(date, timeSlot, areaId) {
  if (!date || !timeSlot || !areaId) {
    return { available: true };
  }

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, "bookings"),
        where("reservation.date", "==", date),
        where("reservation.timeSlot", "==", timeSlot),
        where("reservation.areaId", "==", areaId),
        where("status", "in", ["PENDING", "CONFIRMED", "SEATED"])
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return {
          available: false,
          reason: "This seating area is already reserved for the selected time. Please choose another time slot or seating area."
        };
      }
      return { available: true };
    } catch (err) {
      console.warn("Firestore availability check fallback:", err);
    }
  }

  const localList = getLocalBookings();
  const conflict = localList.find(
    (b) =>
      b.reservation?.date === date &&
      b.reservation?.timeSlot === timeSlot &&
      b.reservation?.areaId === areaId &&
      ["PENDING", "CONFIRMED", "SEATED"].includes(b.status)
  );

  if (conflict) {
    return {
      available: false,
      reason: "This seating area is already reserved for the selected time. Please choose another time slot or seating area."
    };
  }

  return { available: true };
}

/**
 * 📝 CREATE NEW BOOKING WITH PAYMENT & EMAIL GENERATION
 */
export async function createBooking({
  customer,
  reservation,
  rawPreOrderItems = [],
  payment = null
}) {
  if (!customer?.name || !customer?.phone) {
    throw new Error("Customer name and phone number are required.");
  }
  if (!reservation?.date || !reservation?.timeSlot || !reservation?.areaId) {
    throw new Error("Date, time slot, and seating area are required.");
  }

  // 1. Check double-booking
  const availability = await checkSlotAvailability(
    reservation.date,
    reservation.timeSlot,
    reservation.areaId
  );
  if (!availability.available) {
    throw new Error(availability.reason);
  }

  // 2. Compute trusted bill snapshot from trusted menu
  const calculatedBill = calculateTrustedBill(rawPreOrderItems);

  // 3. Generate unique Booking Reference ID
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const bookingId = `DLC-${new Date().getFullYear()}-${randomSuffix}`;
  const now = new Date().toISOString();

  // 4. Default payment object
  const paymentRecord = payment || {
    method: "PAY_AT_COUNTER",
    status: "PENDING",
    transactionId: null,
    amount: calculatedBill.totalBill,
    paidAt: null
  };

  const newBooking = {
    id: bookingId,
    bookingId: bookingId,
    createdAt: now,
    status: "CONFIRMED", // Auto-accepted upon passing valid slot availability check!
    autoAccepted: true,
    customer: {
      userId: customer.userId || null,
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email ? customer.email.trim() : ""
    },
    reservation: {
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      areaId: reservation.areaId,
      areaName: reservation.areaName || reservation.areaId,
      guestCount: parseInt(reservation.guestCount, 10) || 2,
      occasion: reservation.occasion || "Casual Hangout",
      specialRequests: reservation.specialRequests ? reservation.specialRequests.trim() : ""
    },
    preOrder: calculatedBill,
    payment: paymentRecord,
    notification: {
      emailSent: Boolean(customer.email),
      emailSentAt: customer.email ? now : null,
      sentTo: customer.email ? customer.email.trim() : ""
    },
    adminNotes: ""
  };

  // 5. Trigger automated email generation / dispatch if customer email provided
  if (newBooking.customer.email) {
    sendBookingConfirmationEmail(newBooking).catch((e) =>
      console.warn("Email dispatch error:", e)
    );
  }

  // 6. Save to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "bookings", bookingId), newBooking);
      console.log("[Firebase] Successfully created booking in Firestore:", bookingId);
      return newBooking;
    } catch (err) {
      console.error("[Firebase] Error creating booking document:", err);
    }
  }

  // Save to Local DB
  const localList = getLocalBookings();
  localList.unshift(newBooking);
  saveLocalBookings(localList);

  return newBooking;
}

/**
 * 👤 GET BOOKINGS FOR A SPECIFIC CUSTOMER (For "My Bookings" Customer Portal)
 */
export function getUserBookings(emailOrUid, onData) {
  const cleanTarget = (emailOrUid || "").trim().toLowerCase();

  const filterBookings = (all) => {
    return all.filter(
      (b) =>
        (b.customer?.userId && b.customer.userId === emailOrUid) ||
        (b.customer?.email && b.customer.email.toLowerCase() === cleanTarget)
    );
  };

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const list = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          onData(filterBookings(list));
        },
        () => {
          onData(filterBookings(getLocalBookings()));
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("User bookings subscription fallback:", err);
    }
  }

  const handleUpdate = () => {
    onData(filterBookings(getLocalBookings()));
  };

  window.addEventListener(BOOKING_EVENT_NAME, handleUpdate);
  window.addEventListener("storage", handleUpdate);

  onData(filterBookings(getLocalBookings()));

  return () => {
    window.removeEventListener(BOOKING_EVENT_NAME, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}

/**
 * ❌ CANCEL BOOKING (CUSTOMER OR ADMIN ACTION)
 */
export async function cancelBooking(bookingId, cancellationReason = "Customer requested cancellation") {
  const updates = {
    status: "CANCELLED",
    cancellationReason: cancellationReason,
    cancelledAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, "bookings", bookingId);
      await updateDoc(ref, updates);
      return true;
    } catch (err) {
      console.error("[Firebase] Cancel booking error:", err);
    }
  }

  const list = getLocalBookings();
  const idx = list.findIndex((b) => b.id === bookingId || b.bookingId === bookingId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalBookings(list);
    return true;
  }
  return false;
}

/**
 * 📡 REAL-TIME SUBSCRIPTION TO ALL BOOKINGS (For Admin Dashboard)
 */
export function subscribeToBookings(onData, onError) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const bookings = [];
          snapshot.forEach((docSnap) => {
            bookings.push({ id: docSnap.id, ...docSnap.data() });
          });
          onData(bookings);
        },
        (error) => {
          console.warn("[Firebase] Real-time listener error, falling back to local:", error);
          if (onError) onError(error);
          onData(getLocalBookings());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Firestore subscription error:", err);
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

/**
 * 🔄 UPDATE BOOKING STATUS & ADMIN NOTES
 */
export async function updateBookingStatus(bookingId, newStatus, adminNotes = null) {
  const updates = {
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
  if (adminNotes !== null) {
    updates.adminNotes = adminNotes;
  }

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, "bookings", bookingId);
      await updateDoc(ref, updates);
      return true;
    } catch (err) {
      console.error("[Firebase] Error updating booking status:", err);
    }
  }

  const list = getLocalBookings();
  const idx = list.findIndex((b) => b.id === bookingId || b.bookingId === bookingId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    if (adminNotes !== null) {
      list[idx].adminNotes = adminNotes;
    }
    saveLocalBookings(list);
    return true;
  }
  return false;
}

/**
 * 🚶 ADD WALK-IN RESERVATION (ADMIN ACTION)
 */
export async function createWalkInBooking({
  customerName,
  phone = "",
  guestCount = 2,
  areaId = "ground-classic",
  areaName = "Ground Floor Classic",
  rawPreOrderItems = [],
  adminNotes = "Walk-in customer at counter",
  paymentMethod = "CASH"
}) {
  const calculatedBill = calculateTrustedBill(rawPreOrderItems);
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  const dateString = now.toISOString().split("T")[0];
  const bookingId = `DLC-WALKIN-${Math.floor(100 + Math.random() * 900)}`;

  const walkInBooking = {
    id: bookingId,
    bookingId: bookingId,
    createdAt: now.toISOString(),
    status: "SEATED",
    customer: {
      userId: null,
      name: customerName || "Walk-In Guest",
      phone: phone || "N/A",
      email: ""
    },
    reservation: {
      date: dateString,
      timeSlot: timeString,
      areaId: areaId,
      areaName: areaName,
      guestCount: parseInt(guestCount, 10) || 2,
      occasion: "Walk-in Dining",
      specialRequests: "Table assigned at counter"
    },
    preOrder: calculatedBill,
    payment: {
      method: paymentMethod,
      status: "PAID",
      transactionId: `WALKIN-${Date.now().toString(36).toUpperCase()}`,
      amount: calculatedBill.totalBill,
      paidAt: now.toISOString()
    },
    notification: {
      emailSent: false,
      emailSentAt: null,
      sentTo: ""
    },
    adminNotes: adminNotes
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "bookings", bookingId), walkInBooking);
      return walkInBooking;
    } catch (err) {
      console.error("[Firebase] Error creating walk-in booking:", err);
    }
  }

  const list = getLocalBookings();
  list.unshift(walkInBooking);
  saveLocalBookings(list);
  return walkInBooking;
}

/**
 * 💬 FORMAT WHATSAPP CONFIRMATION MESSAGE
 */
export function formatWhatsAppMessage(booking) {
  const { customer, reservation, preOrder, payment, bookingId } = booking;
  let text = `*DUPLEX LOUNGE CAFE — BOOKING CONFIRMATION* ☕\n\n`;
  text += `Hello *${customer.name}*,\nYour table reservation at Duplex Lounge Cafe is confirmed!\n\n`;
  text += `📋 *Booking ID:* ${bookingId}\n`;
  text += `📅 *Date:* ${reservation.date}\n`;
  text += `⏰ *Time:* ${reservation.timeSlot}\n`;
  text += `🛋️ *Seating Area:* ${reservation.areaName}\n`;
  text += `👥 *Guests:* ${reservation.guestCount} person(s)\n`;
  if (reservation.occasion && reservation.occasion !== "Casual Hangout") {
    text += `🎉 *Occasion:* ${reservation.occasion}\n`;
  }

  if (payment?.status === "PAID") {
    text += `💳 *Payment:* PAID ONLINE (Txn: ${payment.transactionId || "Verified"})\n`;
  } else {
    text += `💳 *Payment:* Pay at Cafe / Counter\n`;
  }

  if (preOrder?.hasPreOrder && preOrder.items.length > 0) {
    text += `\n🍽️ *Pre-Ordered Items:*\n`;
    preOrder.items.forEach((item) => {
      text += `• ${item.quantity}x ${item.name} (${item.variant}) — ₹${item.itemTotal}\n`;
    });
    text += `💰 *Total Bill:* ₹${preOrder.totalBill} _(All taxes included)_\n`;
  }

  text += `\n📍 *Location:* Shop No. 2, Sai Suman Building, Next to Tisai Gate, Tisgao Naka, Kalyan (W)\n`;
  text += `✨ *Good Food • Great Vibes • Memorable Moments*`;

  return encodeURIComponent(text);
}

/**
 * ⏰ PARSE BOOKING DATE & TIME SLOT INTO JAVASCRIPT DATE OBJECT
 */
export function parseBookingDateTime(dateStr, timeSlotStr) {
  if (!dateStr) return null;
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    let hours = 12;
    let minutes = 0;

    if (timeSlotStr) {
      const match = timeSlotStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const period = match[3].toUpperCase();
        if (period === "PM" && h < 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        hours = h;
        minutes = m;
      }
    }

    return new Date(year, month - 1, day, hours, minutes, 0);
  } catch {
    return null;
  }
}

/**
 * 🔒 6-HOUR EDIT POLICY CHECK
 * Enforces the rule: Customers can only edit their reservation if > 6 hours remain.
 * When <= 6 hours remain, the booking is finalized/locked for kitchen & table prep.
 */
export function isBookingEditable(booking, bufferHours = 6) {
  if (!booking || !booking.reservation?.date) {
    return { canEdit: false, hoursRemaining: 0, reason: "Invalid booking details." };
  }

  // If already cancelled or completed
  if (["CANCELLED", "COMPLETED", "SEATED"].includes(booking.status)) {
    return {
      canEdit: false,
      hoursRemaining: 0,
      reason: `Booking is already ${booking.status.toLowerCase()}.`
    };
  }

  const bookingDate = parseBookingDateTime(
    booking.reservation.date,
    booking.reservation.timeSlot
  );

  if (!bookingDate) {
    return { canEdit: false, hoursRemaining: 0, reason: "Unable to parse booking date." };
  }

  const now = new Date();
  const diffMs = bookingDate.getTime() - now.getTime();
  const hoursRemaining = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;

  if (hoursRemaining < bufferHours) {
    return {
      canEdit: false,
      hoursRemaining: Math.max(0, hoursRemaining),
      reason: `Locked: Modifications are allowed only up to 6 hours before arrival (${hoursRemaining <= 0 ? "Reservation time reached" : `${hoursRemaining}h remaining`}). Call the cafe for urgent assistance.`
    };
  }

  return {
    canEdit: true,
    hoursRemaining: hoursRemaining,
    reason: `Editable: ${Math.floor(hoursRemaining)} hours remaining before reservation lock.`
  };
}

/**
 * ✏️ CUSTOMER UPDATE / EDIT BOOKING (SUBJECT TO 6-HOUR POLICY)
 */
export async function updateCustomerBooking({
  bookingId,
  reservation,
  rawPreOrderItems = [],
  customer = null
}) {
  const localList = getLocalBookings();
  const existing = localList.find((b) => b.id === bookingId || b.bookingId === bookingId);

  if (!existing) {
    throw new Error("Booking not found.");
  }

  // Check 6-hour policy
  const editCheck = isBookingEditable(existing, 6);
  if (!editCheck.canEdit) {
    throw new Error(editCheck.reason);
  }

  // Check double-booking if date/time/area was altered
  if (
    reservation.date !== existing.reservation?.date ||
    reservation.timeSlot !== existing.reservation?.timeSlot ||
    reservation.areaId !== existing.reservation?.areaId
  ) {
    const availability = await checkSlotAvailability(
      reservation.date,
      reservation.timeSlot,
      reservation.areaId
    );
    if (!availability.available) {
      throw new Error(availability.reason);
    }
  }

  const calculatedBill = calculateTrustedBill(rawPreOrderItems);
  const now = new Date().toISOString();

  const updates = {
    updatedAt: now,
    lastModifiedBy: "customer",
    reservation: {
      ...existing.reservation,
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      areaId: reservation.areaId,
      areaName: reservation.areaName || reservation.areaId,
      guestCount: parseInt(reservation.guestCount, 10) || existing.reservation.guestCount,
      occasion: reservation.occasion || existing.reservation.occasion,
      specialRequests:
        reservation.specialRequests !== undefined
          ? reservation.specialRequests
          : existing.reservation.specialRequests
    },
    preOrder: calculatedBill,
    status: existing.status === "CANCELLED" ? "CONFIRMED" : existing.status
  };

  if (customer) {
    updates.customer = {
      ...existing.customer,
      ...customer
    };
  }

  // Save to Firebase Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, "bookings", bookingId);
      await updateDoc(ref, updates);
    } catch (err) {
      console.warn("[Firebase] Booking update warning:", err);
    }
  }

  // Update Local DB
  const idx = localList.findIndex((b) => b.id === bookingId || b.bookingId === bookingId);
  if (idx !== -1) {
    localList[idx] = { ...localList[idx], ...updates };
    saveLocalBookings(localList);

    // Send updated confirmation email
    if (localList[idx].customer?.email) {
      sendBookingConfirmationEmail(localList[idx]).catch((e) => console.warn(e));
    }

    return localList[idx];
  }

  return { ...existing, ...updates };
}

/**
 * 🟢 GET LIVE AVAILABILITY MATRIX FOR A DATE
 * Returns an object with booked slot identifiers and live table occupancy
 */
export function getLiveDayAvailabilityMatrix(date) {
  const localList = getLocalBookings();
  const dateBookings = localList.filter(
    (b) => b.reservation?.date === date && ["CONFIRMED", "PENDING", "SEATED"].includes(b.status)
  );

  const bookedMap = {};
  dateBookings.forEach((b) => {
    const key = `${b.reservation?.timeSlot}_${b.reservation?.areaId}`;
    bookedMap[key] = {
      isBooked: true,
      bookingId: b.bookingId,
      timeSlot: b.reservation?.timeSlot,
      areaId: b.reservation?.areaId,
      areaName: b.reservation?.areaName
    };
  });

  return bookedMap;
}
