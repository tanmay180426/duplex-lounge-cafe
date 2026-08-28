import { collection, doc, setDoc, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { OWNER_CONFIG } from "../config/ownerConfig";

const PAYMENTS_LOCAL_STORAGE_KEY = "duplex_payments_db";
const PAYMENT_EVENT_NAME = "duplex_payment_update";

// UPI VPA details for Duplex Lounge Cafe
export const UPI_CONFIG = OWNER_CONFIG.upi;

/**
 * 🔗 GENERATE UPI DEEP LINK & QR URI
 */
export function generateUpiUri(amount = 0, bookingId = "DLC-RES") {
  const cleanAmount = Number(amount).toFixed(2);
  const note = encodeURIComponent(`Booking ${bookingId} - Duplex Lounge Cafe`);
  const name = encodeURIComponent(UPI_CONFIG.merchantName);
  return `upi://pay?pa=${UPI_CONFIG.vpa}&pn=${name}&am=${cleanAmount}&cu=${UPI_CONFIG.currency}&tn=${note}`;
}

/**
 * 💾 GET LOCAL PAYMENTS FROM LOCALSTORAGE
 */
export function getLocalPayments() {
  try {
    const raw = localStorage.getItem(PAYMENTS_LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * 💾 SAVE LOCAL PAYMENTS
 */
function saveLocalPayments(payments) {
  try {
    localStorage.setItem(PAYMENTS_LOCAL_STORAGE_KEY, JSON.stringify(payments));
    window.dispatchEvent(new Event(PAYMENT_EVENT_NAME));
  } catch (err) {
    console.error("Failed saving local payment:", err);
  }
}

/**
 * 💳 PROCESS ONLINE PAYMENT SIMULATION
 */
export async function processOnlinePayment({
  amount = 0,
  method = "UPI_QR",
  bookingId = "DLC-RES",
  customer = {},
  paymentDetails = {}
}) {
  // Simulate payment processing time (1.2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const txnId = `TXN-DLC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const paymentRecord = {
    id: txnId,
    transactionId: txnId,
    bookingId: bookingId,
    amount: Number(amount) || 0,
    currency: "INR",
    method: method,
    status: method === "PAY_AT_COUNTER" ? "PENDING" : "PAID",
    customer: {
      name: customer.name || "Guest",
      phone: customer.phone || "",
      email: customer.email || ""
    },
    paymentDetails: {
      gateway: "DLC Express Pay",
      cardLast4: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : null,
      cardBrand: paymentDetails.cardBrand || null,
      upiVpa: paymentDetails.upiVpa || UPI_CONFIG.vpa,
      bankName: paymentDetails.bankName || null
    },
    createdAt: now,
    paidAt: method === "PAY_AT_COUNTER" ? null : now
  };

  // Save to Firebase Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "payments", txnId), paymentRecord);
      console.log("[Firebase] Successfully saved payment record:", txnId);
    } catch (err) {
      console.error("[Firebase] Error saving payment to Firestore:", err);
    }
  }

  // Save to Local DB
  const localList = getLocalPayments();
  localList.unshift(paymentRecord);
  saveLocalPayments(localList);

  return {
    success: true,
    transactionId: txnId,
    amount: Number(amount) || 0,
    status: paymentRecord.status,
    method: method,
    paidAt: paymentRecord.paidAt,
    record: paymentRecord
  };
}

/**
 * 📡 SUBSCRIBE TO ALL PAYMENTS (For Admin Dashboard Analytics)
 */
export function subscribeToPayments(onData) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = [];
          snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
          onData(list);
        },
        (err) => {
          console.warn("[Firebase] Payments subscription error, fallback to local:", err);
          onData(getLocalPayments());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Payments subscription fallback:", err);
    }
  }

  const handleUpdate = () => {
    onData(getLocalPayments());
  };

  window.addEventListener(PAYMENT_EVENT_NAME, handleUpdate);
  window.addEventListener("storage", handleUpdate);

  onData(getLocalPayments());

  return () => {
    window.removeEventListener(PAYMENT_EVENT_NAME, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}
