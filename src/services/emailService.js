import { CAFE_INFO } from "../data/cafeInfo";
import { OWNER_CONFIG } from "../config/ownerConfig";

/**
 * 📧 GENERATE RESPONSIVE HTML EMAIL CONFIRMATION TEMPLATE
 * Formats a modern, luxury dark/gold email receipt with complete booking details.
 */
export function generateBookingEmailHtml(booking) {
  if (!booking) return "";

  const {
    bookingId = "DLC-RES-000",
    customer = {},
    reservation = {},
    preOrder = {},
    payment = {},
    createdAt = new Date().toISOString()
  } = booking;

  const dateFormatted = reservation.date
    ? new Date(reservation.date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "N/A";

  const bookingDateCreated = new Date(createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const paymentStatus = payment.status === "PAID" ? "PAID ONLINE" : "PAY AT CAFE";
  const paymentColor = payment.status === "PAID" ? "#10B981" : "#D97706";

  const preOrderItemsHtml =
    preOrder?.hasPreOrder && preOrder.items?.length > 0
      ? preOrder.items
          .map(
            (item) => `
          <tr style="border-bottom: 1px solid #262626;">
            <td style="padding: 10px 0; color: #E5E5E5; font-size: 14px;">
              <strong>${item.name}</strong> 
              <span style="color: #A3A3A3; font-size: 12px;">(${item.variant || "Standard"})</span>
              ${item.isVeg ? '<span style="color: #22C55E; font-size: 11px; margin-left: 4px;">● Veg</span>' : '<span style="color: #EF4444; font-size: 11px; margin-left: 4px;">● Non-Veg</span>'}
            </td>
            <td style="padding: 10px 0; text-align: center; color: #D4D4D4; font-size: 14px;">
              x${item.quantity}
            </td>
            <td style="padding: 10px 0; text-align: right; color: #E5D5C5; font-size: 14px; font-weight: bold;">
              ₹${item.itemTotal}
            </td>
          </tr>
        `
          )
          .join("")
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation — ${bookingId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E5E5E5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A0A0A; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141414; border: 1px solid #2A2421; border-radius: 6px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(180deg, #1F1916 0%, #141414 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #C49A6C;">
              <div style="display: inline-block; width: 48px; height: 48px; border-radius: 50%; border: 1.5px solid #C49A6C; line-height: 48px; font-size: 16px; font-weight: bold; color: #E5D5C5; margin-bottom: 12px;">
                DLC
              </div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 4px; color: #F5EFEB; text-transform: uppercase;">
                DUP<span style="color: #C49A6C;">L</span>EX
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 3px; color: #A3968C; text-transform: uppercase;">
                Lounge Cafe • Kalyan
              </p>
            </td>
          </tr>

          <!-- Confirmation Title -->
          <tr>
            <td style="padding: 28px 24px 16px 24px; text-align: center;">
              <span style="display: inline-block; background-color: rgba(196, 154, 108, 0.15); border: 1px solid rgba(196, 154, 108, 0.4); color: #C49A6C; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; margin-bottom: 12px;">
                Table Reservation Confirmed
              </span>
              <h2 style="margin: 0; font-size: 22px; color: #FFFFFF; font-weight: 600;">
                Hello ${customer.name || "Guest"},
              </h2>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #A3A3A3; line-height: 1.5;">
                We are thrilled to host you! Your seating reservation at Duplex Lounge Cafe is confirmed. Below are your booking details.
              </p>
            </td>
          </tr>

          <!-- Booking Reference Card -->
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1A1816; border: 1px solid #332B25; border-radius: 4px; padding: 16px;">
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; color: #A3968C; text-transform: uppercase; letter-spacing: 1px;">
                          Booking Reference
                        </td>
                        <td align="right" style="font-size: 11px; font-weight: bold; color: ${paymentColor}; background-color: rgba(0,0,0,0.4); padding: 4px 8px; border-radius: 3px; border: 1px solid ${paymentColor};">
                          ${paymentStatus}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="font-size: 20px; font-weight: bold; color: #C49A6C; letter-spacing: 1.5px; padding-top: 6px;">
                          ${bookingId}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="font-size: 11px; color: #737373; padding-top: 4px;">
                          Booked on ${bookingDateCreated}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reservation Details Grid -->
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #181818; border: 1px solid #262626; border-radius: 4px;">
                <tr>
                  <td width="50%" style="padding: 16px; border-bottom: 1px solid #262626; border-right: 1px solid #262626;">
                    <div style="font-size: 11px; color: #8C827A; text-transform: uppercase; letter-spacing: 1px;">📅 Date</div>
                    <div style="font-size: 15px; font-weight: 600; color: #F5EFEB; margin-top: 4px;">${dateFormatted}</div>
                  </td>
                  <td width="50%" style="padding: 16px; border-bottom: 1px solid #262626;">
                    <div style="font-size: 11px; color: #8C827A; text-transform: uppercase; letter-spacing: 1px;">⏰ Time Slot</div>
                    <div style="font-size: 15px; font-weight: 600; color: #F5EFEB; margin-top: 4px;">${reservation.timeSlot || "N/A"}</div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 16px; border-right: 1px solid #262626;">
                    <div style="font-size: 11px; color: #8C827A; text-transform: uppercase; letter-spacing: 1px;">🛋️ Seating Area</div>
                    <div style="font-size: 15px; font-weight: 600; color: #C49A6C; margin-top: 4px;">${reservation.areaName || "Main Dining"}</div>
                  </td>
                  <td width="50%" style="padding: 16px;">
                    <div style="font-size: 11px; color: #8C827A; text-transform: uppercase; letter-spacing: 1px;">👥 Guests</div>
                    <div style="font-size: 15px; font-weight: 600; color: #F5EFEB; margin-top: 4px;">${reservation.guestCount || 2} Persons</div>
                  </td>
                </tr>
                ${
                  reservation.occasion && reservation.occasion !== "Casual Hangout"
                    ? `
                <tr>
                  <td colspan="2" style="padding: 12px 16px; background-color: #141312; border-top: 1px solid #262626; font-size: 13px; color: #E5D5C5;">
                    🎉 <strong>Occasion:</strong> ${reservation.occasion}
                  </td>
                </tr>
                `
                    : ""
                }
                ${
                  reservation.specialRequests
                    ? `
                <tr>
                  <td colspan="2" style="padding: 12px 16px; background-color: #141312; border-top: 1px solid #262626; font-size: 13px; color: #A3A3A3; font-style: italic;">
                    💬 <strong>Special Requests:</strong> "${reservation.specialRequests}"
                  </td>
                </tr>
                `
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Pre-Ordered Food Table (if any) -->
          ${
            preOrder?.hasPreOrder && preOrder.items?.length > 0
              ? `
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #C49A6C;">
                🍽️ Pre-Ordered Items
              </h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #181818; border: 1px solid #262626; border-radius: 4px; padding: 12px 16px;">
                <thead>
                  <tr style="border-bottom: 1px solid #333333;">
                    <th align="left" style="padding-bottom: 8px; color: #8C827A; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                    <th align="center" style="padding-bottom: 8px; color: #8C827A; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; color: #8C827A; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${preOrderItemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top: 12px; font-size: 14px; font-weight: bold; color: #FFFFFF;">
                      Total Food Bill <span style="font-size: 11px; font-weight: normal; color: #8C827A;">(All Taxes Included)</span>
                    </td>
                    <td align="right" style="padding-top: 12px; font-size: 16px; font-weight: bold; color: #C49A6C;">
                      ₹${preOrder.totalBill}
                    </td>
                  </tr>
                  ${
                    payment.transactionId
                      ? `
                  <tr>
                    <td colspan="2" style="padding-top: 6px; font-size: 11px; color: #737373;">
                      Txn ID: ${payment.transactionId} (${payment.method || "ONLINE"})
                    </td>
                    <td align="right" style="padding-top: 6px; font-size: 11px; color: #10B981; font-weight: bold;">
                      ✓ PAID
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </tfoot>
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Directions & Location Card -->
          <tr>
            <td style="padding: 0 24px 28px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1A1816; border: 1px dashed #40362E; border-radius: 4px; padding: 16px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: bold; color: #C49A6C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      📍 How To Reach Duplex Lounge Cafe
                    </div>
                    <div style="font-size: 13px; color: #E5E5E5; line-height: 1.4; margin-bottom: 12px;">
                      ${CAFE_INFO.address.shop}, ${CAFE_INFO.address.landmark}, ${CAFE_INFO.address.area}, ${CAFE_INFO.address.city}, Maharashtra ${CAFE_INFO.address.pincode}
                    </div>
                    <a href="${CAFE_INFO.contact.mapsUrl}" target="_blank" style="display: inline-block; background-color: #C49A6C; color: #0A0A0A; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 10px 20px; border-radius: 3px; text-decoration: none;">
                      Open in Google Maps →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0E0E0E; padding: 24px; text-align: center; border-top: 1px solid #262626;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #8C827A;">
                Need assistance or table alterations? Contact us:
              </p>
              <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: bold; color: #C49A6C;">
                <a href="tel:${OWNER_CONFIG.callingPhone}" style="color: #C49A6C; text-decoration: none; margin-right: 12px;">📞 ${OWNER_CONFIG.callingPhoneDisplay}</a>
                <a href="mailto:${OWNER_CONFIG.businessEmail}" style="color: #C49A6C; text-decoration: none;">✉️ ${OWNER_CONFIG.businessEmail}</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #525252;">
                © ${new Date().getFullYear()} ${CAFE_INFO.name}. All rights reserved.<br />
                Tisgao Naka, Kalyan (West), Maharashtra 421306
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 🖨️ OPEN PRINTABLE EMAIL RECEIPT WINDOW
 */
export function printEmailReceipt(booking) {
  if (!booking) return;
  const html = generateBookingEmailHtml(booking);
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  }
}

/**
 * 🚀 DISPATCH BOOKING CONFIRMATION EMAIL (Simulated & Client Dispatch)
 */
export async function sendBookingConfirmationEmail(booking) {
  if (!booking || !booking.customer?.email) {
    return {
      success: false,
      message: "No customer email provided for confirmation dispatch."
    };
  }

  // Simulate cloud function / email server dispatch latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  console.log(
    `[Email Service] Confirmation email dispatched successfully to: ${booking.customer.email} for Booking ${booking.bookingId}`
  );

  return {
    success: true,
    sentTo: booking.customer.email,
    timestamp: new Date().toISOString(),
    message: `Confirmation email sent to ${booking.customer.email}`
  };
}
