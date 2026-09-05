import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Navigation,
  Printer,
  Copy,
  MessageCircle,
  Hash,
  ChevronRight,
  CalendarPlus
} from "lucide-react";
import { CAFE_INFO } from "../data/cafeInfo";
import { OWNER_CONFIG, getWhatsAppUrl } from "../config/ownerConfig";

function formatDateLong(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}

function parseTimeSlotTo24(timeSlot) {
  if (!timeSlot) return { hour: 19, minute: 0 };
  const m = String(timeSlot).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return { hour: 19, minute: 0 };
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const isPm = m[3].toUpperCase() === "PM";
  if (isPm && h < 12) h += 12;
  if (!isPm && h === 12) h = 0;
  return { hour: h, minute: min };
}

function buildIcs(booking) {
  const dateStr = booking.date || booking.reservation?.date;
  const timeSlot = booking.timeSlot || booking.reservation?.timeSlot;
  if (!dateStr || !timeSlot) return null;
  const { hour, minute } = parseTimeSlotTo24(timeSlot);
  const start = new Date(dateStr);
  start.setHours(hour, minute, 0, 0);
  const end = new Date(start.getTime() + 90 * 60 * 1000); // 1.5 hour default
  const pad = (n) => String(n).padStart(2, "0");
  const dt = (d) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
      d.getUTCHours()
    )}${pad(d.getUTCMinutes())}00Z`;
  const uid = `${booking.bookingId || booking.id}@duplexloungecafe`;
  const summary = `Duplex Lounge Cafe — Reservation ${booking.bookingId || booking.id}`;
  const description =
    `Booking ID: ${booking.bookingId || booking.id}\n` +
    `Status: ${(booking.status || "CONFIRMED").toUpperCase()}\n` +
    `Guests: ${booking.partySize || booking.reservation?.guestCount || 2}\n` +
    (booking.specialRequests || booking.reservation?.specialRequests
      ? `Note: ${booking.specialRequests || booking.reservation?.specialRequests}\n`
      : "") +
    `\nShow your booking pass at the entrance.`;
  const location = CAFE_INFO.address.full;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Duplex Lounge Cafe//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(end)}`,
    `SUMMARY:${summary.replace(/\n/g, " ")}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location.replace(/\n/g, " ")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function downloadIcs(booking) {
  const ics = buildIcs(booking);
  if (!ics) return;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `duplex-booking-${booking.bookingId || booking.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function BookingConfirmation({ booking, onClose, onDone }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!booking) return;
    // Reduced motion: skip animations entirely (handled by CSS @media block).
  }, [booking]);

  if (!booking) return null;

  const bookingId = booking.bookingId || booking.id || "DLC-RES";
  const dateStr = booking.date || booking.reservation?.date || "";
  const timeSlot = booking.timeSlot || booking.reservation?.timeSlot || "";
  const zoneName = booking.zoneName || booking.reservation?.areaName || "Main Dining";
  const partySize = booking.partySize || booking.reservation?.guestCount || 2;
  const name = booking.name || booking.customer?.name || "Guest";
  const phone = booking.phone || booking.customer?.phone || "";
  const specialRequests =
    booking.specialRequests || booking.reservation?.specialRequests || "";

  const mapsUrl =
    CAFE_INFO.contact?.mapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=Duplex+Lounge+Cafe+Kalyan";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = bookingId;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handlePrint = () => {
    const pass = document.getElementById("duplex-booking-pass");
    if (!pass) return;
    const win = window.open("", "_blank", "width=820,height=900");
    if (!win) return;
    const styles = `
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #0E0D0C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #F5EBE0; padding: 24px; }
        .pass { max-width: 560px; margin: 0 auto; background: #141210; border: 1px solid #3A3228; border-radius: 8px; overflow: hidden; }
        .pass-head { background: linear-gradient(180deg, #1F1916 0%, #141210 100%); padding: 24px; text-align: center; border-bottom: 2px solid #C49A6C; }
        .brand { font-size: 12px; letter-spacing: 4px; color: #C49A6C; margin: 0 0 4px; text-transform: uppercase; }
        .title { font-size: 22px; font-weight: 700; margin: 0; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #26221E; font-size: 13px; gap: 12px; }
        .row:last-child { border-bottom: none; }
        .label { color: #8C827A; text-transform: uppercase; letter-spacing: 1px; font-size: 10px; }
        .value { font-weight: 600; color: #F5EBE0; text-align: right; }
        .value.gold { color: #C49A6C; }
        .id-card { margin: 20px; padding: 16px; background: #1A1816; border: 1px dashed #C49A6C; border-radius: 6px; text-align: center; }
        .id-label { font-size: 10px; letter-spacing: 2px; color: #8C827A; text-transform: uppercase; margin: 0 0 6px; }
        .id-value { font-size: 24px; font-weight: 700; color: #C49A6C; letter-spacing: 2px; margin: 0; font-family: 'Courier New', monospace; }
        .body { padding: 0 20px 20px; }
        .foot { padding: 16px 20px; background: #0A0908; text-align: center; font-size: 10px; color: #737373; border-top: 1px solid #26221E; }
        @media print { body { background: #fff; padding: 0; } .pass { box-shadow: none; } }
      </style>
    `;
    win.document.write(
      `<!doctype html><html><head><title>Booking ${bookingId} — Duplex Lounge Cafe</title>${styles}</head><body>${pass.outerHTML}</body></html>`
    );
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
    }, 350);
  };

  return (
    <div className="relative text-center py-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 60%)"
        }}
      />

      {/* Animated Check + Ring */}
      <div className="mx-auto w-20 h-20 relative mb-5">
        <svg className="absolute inset-0" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(16,185,129,0.25)"
            strokeWidth="3"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeDasharray="226"
            strokeDashoffset="226"
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ animation: "drawCircle 700ms ease-out 100ms forwards" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <CheckCircle2
            className="w-10 h-10 text-emerald-400"
            style={{
              animation:
                "popCheck 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 600ms backwards"
            }}
          />
        </div>
      </div>

      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold tracking-widest uppercase"
        style={{ animation: "fadeUp 500ms ease-out 900ms backwards" }}
      >
        <CheckCircle2 className="w-3 h-3" />
        <span>Table Confirmed</span>
      </div>

      <h3
        className="font-serif text-3xl sm:text-4xl text-cream-100 mt-3 leading-tight"
        style={{ animation: "fadeUp 500ms ease-out 1000ms backwards" }}
      >
        See you soon, {name.split(" ")[0]}!
      </h3>
      <p
        className="text-sm text-muted mt-1.5 max-w-md mx-auto"
        style={{ animation: "fadeUp 500ms ease-out 1100ms backwards" }}
      >
        Your table is booked and confirmed. Show this booking pass at the
        entrance.
      </p>

      {/* Printable Pass */}
      <div
        id="duplex-booking-pass"
        className="max-w-md mx-auto mt-5 rounded-sm overflow-hidden border border-emerald-500/40 shadow-xl shadow-black/40"
        style={{ animation: "fadeUp 600ms ease-out 1200ms backwards" }}
      >
        <div className="bg-gradient-to-b from-[#1F1916] to-[#141210] p-5 text-center border-b-2 border-emerald-500">
          <div className="text-[10px] tracking-[0.3em] text-emerald-300 uppercase">
            Duplex Lounge Cafe
          </div>
          <div className="font-serif text-lg text-cream-100 mt-0.5">
            Kalyan (East)
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </div>
        </div>

        <div className="bg-background-darker p-4 text-center border-b border-dashed border-amber-500/60">
          <div className="text-[10px] tracking-[0.25em] text-muted uppercase mb-1.5 flex items-center justify-center gap-1.5">
            <Hash className="w-3 h-3" />
            <span>Booking Reference</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="font-mono text-2xl font-bold text-amber-300 tracking-widest">
              {bookingId}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-cream-200 transition-colors"
              aria-label="Copy booking ID"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-background-card p-5 space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 text-left">
              <div className="text-[10px] uppercase tracking-wider text-muted">Date</div>
              <div className="text-cream-100 font-semibold">{formatDateLong(dateStr)}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 text-left">
              <div className="text-[10px] uppercase tracking-wider text-muted">Time</div>
              <div className="text-cream-100 font-semibold">{timeSlot} (IST)</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 text-left">
              <div className="text-[10px] uppercase tracking-wider text-muted">Guests</div>
              <div className="text-cream-100 font-semibold">
                {partySize} {partySize === 1 ? "Person" : "Persons"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-white/10">
            <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 text-left">
              <div className="text-[10px] uppercase tracking-wider text-muted">
                Seating Area
              </div>
              <div className="text-amber-300 font-semibold">{zoneName}</div>
            </div>
          </div>

          {specialRequests && (
            <div className="pt-2 border-t border-white/10 text-left">
              <div className="text-[10px] uppercase tracking-wider text-muted">
                Special Requests
              </div>
              <div className="text-cream-200 italic mt-0.5">"{specialRequests}"</div>
            </div>
          )}

          <div className="pt-2 border-t border-white/10 text-left">
            <div className="text-[10px] uppercase tracking-wider text-muted">Guest</div>
            <div className="text-cream-100 font-semibold">{name}</div>
            {phone && (
              <div className="text-muted text-[11px] mt-0.5">{phone}</div>
            )}
          </div>
        </div>

        <div className="bg-[#0A0908] p-3 text-center text-[10px] text-muted border-t border-white/5">
          <div className="font-semibold text-cream-200">{CAFE_INFO.address.full}</div>
          {OWNER_CONFIG.callingPhoneDisplay && (
            <div className="mt-1">
              <Phone className="w-3 h-3 inline -mt-0.5 mr-1" />
              {OWNER_CONFIG.callingPhoneDisplay}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex flex-wrap items-center justify-center gap-2.5 pt-6"
        style={{ animation: "fadeUp 600ms ease-out 1400ms backwards" }}
      >
        <button
          type="button"
          onClick={() => downloadIcs(booking)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-amber-400 hover:bg-amber-500 text-background-darker text-xs uppercase tracking-wider font-bold transition-all shadow-lg shadow-amber-500/30 hover:scale-[1.02]"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Add to Calendar</span>
        </button>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-white/10 hover:bg-white/15 text-cream-100 text-xs uppercase tracking-wider font-bold transition-colors"
        >
          <Navigation className="w-4 h-4 text-amber-400" />
          <span>Get Directions</span>
        </a>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-white/10 hover:bg-white/15 text-cream-100 text-xs uppercase tracking-wider font-bold transition-colors"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Save / Print</span>
        </button>

          {OWNER_CONFIG.whatsappPhone && (
            <a
              href={getWhatsAppUrl(
                encodeURIComponent(
                  `Hi Duplex Lounge Cafe, I just booked a table.\n` +
                    `Booking ID: ${bookingId}\n` +
                    `Date: ${dateStr} at ${timeSlot}\n` +
                    `Guests: ${partySize}\n` +
                    `Status: Confirmed`
                )
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-white/10 hover:bg-white/15 text-cream-100 text-xs uppercase tracking-wider font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          )}
      </div>

      <button
        type="button"
        onClick={() => (onDone ? onDone() : onClose && onClose())}
        className="mt-4 inline-flex items-center gap-1 text-[11px] text-muted hover:text-cream-100 transition-colors"
      >
        <span>Close</span>
        <ChevronRight className="w-3 h-3" />
      </button>

      <style>{`
        @keyframes drawCircle { to { stroke-dashoffset: 0; } }
        @keyframes popCheck { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}