import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  Printer,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  LogOut,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Edit3,
  Lock,
  Phone
} from "lucide-react";
import {
  getUserBookings,
  cancelBooking,
  formatWhatsAppMessage,
  isBookingEditable
} from "../services/bookingService";
import { printEmailReceipt } from "../services/emailService";
import { signOutUser } from "../services/authService";
import { getWhatsAppUrl, OWNER_CONFIG } from "../config/ownerConfig";

export default function CustomerPortalModal({
  isOpen,
  onClose,
  currentUser,
  onOpenBooking,
  onEditBooking,
  onPreviewEmail
}) {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" | "history"
  const [isCancellingId, setIsCancellingId] = useState(null);

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    const unsub = getUserBookings(currentUser.email || currentUser.uid, (data) => {
      setBookings(data);
    });
    return () => {
      if (unsub) unsub();
    };
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const nowString = new Date().toISOString().split("T")[0];
  const upcomingBookings = bookings.filter(
    (b) =>
      (b.reservation?.date >= nowString || b.status === "PENDING" || b.status === "CONFIRMED") &&
      b.status !== "CANCELLED"
  );
  const pastBookings = bookings.filter(
    (b) => b.reservation?.date < nowString || b.status === "CANCELLED" || b.status === "COMPLETED"
  );

  const handleCancelReservation = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this table reservation?")) {
      setIsCancellingId(bookingId);
      await cancelBooking(bookingId, "Cancelled by customer");
      setIsCancellingId(null);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-background-card border border-white/15 rounded-sm shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-background-darker border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full border border-coffee-400 bg-coffee-500/10 flex items-center justify-center text-coffee-300 font-serif font-bold text-base">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl text-cream-100">{currentUser.name || "Customer"}</h3>
                <span className="px-2 py-0.5 rounded-full bg-coffee-500/20 text-coffee-300 text-[10px] font-bold tracking-wider uppercase border border-coffee-500/30">
                  DLC Guest
                </span>
              </div>
              <p className="text-xs text-muted font-light">{currentUser.email || currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-2 text-muted hover:text-red-400 hover:bg-white/5 rounded-sm transition-colors text-xs inline-flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted hover:text-cream-100 hover:bg-white/10 rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-background-darker/60 px-6">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-3.5 px-4 text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "upcoming"
                ? "border-coffee-400 text-coffee-300 bg-white/5"
                : "border-transparent text-muted hover:text-cream-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming ({upcomingBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`py-3.5 px-4 text-xs uppercase tracking-widest font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "history"
                ? "border-coffee-400 text-coffee-300 bg-white/5"
                : "border-transparent text-muted hover:text-cream-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Past / History ({pastBookings.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Policy Information Banner */}
          <div className="p-3 bg-coffee-500/10 border border-coffee-500/20 rounded-sm flex items-start gap-2.5 text-xs text-cream-200 font-light">
            <Clock className="w-4 h-4 text-coffee-400 shrink-0 mt-0.5" />
            <span>
              <strong>6-Hour Modification Policy:</strong> Table date, time, and pre-orders can be edited online up to <strong>6 hours before reservation time</strong>. When less than 6 hours remain, the booking is finalized for kitchen preparation.
            </span>
          </div>

          {activeTab === "upcoming" ? (
            upcomingBookings.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="w-12 h-12 text-coffee-400/40 mx-auto mb-3" />
                <h4 className="font-serif text-xl text-cream-100 mb-2">No Upcoming Reservations</h4>
                <p className="text-xs text-muted max-w-sm mx-auto mb-6">
                  Ready for great food and chill ambient lounge vibes? Reserve your favorite table or mezzanine area now!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenBooking) onOpenBooking();
                  }}
                  className="inline-flex items-center gap-2 bg-coffee-400 hover:bg-coffee-500 text-background-darker text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book A Table Now</span>
                </button>
              </div>
            ) : (
              upcomingBookings.map((b) => {
                const editStatus = isBookingEditable(b, 6);

                return (
                  <div
                    key={b.id || b.bookingId}
                    className="bg-background-darker border border-white/10 hover:border-coffee-400/40 rounded-sm p-5 transition-all shadow-md space-y-4"
                  >
                    {/* Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div>
                        <span className="text-[11px] text-muted uppercase tracking-wider block">
                          Booking Reference
                        </span>
                        <span className="font-serif font-bold text-coffee-300 text-base">
                          {b.bookingId}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 6-Hour Policy Badge */}
                        {editStatus.canEdit ? (
                          <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.floor(editStatus.hoursRemaining)}h to edit</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-700 text-neutral-400 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>Finalized (&lt;6h)</span>
                          </span>
                        )}

                        <span
                          className={`px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase border ${
                            b.payment?.status === "PAID"
                              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                              : "bg-amber-950/40 border-amber-500/40 text-amber-400"
                          }`}
                        >
                          {b.payment?.status === "PAID" ? "✓ Paid Online" : "● Pay at Counter"}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase border ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                              : b.status === "SEATED"
                              ? "bg-blue-950/40 border-blue-500/40 text-blue-400"
                              : "bg-coffee-500/20 border-coffee-500/40 text-coffee-300"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-muted-dark block text-[10px] uppercase">Date</span>
                        <span className="text-cream-100 font-semibold">{b.reservation?.date}</span>
                      </div>
                      <div>
                        <span className="text-muted-dark block text-[10px] uppercase">Time</span>
                        <span className="text-cream-100 font-semibold">{b.reservation?.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-muted-dark block text-[10px] uppercase">Area</span>
                        <span className="text-coffee-400 font-semibold truncate block">
                          {b.reservation?.areaName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-dark block text-[10px] uppercase">Guests</span>
                        <span className="text-cream-100 font-semibold">
                          {b.reservation?.guestCount} Persons
                        </span>
                      </div>
                    </div>

                    {/* Special request pill if any */}
                    {b.reservation?.specialRequests && (
                      <div className="p-2.5 bg-purple-950/30 border border-purple-500/30 rounded-xs text-[11px] text-purple-200">
                        <strong>Special Request:</strong> "{b.reservation.specialRequests}"
                      </div>
                    )}

                    {/* Pre-Order summary (if any) */}
                    {b.preOrder?.hasPreOrder && (
                      <div className="p-3 bg-white/5 rounded-sm border border-white/5 text-xs">
                        <div className="flex items-center justify-between mb-1 text-muted">
                          <span>Pre-Ordered Food Items:</span>
                          <span className="text-cream-100 font-bold">₹{b.preOrder.totalBill}</span>
                        </div>
                        <p className="text-muted-light font-light truncate">
                          {b.preOrder.items?.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </p>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* ✏️ EDIT BOOKING BUTTON (ALLOWED ONLY IF > 6 HOURS REMAIN) */}
                        {editStatus.canEdit ? (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onEditBooking) onEditBooking(b);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold uppercase tracking-wider text-[11px] transition-colors shadow-sm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Booking</span>
                          </button>
                        ) : (
                          <a
                            href={`tel:${OWNER_CONFIG.callingPhone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-coffee-300 font-medium text-[11px] transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call for Changes</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => onPreviewEmail && onPreviewEmail(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-cream-200 font-medium transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-coffee-400" />
                          <span>Email</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => printEmailReceipt(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-cream-200 font-medium transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-coffee-400" />
                          <span>Print</span>
                        </button>

                        <a
                          href={getWhatsAppUrl(formatWhatsAppMessage(b))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 font-medium transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </div>

                      {/* Cancel button (also subject to active status) */}
                      <button
                        type="button"
                        disabled={isCancellingId === b.id}
                        onClick={() => handleCancelReservation(b.id || b.bookingId)}
                        className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider font-medium py-1 px-2 hover:bg-red-950/30 rounded-sm transition-colors"
                      >
                        {isCancellingId === b.id ? "Cancelling..." : "Cancel"}
                      </button>
                    </div>

                  </div>
                );
              })
            )
          ) : (
            pastBookings.length === 0 ? (
              <div className="py-12 text-center text-muted text-xs">
                No past booking records found.
              </div>
            ) : (
              pastBookings.map((b) => (
                <div
                  key={b.id || b.bookingId}
                  className="bg-background-darker/60 border border-white/5 rounded-sm p-4 text-xs opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-coffee-400 font-bold">{b.bookingId}</span>
                    <span className="text-[10px] uppercase font-bold text-muted border border-white/10 px-2 py-0.5 rounded-sm">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-cream-300 font-light">
                    {b.reservation?.date} at {b.reservation?.timeSlot} • {b.reservation?.areaName} ({b.reservation?.guestCount} guests)
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-muted">Bill: ₹{b.preOrder?.totalBill || 0}</span>
                    <button
                      type="button"
                      onClick={() => onPreviewEmail && onPreviewEmail(b)}
                      className="text-coffee-300 hover:underline flex items-center gap-1"
                    >
                      <span>View Receipt</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>

      </div>
    </div>
  );
}
