/**
 * 🖨️ SIMPLE BOOKING PASS PRINTER (client-side, no email provider)
 *
 * Opens a new window with a printable booking pass and triggers the print dialog.
 * Used by AdminDashboard / CustomerPortal as a "Print Pass" convenience.
 */

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generateBookingPassHtml(booking) {
  if (!booking) return "";

  const id = booking.bookingId || booking.id || "DLC-RES";
  const name = booking.name || booking.customer?.name || "Guest";
  const phone = booking.phone || booking.customer?.phone || "";
  const email = booking.email || booking.customer?.email || "";
  const date = booking.date || booking.reservation?.date || "";
  const time = booking.timeSlot || booking.reservation?.timeSlot || "";
  const zone =
    booking.zoneName || booking.reservation?.areaName || "Main Dining";
  const guests = booking.partySize || booking.reservation?.guestCount || 2;

  const dateLong = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Booking ${escapeHtml(id)} — Duplex Lounge Cafe</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #0E0D0C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #F5EBE0; padding: 24px; }
  .pass { max-width: 560px; margin: 0 auto; background: #141210; border: 1px solid #3A3228; border-radius: 8px; overflow: hidden; }
  .pass-head { background: linear-gradient(180deg, #1F1916 0%, #141210 100%); padding: 24px; text-align: center; border-bottom: 2px solid #C49A6C; }
  .brand { font-size: 12px; letter-spacing: 4px; color: #C49A6C; margin: 0 0 4px; text-transform: uppercase; }
  .title { font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 2px; }
  .subtitle { font-size: 11px; color: #A3968C; margin: 4px 0 0; letter-spacing: 2px; text-transform: uppercase; }
  .id-card { margin: 20px; padding: 16px; background: #1A1816; border: 1px dashed #C49A6C; border-radius: 6px; text-align: center; }
  .id-label { font-size: 10px; letter-spacing: 2px; color: #8C827A; text-transform: uppercase; margin: 0 0 6px; }
  .id-value { font-size: 24px; font-weight: 700; color: #C49A6C; letter-spacing: 2px; margin: 0; font-family: 'Courier New', monospace; }
  .body { padding: 0 20px 8px; }
  .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #26221E; font-size: 13px; gap: 12px; }
  .row:last-child { border-bottom: none; }
  .label { color: #8C827A; text-transform: uppercase; letter-spacing: 1px; font-size: 10px; }
  .value { font-weight: 600; color: #F5EBE0; text-align: right; }
  .value.gold { color: #C49A6C; }
  .foot { padding: 16px 20px; background: #0A0908; text-align: center; font-size: 10px; color: #737373; border-top: 1px solid #26221E; line-height: 1.6; }
  @media print { body { background: #fff; padding: 0; } .pass { box-shadow: none; border-color: #ddd; } }
</style>
</head>
<body>
  <div class="pass">
    <div class="pass-head">
      <p class="brand">Duplex Lounge Cafe</p>
      <p class="title">Booking Pass</p>
      <p class="subtitle">Kalyan (East) • Table Reservation</p>
    </div>
    <div class="id-card">
      <p class="id-label">Booking Reference</p>
      <p class="id-value">${escapeHtml(id)}</p>
    </div>
    <div class="body">
      <div class="row"><span class="label">Guest</span><span class="value">${escapeHtml(name)}</span></div>
      ${phone ? `<div class="row"><span class="label">Phone</span><span class="value">${escapeHtml(phone)}</span></div>` : ""}
      ${email ? `<div class="row"><span class="label">Email</span><span class="value">${escapeHtml(email)}</span></div>` : ""}
      <div class="row"><span class="label">Date</span><span class="value">${escapeHtml(dateLong || date)}</span></div>
      <div class="row"><span class="label">Time</span><span class="value">${escapeHtml(time)} (IST)</span></div>
      <div class="row"><span class="label">Seating</span><span class="value gold">${escapeHtml(zone)}</span></div>
      <div class="row"><span class="label">Guests</span><span class="value">${escapeHtml(String(guests))}</span></div>
    </div>
    <div class="foot">
      Duplex Lounge Cafe • Shop No. 2, Sai Suman Building,<br/>
      Next to Tisai Gate, Tisgao Naka, Kalyan (W) — 421306
    </div>
  </div>
</body>
</html>`;
}

export function printEmailReceipt(booking) {
  if (!booking) return;
  const html = generateBookingPassHtml(booking);
  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 350);
}