import React from "react";
import { X, Printer, Download, ExternalLink, Mail, CheckCircle2 } from "lucide-react";
import { generateBookingEmailHtml, printEmailReceipt } from "../services/emailService";

export default function EmailPreviewModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  const emailHtml = generateBookingEmailHtml(booking);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-white/15 rounded-sm shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Modal Top Control Bar */}
        <div className="p-4 bg-background-darker border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-coffee-500/20 border border-coffee-500/40 flex items-center justify-center text-coffee-300">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-cream-100">
                Email Confirmation Preview
              </h3>
              <p className="text-[11px] text-muted font-sans">
                Sent to: <span className="text-coffee-300">{booking.customer?.email || "Customer"}</span> • Reference: {booking.bookingId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => printEmailReceipt(booking)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-cream-100 hover:bg-white/10 rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HTML Email Render Frame */}
        <div className="flex-1 bg-black p-2 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto rounded-sm overflow-hidden shadow-2xl border border-neutral-800">
            <iframe
              title="Email Confirmation HTML"
              srcDoc={emailHtml}
              className="w-full min-h-[700px] border-none bg-[#141414]"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
