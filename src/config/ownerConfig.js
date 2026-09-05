/**
 * ☕ DUPLEX LOUNGE CAFE — OWNER & BUSINESS PRODUCTION CONFIGURATION
 *
 * When the owner shares their real details, simply update the fields below:
 * 1. WHATSAPP_PHONE: Owner's real WhatsApp number with country code (e.g., "919876543210")
 * 2. CALLING_PHONE: Customer support / reservation phone number
 * 3. BUSINESS_EMAIL: Owner / Cafe official email for confirmation notifications
 * 4. UPI_VPA: Official UPI ID for direct QR code & app payments (e.g., "duplexcafe@okicici")
 * 5. RAZORPAY_KEY_ID: (Optional) Live Razorpay Gateway key if using automated card checkout
 */

export const OWNER_CONFIG = {
  // 📱 Owner WhatsApp Number (Format: CountryCode + 10 digits without + or spaces)
  // Placeholder — replace with the real WhatsApp Business number before going live.
  whatsappPhone: import.meta.env.VITE_CAFE_WHATSAPP_PHONE || "918369576147",

  // 📞 Calling Phone Number (For website direct call button)
  callingPhone: import.meta.env.VITE_CAFE_CALL_PHONE || "+91 83695 76147",
  callingPhoneDisplay: "+91 83695 76147",

  // 📧 Official Cafe Email Address
  businessEmail: import.meta.env.VITE_CAFE_EMAIL || "contact@duplexloungecafe.com",
  adminNotificationEmail: import.meta.env.VITE_ADMIN_EMAIL || "admin@duplexloungecafe.com",

  // 💳 UPI Payment Gateway Configuration
  upi: {
    vpa: import.meta.env.VITE_CAFE_UPI_VPA || "duplexlounge@upi",
    merchantName: "Duplex Lounge Cafe",
    merchantCode: "5812", // Restaurant / Cafe MCC
    currency: "INR"
  },

  // 🌐 Razorpay / Payment Gateway API Key (Optional)
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_duplex_key",

  // 📍 Location Coordinates & Maps
  address: {
    shop: "Shop No. 2, Sai Suman Building",
    landmark: "Next to Tisai Gate, Tisgao Naka",
    area: "Santosh Nagar",
    city: "Kalyan (East)",
    state: "Maharashtra",
    pincode: "421306",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Duplex+Lounge+Cafe+Tisgao+Naka+Kalyan"
  },

  // 📸 Social
  instagram: "https://www.instagram.com/duplexloungecafe",
  instagramHandle: "@duplexloungecafe"
};

/**
 * 📲 HELPER: CLEAN & STANDARDIZE PHONE NUMBER WITH COUNTRY CODE
 */
export function formatPhoneNumber(phone) {
  if (!phone) return "";
  let clean = phone.replace(/\D/g, "");
  // If 10 digits without country code, default to India +91
  if (clean.length === 10) {
    clean = `91${clean}`;
  }
  return clean;
}

/**
 * 📲 HELPER: GENERATE CLEAN WHATSAPP REDIRECT URL
 * If targetPhone is provided, formats directly to that recipient mobile number.
 * Otherwise defaults to the cafe owner's WhatsApp number.
 */
export function getWhatsAppUrl(messageText, targetPhone = null) {
  const cleanPhone = formatPhoneNumber(targetPhone || OWNER_CONFIG.whatsappPhone);
  return `https://wa.me/${cleanPhone}?text=${messageText}`;
}

/**
 * 💬 HELPER: GENERATE DIRECT SMS URL
 */
export function getSmsUrl(messageText, targetPhone = null) {
  const cleanPhone = formatPhoneNumber(targetPhone || "");
  return `sms:${cleanPhone}?body=${messageText}`;
}

/**
 * 📧 HELPER: GENERATE DIRECT MAILTO URL FOR EMAIL CLIENTS
 */
export function getEmailMailtoUrl(booking) {
  if (!booking) return "";
  const recipient = booking.customer?.email || "";
  const subject = encodeURIComponent(`Duplex Lounge Cafe — Table Reservation #${booking.bookingId}`);
  const body = encodeURIComponent(
    `Hello ${booking.customer?.name || "Guest"},\n\nYour table reservation #${booking.bookingId} at Duplex Lounge Cafe is confirmed!\n\n` +
    `📅 Date: ${booking.reservation?.date}\n` +
    `⏰ Time Slot: ${booking.reservation?.timeSlot}\n` +
    `🛋️ Seating Area: ${booking.reservation?.areaName}\n` +
    `👥 Guests: ${booking.reservation?.guestCount} Person(s)\n` +
    (booking.reservation?.occasion && booking.reservation?.occasion !== "Casual Hangout" ? `🎉 Occasion: ${booking.reservation.occasion}\n` : "") +
    (booking.reservation?.specialRequests ? `💬 Special Requests: ${booking.reservation.specialRequests}\n` : "") +
    `\n📍 Location: Shop No. 2, Sai Suman Building, Next to Tisai Gate, Tisgao Naka, Kalyan (W)\n` +
    `📞 Contact: ${OWNER_CONFIG.callingPhoneDisplay}\n\n` +
    `We look forward to hosting you at Duplex Lounge Cafe!`
  );
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}
