/**
 * ☕ DUPLEX LOUNGE CAFE — FIREBASE CLOUD FUNCTIONS
 *
 * Capabilities:
 * 1. 🔔 onBookingCreated: Firestore trigger notifying the admin of new bookings.
 *
 * Note: We do NOT auto-email customers from here. The customer receives an
 * in-app animated booking confirmation with their booking ID, and can
 * optionally receive a copy via WhatsApp from the confirmation screen.
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Default region: Asia South 1 (Mumbai)
setGlobalOptions({ region: "asia-south1", maxInstances: 10 });

// Admin notification email (where booking alerts are sent).
// Configure via Firebase: functions:secrets:set ADMIN_NOTIFICATION_EMAIL
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@example.com";

/**
 * 🔔 FIRESTORE TRIGGER: ON BOOKING CREATED
 * Creates an admin-side notification record so the cafe owner sees new
 * reservations in their Admin Dashboard. (No external email is sent by V1.)
 */
exports.onBookingCreated = onDocumentCreated("bookings/{bookingId}", async (event) => {
  const snap = event.data;
  if (!snap) return;
  const booking = snap.data();
  const id = event.params.bookingId;

  try {
    await db.collection("admin_notifications").add({
      type: "NEW_BOOKING",
      bookingId: id,
      customerName: booking.name || booking.customer?.name || "Guest",
      customerPhone: booking.phone || booking.customer?.phone || "",
      customerEmail: booking.email || booking.customer?.email || "",
      date: booking.date || booking.reservation?.date || "",
      timeSlot: booking.timeSlot || booking.reservation?.timeSlot || "",
      guests: booking.partySize || booking.reservation?.guestCount || 2,
      zone: booking.zoneName || booking.reservation?.areaName || "",
      specialRequests:
        booking.specialRequests || booking.reservation?.specialRequests || "",
      status: booking.status || "PENDING",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
    console.log(`[Admin Notification] Queued for booking ${id} -> ${ADMIN_NOTIFICATION_EMAIL}`);
  } catch (err) {
    console.error("[Admin Notification] Failed to queue:", err);
  }
});