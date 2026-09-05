import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  LogOut,
  Lock,
  Sparkles,
  Phone,
  ChevronDown,
  X,
  ShieldCheck,
  Eye,
  Ban,
  Hourglass
} from "lucide-react";
import { adminSignIn, signOut } from "../services/authService";
import {
  getAllBookings,
  cancelBookingByAdmin,
  getCurrentISTTime
} from "../services/bookingService";
import { printEmailReceipt } from "../services/emailService";

const STATUS_LABELS = {
  pending: { label: "Pending", color: "amber", icon: Hourglass },
  confirmed: { label: "Confirmed", color: "emerald", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "red", icon: XCircle },
  rejected: { label: "Rejected", color: "red", icon: Ban }
};

function StatusBadge({ status }) {
  const key = (status || "pending").toLowerCase();
  const cfg = STATUS_LABELS[key] || STATUS_LABELS.pending;
  const Icon = cfg.icon;
  const palette = {
    amber: "bg-amber-950/60 text-amber-300 border-amber-500/40",
    emerald: "bg-emerald-950/60 text-emerald-400 border-emerald-500/40",
    red: "bg-red-950/60 text-red-400 border-red-500/40"
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max ${palette[cfg.color]}`}
    >
      <Icon className="w-3 h-3" />
      <span>{cfg.label}</span>
    </span>
  );
}

export default function AdminDashboard({ onExitAdmin }) {
  const [adminUser, setAdminUser] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  const [dateFilter, setDateFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);

  // Action modals
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("Customer requested cancellation");
  const [isCancelling, setIsCancelling] = useState(false);

  const [actionBusyId, setActionBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const { todayDateString } = getCurrentISTTime();
  const tomorrowObj = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrowObj.toISOString().split("T")[0];

  useEffect(() => {
    if (!adminUser) return;
    setIsLoadingBookings(true);
    const unsub = getAllBookings((data) => {
      setBookings(data);
      setIsLoadingBookings(false);
    });
    return () => {
      if (unsub) unsub();
    };
  }, [adminUser]);

  const showToast = (message, kind = "info") => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3200);
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setAuthError("");
    setIsAuthLoading(true);
    try {
      const user = await adminSignIn(emailInput, passwordInput);
      setAdminUser(user);
      setIsAuthLoading(false);
    } catch (err) {
      setIsAuthLoading(false);
      setAuthError(err.message || "Invalid Admin Credentials.");
    }
  };

  const handleLogout = async () => {
    await signOut();
    setAdminUser(null);
  };

  const handleCancel = async () => {
    if (!cancelModalBooking) return;
    const id = cancelModalBooking.bookingId || cancelModalBooking.id;
    setIsCancelling(true);
    try {
      await cancelBookingByAdmin(id, cancelReason);
      setIsCancelling(false);
      setCancelModalBooking(null);
      showToast(`Booking #${id} cancelled.`, "success");
      if (selectedBooking && (selectedBooking.id === id || selectedBooking.bookingId === id)) {
        setSelectedBooking((prev) => ({ ...prev, status: "cancelled", cancellationReason: cancelReason }));
      }
    } catch (err) {
      setIsCancelling(false);
      showToast(`Cancel failed: ${err.message}`, "error");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const bookingDate = b.date || b.reservation?.date;
      const bookingStatus = (b.status || "pending").toLowerCase();

      let matchDate = true;
      if (dateFilter === "TODAY") matchDate = bookingDate === todayDateString;
      else if (dateFilter === "TOMORROW") matchDate = bookingDate === tomorrowStr;
      else if (dateFilter !== "ALL") matchDate = bookingDate === dateFilter;

      const matchStatus = statusFilter === "ALL" ? true : bookingStatus === statusFilter.toLowerCase();

      const bId = (b.bookingId || b.id || "").toLowerCase();
      const cName = (b.name || b.customer?.name || "").toLowerCase();
      const cPhone = (b.phone || b.customer?.phone || "");
      const cEmail = (b.email || b.customer?.email || "").toLowerCase();
      const notes = (b.specialRequests || b.reservation?.specialRequests || "").toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        bId.includes(q) ||
        cName.includes(q) ||
        cPhone.includes(q) ||
        cEmail.includes(q) ||
        notes.includes(q);

      return matchDate && matchStatus && matchSearch;
    });
  }, [bookings, dateFilter, statusFilter, searchQuery, todayDateString, tomorrowStr]);

  const metrics = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => (b.status || "").toLowerCase() === "pending").length;
    const confirmed = bookings.filter((b) => (b.status || "").toLowerCase() === "confirmed").length;
    const cancelled = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "cancelled" || (b.status || "").toLowerCase() === "rejected"
    ).length;
    const todayCount = bookings.filter((b) => (b.date || b.reservation?.date) === todayDateString).length;
    return { total, pending, confirmed, cancelled, todayCount };
  }, [bookings, todayDateString]);

  // ---------------- LOGIN VIEW ----------------
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-background-darker text-cream-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-coffee-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-coffee-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-background-card border border-white/10 rounded-sm shadow-2xl p-8 space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-coffee-400 bg-coffee-500/10 text-coffee-300 flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-cream-100 uppercase tracking-wider">
              Cafe Administrator
            </h2>
            <p className="text-xs text-muted">
              Duplex Lounge Cafe • Protected Staff Portal
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-sm text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-muted-light uppercase font-semibold tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@yourcafe.com"
                className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 px-3.5 py-3 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-muted-light uppercase font-semibold tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 px-3.5 py-3 rounded-sm outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 bg-coffee-400 hover:bg-coffee-500 disabled:opacity-50 text-background-darker font-bold uppercase tracking-wider text-xs rounded-sm transition-all shadow-md"
            >
              {isAuthLoading ? "Authenticating..." : "Sign In to Admin Dashboard"}
            </button>
          </form>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                if (onExitAdmin) onExitAdmin();
              }}
              className="text-muted hover:text-cream-100 transition-colors uppercase tracking-wider text-[11px]"
            >
              ← Back to Main Website
            </button>
            <span className="text-[11px] text-coffee-300 font-mono">v2.0 • Firebase</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DASHBOARD VIEW ----------------
  return (
    <div className="min-h-screen bg-background-darker text-cream-100 font-sans flex flex-col">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[60] px-4 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider shadow-xl animate-fade-in ${
            toast.kind === "success"
              ? "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
              : toast.kind === "error"
              ? "bg-red-950 border border-red-500/40 text-red-300"
              : "bg-background-card border border-white/15 text-cream-100"
          }`}
        >
          {toast.message}
        </div>
      )}

      <header className="bg-background-card border-b border-white/10 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-coffee-400 bg-coffee-500/10 text-coffee-300 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl text-cream-100 uppercase tracking-wide flex items-center gap-2">
              <span>Duplex Lounge Cafe</span>
              <span className="px-2 py-0.5 rounded-full bg-coffee-500/20 text-coffee-300 text-[10px] font-bold tracking-widest uppercase border border-coffee-500/30">
                Staff Admin
              </span>
            </h1>
            <p className="text-xs text-muted font-light">
              Table Bookings • Pending Approvals • Confirm / Reject / Cancel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:inline-block text-muted text-[11px]">
            Logged in as: <strong className="text-cream-100">{adminUser.email}</strong>
          </span>

          <button
            onClick={() => {
              if (onExitAdmin) onExitAdmin();
            }}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-muted hover:text-cream-100 rounded-sm uppercase tracking-wider text-[11px] font-medium transition-colors border border-white/10"
          >
            Visit Website
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-sm uppercase tracking-wider text-[11px] font-bold transition-colors border border-red-500/30 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-background-card border border-white/10 rounded-sm space-y-1">
            <span className="text-[11px] text-muted uppercase tracking-wider font-semibold block">Total</span>
            <span className="font-serif text-2xl font-bold text-cream-100">{metrics.total}</span>
          </div>
          <div className="p-4 bg-background-card border border-amber-500/30 rounded-sm space-y-1">
            <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold block">Pending</span>
            <span className="font-serif text-2xl font-bold text-amber-400">{metrics.pending}</span>
          </div>
          <div className="p-4 bg-background-card border border-emerald-500/30 rounded-sm space-y-1">
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold block">Confirmed</span>
            <span className="font-serif text-2xl font-bold text-emerald-400">{metrics.confirmed}</span>
          </div>
          <div className="p-4 bg-background-card border border-red-500/30 rounded-sm space-y-1">
            <span className="text-[11px] text-red-400 uppercase tracking-wider font-semibold block">Cancelled/Rejected</span>
            <span className="font-serif text-2xl font-bold text-red-400">{metrics.cancelled}</span>
          </div>
          <div className="p-4 bg-background-card border border-white/10 rounded-sm space-y-1">
            <span className="text-[11px] text-coffee-300 uppercase tracking-wider font-semibold block">Today</span>
            <span className="font-serif text-2xl font-bold text-coffee-300">{metrics.todayCount}</span>
          </div>
        </div>

        <div className="p-4 bg-background-card border border-white/10 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "All Dates" },
              { id: "TODAY", label: "Today" },
              { id: "TOMORROW", label: "Tomorrow" }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDateFilter(d.id)}
                className={`px-3 py-1.5 rounded-sm uppercase tracking-wider font-semibold transition-all ${
                  dateFilter === d.id
                    ? "bg-coffee-400 text-background-darker shadow-sm"
                    : "bg-background-darker text-muted hover:text-cream-100"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-1 sm:flex-initial justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 px-3 py-2 rounded-sm outline-none text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guest, phone, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 pl-8 pr-3 py-2 rounded-sm outline-none text-xs"
              />
            </div>
          </div>
        </div>

        <div className="bg-background-card border border-white/10 rounded-sm shadow-xl overflow-hidden">
          <div className="p-4 bg-background-darker border-b border-white/10 flex items-center justify-between">
            <h2 className="font-serif text-base text-cream-100 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-coffee-400" />
              <span>Reservations ({filteredBookings.length})</span>
            </h2>
            <span className="text-[11px] text-muted">New bookings arrive as PENDING</span>
          </div>

          {isLoadingBookings ? (
            <div className="p-12 text-center text-muted text-xs">Loading bookings…</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-muted text-xs space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-white/20" />
              <p>No reservations found matching the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-background-darker/60 text-[11px] text-muted uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Seating Zone</th>
                    <th className="p-3.5">Guests</th>
                    <th className="p-3.5">Customer Contact</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((b) => {
                    const bookingId = b.bookingId || b.id;
                    const dateStr = b.date || b.reservation?.date;
                    const timeSlot = b.timeSlot || b.reservation?.timeSlot;
                    const zoneName = b.zoneName || b.reservation?.areaName || "Seating Zone";
                    const partySize = b.partySize || b.reservation?.guestCount || 2;
                    const custName = b.name || b.customer?.name || "Guest";
                    const custPhone = b.phone || b.customer?.phone || "N/A";
                    const status = (b.status || "pending").toLowerCase();
                    const isCancelled = status === "cancelled" || status === "rejected";

                    return (
                      <tr key={bookingId} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 font-mono font-bold text-coffee-300">#{bookingId}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-semibold text-cream-100 block">{dateStr}</span>
                          <span className="text-[11px] text-coffee-300 font-medium">{timeSlot}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-cream-100 font-medium">{zoneName}</span>
                        </td>
                        <td className="p-3.5 font-bold text-cream-100">{partySize}</td>
                        <td className="p-3.5 space-y-0.5">
                          <span className="font-semibold text-cream-100 block">{custName}</span>
                          <span className="text-[11px] text-muted block">{custPhone}</span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <StatusBadge status={status} />
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(b)}
                              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/15 text-cream-100 rounded-sm text-[11px] uppercase tracking-wider font-semibold transition-colors"
                            >
                              Details
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCancelModalBooking(b);
                                setCancelReason(
                                  isCancelled
                                    ? "Re-cancelled by Cafe Admin"
                                    : "Customer requested cancellation"
                                );
                              }}
                              disabled={actionBusyId === bookingId}
                              className={`px-2.5 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-bold transition-colors ${
                                isCancelled
                                  ? "bg-neutral-800 hover:bg-neutral-700 text-muted border border-white/10"
                                  : "bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/30"
                              }`}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* DETAILS DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-lg bg-background-card border border-white/15 rounded-sm shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-coffee-300 font-bold uppercase tracking-widest">Reservation Inspection</span>
                <h3 className="font-serif text-xl text-cream-100">Booking #{selectedBooking.bookingId || selectedBooking.id}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-muted hover:text-cream-100 rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <StatusBadge status={selectedBooking.status || "pending"} />
              <span className="text-[11px] text-muted">
                Created {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString("en-IN") : "—"}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-background-darker rounded-sm border border-white/5">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Date & Time (IST)</span>
                  <span className="text-cream-100 font-semibold">
                    {selectedBooking.date || selectedBooking.reservation?.date} at{" "}
                    {selectedBooking.timeSlot || selectedBooking.reservation?.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Seating Zone</span>
                  <span className="text-coffee-300 font-semibold">
                    {selectedBooking.zoneName || selectedBooking.reservation?.areaName} ({selectedBooking.partySize || selectedBooking.reservation?.guestCount} Guests)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-background-darker rounded-sm border border-white/5 space-y-1.5">
                <span className="text-muted block text-[10px] uppercase font-bold">Customer Contact</span>
                <div className="flex justify-between">
                  <span className="text-muted">Name:</span>
                  <span className="text-cream-100 font-medium">{selectedBooking.name || selectedBooking.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Phone:</span>
                  <span className="text-cream-100 font-mono">{selectedBooking.phone || selectedBooking.customer?.phone}</span>
                </div>
              </div>

              {(selectedBooking.specialRequests || selectedBooking.reservation?.specialRequests) && (
                <div className="p-3 bg-background-darker rounded-sm border border-white/5 space-y-1">
                  <span className="text-muted block text-[10px] uppercase font-bold">Special Requests</span>
                  <p className="text-cream-200 italic">
                    "{selectedBooking.specialRequests || selectedBooking.reservation?.specialRequests}"
                  </p>
                </div>
              )}

              {selectedBooking.cancellationReason && (
                <div className="p-3 bg-red-950/30 rounded-sm border border-red-500/30 space-y-1">
                  <span className="text-red-400 block text-[10px] uppercase font-bold">Cancellation Reason</span>
                  <p className="text-red-200">{selectedBooking.cancellationReason}</p>
                </div>
              )}

              {selectedBooking.rejectionReason && (
                <div className="p-3 bg-red-950/30 rounded-sm border border-red-500/30 space-y-1">
                  <span className="text-red-400 block text-[10px] uppercase font-bold">Rejection Reason</span>
                  <p className="text-red-200">{selectedBooking.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => printEmailReceipt(selectedBooking)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-cream-100 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-coffee-400" />
                <span>Print Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCancelModalBooking(selectedBooking);
                  const st = (selectedBooking.status || "").toLowerCase();
                  setCancelReason(
                    st === "cancelled" || st === "rejected"
                      ? "Re-cancelled by Cafe Admin"
                      : "Customer requested cancellation"
                  );
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Booking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-coffee-400 hover:bg-coffee-500 text-background-darker text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-md bg-background-card border border-red-500/40 rounded-sm shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <Ban className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg uppercase tracking-wide text-cream-100">
                Cancel Reservation #{cancelModalBooking.bookingId || cancelModalBooking.id}?
              </h3>
            </div>

            <p className="text-xs text-muted-light leading-relaxed">
              Cancelling this reservation will free up the table unit for other guests.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="block text-muted uppercase font-semibold text-[10px] tracking-wider">
                Reason for Cancellation
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, customer requested..."
                className="w-full bg-background-darker border border-white/15 focus:border-red-400 text-cream-100 px-3.5 py-2.5 rounded-sm outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                disabled={isCancelling}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-cream-100 uppercase tracking-wider"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-lg"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}