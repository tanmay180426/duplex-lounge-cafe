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
  // Example: "919820123456"
  whatsappPhone: import.meta.env.VITE_CAFE_WHATSAPP_PHONE || "919820000000",

  // 📞 Calling Phone Number (For website direct call button)
  callingPhone: import.meta.env.VITE_CAFE_CALL_PHONE || "+91 98200 00000",
  callingPhoneDisplay: "+91 98200 00000",

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
    city: "Kalyan (West)",
    state: "Maharashtra",
    pincode: "421306",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Duplex+Lounge+Cafe+Tisgao+Naka+Kalyan"
  },

  // 📸 Social
  instagram: "https://www.instagram.com/duplexloungecafe",
  instagramHandle: "@duplexloungecafe"
};

/**
 * 📲 HELPER: GENERATE CLEAN WHATSAPP REDIRECT URL
 * If targetPhone is provided (e.g. customer's number for admin), sends to customer.
 * Otherwise sends to the cafe owner's real WhatsApp number.
 */
export function getWhatsAppUrl(messageText, targetPhone = null) {
  const cleanPhone = (targetPhone || OWNER_CONFIG.whatsappPhone).replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${messageText}`;
}
