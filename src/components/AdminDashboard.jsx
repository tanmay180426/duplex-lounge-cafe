import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageCircle,
  Printer,
  RefreshCw,
  LogOut,
  Lock,
  Sparkles,
  Phone,
  Layers,
  FileText,
  ChevronDown,
  X,
  CreditCard,
  Image as ImageIcon,
  Upload,
  Trash2,
  DollarSign,
  TrendingUp,
  Store,
  ShieldCheck,
  Eye,
  Gift,
  Tv,
  Heart,
  HelpCircle,
  Check,
  Edit3,
  SlidersHorizontal,
  PhoneCall
} from "lucide-react";
import { adminSignIn, signOutUser, getCurrentUser } from "../services/authService";
import {
  subscribeToBookings,
  updateBookingStatus,
  formatWhatsAppMessage
} from "../services/bookingService";
import {
  uploadGalleryImage,
  deleteGalleryImage,
  subscribeToGalleryImages
} from "../services/imageService";
import { subscribeToPayments } from "../services/paymentService";
import { printEmailReceipt } from "../services/emailService";
import { SEATING_AREAS, CAFE_PHYSICAL_TABLES } from "../data/tableData";
import { getWhatsAppUrl, OWNER_CONFIG } from "../config/ownerConfig";

export default function AdminDashboard({ onExitAdmin, onPreviewEmail }) {
  // Auth state
  const [adminUser, setAdminUser] = useState(() => {
    const user = getCurrentUser();
    return user?.role === "admin" ? user : null;
  });
  const [emailInput, setEmailInput] = useState("admin@duplexcafe.com");
  const [passwordInput, setPasswordInput] = useState("duplex123");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Authority Admin Tabs: "bookings" | "schedule" | "tables" | "requests" | "payments" | "media"
  const [activeTab, setActiveTab] = useState("bookings");

  // Data states
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [tableStates, setTableStates] = useState(CAFE_PHYSICAL_TABLES);

  // Filter states
  const [dateFilter, setDateFilter] = useState("TODAY"); // "TODAY" | "TOMORROW" | "ALL" | custom YYYY-MM-DD
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Inspection Drawer
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editNotes, setEditNotes] = useState("");

  // Media upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("ambience");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // Subscriptions
  useEffect(() => {
    if (!adminUser) return;

    const unsubBookings = subscribeToBookings((data) => setBookings(data));
    const unsubPayments = subscribeToPayments((data) => setPayments(data));
    const unsubImages = subscribeToGalleryImages((data) => setGalleryImages(data));

    return () => {
      if (unsubBookings) unsubBookings();
      if (unsubPayments) unsubPayments();
      if (unsubImages) unsubImages();
    };
  }, [adminUser]);

  // Handle Admin Login
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
    await signOutUser();
    setAdminUser(null);
  };

  // Authority Action: Change Status & Notes
  const handleAdminStatusAction = async (bookingId, newStatus, customNote = null) => {
    await updateBookingStatus(bookingId, newStatus, customNote);
    if (selectedBooking && (selectedBooking.id === bookingId || selectedBooking.bookingId === bookingId)) {
      setSelectedBooking((prev) => ({
        ...prev,
        status: newStatus,
        adminNotes: customNote !== null ? customNote : prev.adminNotes
      }));
    }
  };

  // Authority Action: Reassign Seating Area
  const handleReassignArea = async (bookingId, newAreaId) => {
    const areaObj = SEATING_AREAS.find((a) => a.id === newAreaId);
    if (!areaObj) return;
    await updateBookingStatus(bookingId, selectedBooking.status, `Reassigned table area to ${areaObj.name}`);
    alert(`Reservation reassigned to ${areaObj.name}`);
  };

  // Authority Action: Toggle Physical Table Status
  const handleToggleTableStatus = (tableId, nextStatus) => {
    setTableStates((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: nextStatus } : t))
    );
  };

  // Image Upload handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async (e) => {
    e?.preventDefault();
    if (!uploadFile) return;
    setIsUploading(true);
    setUploadMsg("");
    setUploadProgress(10);

    try {
      await uploadGalleryImage({
        file: uploadFile,
        title: uploadTitle || "Duplex Cafe",
        category: uploadCategory,
        caption: uploadCaption,
        onProgress: (p) => setUploadProgress(p)
      });
      setIsUploading(false);
      setUploadMsg("✓ Image uploaded successfully to website gallery!");
      setUploadFile(null);
      setUploadPreview(null);
      setUploadTitle("");
      setUploadCaption("");
      setUploadProgress(0);
    } catch (err) {
      setIsUploading(false);
      setUploadMsg(`Error: ${err.message}`);
    }
  };

  const handleDeleteImage = async (imgId, storagePath) => {
    if (window.confirm("Delete this image from gallery?")) {
      await deleteGalleryImage(imgId, storagePath);
    }
  };

  // Filtered Bookings for the manager
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Date filter
      let matchDate = true;
      if (dateFilter === "TODAY") {
        matchDate = b.reservation?.date === todayStr;
      } else if (dateFilter === "TOMORROW") {
        matchDate = b.reservation?.date === tomorrowStr;
      } else if (dateFilter !== "ALL") {
        matchDate = b.reservation?.date === dateFilter;
      }

      // Status filter
      const matchStatus = statusFilter === "ALL" || b.status === statusFilter;

      // Payment filter
      const matchPayment =
        paymentFilter === "ALL" ||
        (paymentFilter === "PAID" && b.payment?.status === "PAID") ||
        (paymentFilter === "COUNTER" && b.payment?.status !== "PAID");

      // Search filter
      const matchSearch =
        !searchQuery ||
        b.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customer?.phone?.includes(searchQuery) ||
        b.reservation?.specialRequests?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDate && matchStatus && matchPayment && matchSearch;
    });
  }, [bookings, dateFilter, statusFilter, paymentFilter, searchQuery, todayStr, tomorrowStr]);

  // Special Requests List
  const specialRequestsList = useMemo(() => {
    return bookings.filter(
      (b) =>
        (b.reservation?.specialRequests && b.reservation.specialRequests.trim().length > 0) ||
        (b.reservation?.occasion && b.reservation.occasion !== "Casual Hangout")
    );
  }, [bookings]);

  // Key KPI metrics
  const metrics = useMemo(() => {
    const todayBookings = bookings.filter((b) => b.reservation?.date === todayStr);
    const activeConfirmed = bookings.filter((b) => ["CONFIRMED", "SEATED"].includes(b.status));
    const pendingAction = bookings.filter((b) => b.status === "PENDING");
    
    const paidOnlineTotal = bookings.reduce((sum, b) => {
      return b.payment?.status === "PAID" ? sum + (b.payment?.amount || b.preOrder?.totalBill || 0) : sum;
    }, 0);

    const pendingCounterTotal = bookings.reduce((sum, b) => {
      return b.payment?.status !== "PAID" && b.status !== "CANCELLED"
        ? sum + (b.preOrder?.totalBill || 0)
        : sum;
    }, 0);

    return {
      todayCount: todayBookings.length,
      activeCount: activeConfirmed.length,
      pendingCount: pendingAction.length,
      paidOnlineTotal,
      pendingCounterTotal,
      specialReqCount: specialRequestsList.length
    };
  }, [bookings, todayStr, specialRequestsList]);

  // IF NOT AUTHENTICATED AS ADMIN: SHOW ADMIN LOGIN SCREEN
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-background-darker flex flex-col items-center justify-center p-4 selection:bg-coffee-500 selection:text-background-darker font-sans">
        <div className="w-full max-w-md bg-background-card border border-white/15 rounded-sm p-8 shadow-2xl shadow-black relative">
          
          <button
            onClick={onExitAdmin}
            className="absolute top-4 right-4 p-2 text-muted hover:text-cream-100 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full border border-coffee-400 bg-coffee-500/10 flex items-center justify-center mx-auto mb-3 text-coffee-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-cream-100 uppercase tracking-widest">
              DLC Admin Authority
            </h2>
            <p className="text-xs text-muted mt-1 font-light">
              Management & Operations Portal
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 rounded-sm bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-3 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-3 rounded-sm outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md mt-2"
            >
              {isAuthLoading ? "Verifying Authority..." : "Login To Admin Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-muted">
            <span className="block text-[11px] text-coffee-300 font-semibold mb-1">
              Default Staff Credentials:
            </span>
            <p className="font-mono text-[11px] text-cream-300">
              admin@duplexcafe.com • duplex123
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-cream-200 font-sans flex flex-col selection:bg-coffee-500 selection:text-background-darker">
      
      {/* Top Authority Header */}
      <header className="bg-[#141211] border-b border-white/10 py-3 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-coffee-400 bg-coffee-500/10 flex items-center justify-center text-coffee-300 font-serif font-bold text-xs">
            DLC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg text-cream-100 uppercase tracking-widest">
                Duplex Lounge <span className="text-coffee-400">Admin Authority</span>
              </h1>
              <span className="px-2 py-0.5 rounded-xs bg-red-950/80 border border-red-500/40 text-red-400 text-[9px] font-bold uppercase tracking-wider">
                Staff Control
              </span>
            </div>
            <span className="text-[10px] text-muted font-sans">
              Logged in: {adminUser.email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-cream-200 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Exit To Website
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-sm bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-semibold uppercase tracking-wider hover:bg-red-900/50 transition-colors inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* KPI Overview Bar */}
      <div className="bg-[#191614] border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          
          <div className="p-3 bg-white/5 border border-white/5 rounded-sm">
            <span className="text-[10px] uppercase text-muted block">Today's Bookings</span>
            <span className="font-serif text-xl font-bold text-cream-100">{metrics.todayCount}</span>
          </div>

          <div className="p-3 bg-white/5 border border-white/5 rounded-sm">
            <span className="text-[10px] uppercase text-muted block">Pending Actions</span>
            <span className="font-serif text-xl font-bold text-amber-400">{metrics.pendingCount}</span>
          </div>

          <div className="p-3 bg-white/5 border border-white/5 rounded-sm">
            <span className="text-[10px] uppercase text-muted block">Active Seated</span>
            <span className="font-serif text-xl font-bold text-blue-400">{metrics.activeCount}</span>
          </div>

          <div className="p-3 bg-white/5 border border-white/5 rounded-sm">
            <span className="text-[10px] uppercase text-muted block">Special Requests</span>
            <span className="font-serif text-xl font-bold text-purple-400">{metrics.specialReqCount}</span>
          </div>

          <div className="p-3 bg-white/5 border border-white/5 rounded-sm">
            <span className="text-[10px] uppercase text-muted block">Online Collections</span>
            <span className="font-serif text-xl font-bold text-emerald-400">₹{metrics.paidOnlineTotal}</span>
          </div>

          <div className="p-3 bg-white/5 border border-white/5 rounded-sm">
            <span className="text-[10px] uppercase text-muted block">Counter Due</span>
            <span className="font-serif text-xl font-bold text-coffee-300">₹{metrics.pendingCounterTotal}</span>
          </div>

        </div>
      </div>

      {/* Admin Authority Navigation Tabs */}
      <div className="bg-[#141211] border-b border-white/10 px-4 sm:px-8 flex items-center gap-1 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "bookings"
              ? "border-coffee-400 text-coffee-300 bg-white/5"
              : "border-transparent text-muted hover:text-cream-200"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Manage Bookings ({filteredBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("tables")}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "tables"
              ? "border-coffee-400 text-coffee-300 bg-white/5"
              : "border-transparent text-muted hover:text-cream-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Floor Plan & Tables</span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "requests"
              ? "border-coffee-400 text-coffee-300 bg-white/5"
              : "border-transparent text-muted hover:text-cream-200"
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Special Requests ({specialRequestsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "payments"
              ? "border-coffee-400 text-coffee-300 bg-white/5"
              : "border-transparent text-muted hover:text-cream-200"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payments Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab("media")}
          className={`py-3.5 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "media"
              ? "border-coffee-400 text-coffee-300 bg-white/5"
              : "border-transparent text-muted hover:text-cream-200"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* ============================================================== */}
        {/* TAB 1: MANAGE BOOKINGS & SCHEDULE TIMELINE                     */}
        {/* ============================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#191614] p-4 border border-white/10 rounded-sm">
              
              {/* Date Quick Filter */}
              <div className="sm:col-span-4 flex items-center gap-1.5">
                <span className="text-[11px] text-muted uppercase font-bold">Date:</span>
                {["TODAY", "TOMORROW", "ALL"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDateFilter(d)}
                    className={`px-2.5 py-1.5 text-[11px] font-bold uppercase rounded-sm transition-colors ${
                      dateFilter === d
                        ? "bg-coffee-400 text-background-darker shadow-sm"
                        : "bg-white/5 text-muted hover:text-cream-100"
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <input
                  type="date"
                  value={["TODAY", "TOMORROW", "ALL"].includes(dateFilter) ? "" : dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-background-darker border border-white/15 text-cream-100 text-xs px-2 py-1 rounded-sm outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="sm:col-span-3 flex items-center gap-1.5">
                <span className="text-[11px] text-muted uppercase font-bold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 bg-background-darker border border-white/15 text-cream-100 text-xs px-2.5 py-1.5 rounded-sm outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending (Requires Action)</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SEATED">Seated & Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, Booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background-darker border border-white/15 text-cream-100 text-xs pl-9 pr-3 py-1.5 rounded-sm outline-none focus:border-coffee-400"
                />
              </div>
            </div>

            {/* Bookings Authority Grid */}
            <div className="space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center bg-[#191614] border border-white/10 rounded-sm text-muted text-xs">
                  No reservations matching your filters for this date.
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const hasSpecialReq =
                    (b.reservation?.specialRequests && b.reservation.specialRequests.trim().length > 0) ||
                    (b.reservation?.occasion && b.reservation.occasion !== "Casual Hangout");

                  return (
                    <div
                      key={b.id || b.bookingId}
                      className="bg-[#191614] hover:bg-[#1f1b19] border border-white/10 hover:border-coffee-400/40 rounded-sm p-4 sm:p-5 transition-all shadow-lg"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        
                        {/* Column 1: Time, Area & Reference */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-serif text-lg font-bold text-coffee-300">
                              {b.reservation?.timeSlot}
                            </span>
                            <span className="text-[10px] text-muted">
                              ({b.reservation?.date})
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-cream-100 block">
                            {b.reservation?.areaName}
                          </span>
                          <span className="text-[11px] text-muted block">
                            👥 {b.reservation?.guestCount} Guests • Ref: <strong className="text-cream-300">{b.bookingId}</strong>
                          </span>
                        </div>

                        {/* Column 2: Customer Details & Contact Actions */}
                        <div className="lg:col-span-3 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4">
                          <span className="font-semibold text-cream-100 block text-xs">
                            {b.customer?.name}
                          </span>
                          <span className="text-muted text-[11px] block font-mono">
                            {b.customer?.phone}
                          </span>
                          {b.customer?.email && (
                            <span className="text-muted-dark text-[10px] block truncate max-w-[180px]">
                              {b.customer?.email}
                            </span>
                          )}

                          {/* Direct Call & Direct WhatsApp to Customer */}
                          <div className="flex items-center gap-2 mt-2">
                            <a
                              href={`tel:${b.customer?.phone}`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-xs bg-white/10 hover:bg-white/20 text-cream-100 text-[10px] font-bold uppercase transition-colors"
                            >
                              <PhoneCall className="w-3 h-3 text-coffee-400" />
                              <span>Call</span>
                            </a>

                            <a
                              href={getWhatsAppUrl(
                                encodeURIComponent(
                                  `Hello ${b.customer?.name}, this is Duplex Lounge Cafe regarding your reservation #${b.bookingId}.`
                                ),
                                b.customer?.phone
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-xs bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>

                        {/* Column 3: Special Request & Pre-order */}
                        <div className="lg:col-span-3 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4">
                          {hasSpecialReq && (
                            <div className="mb-2 p-2 rounded-xs bg-purple-950/40 border border-purple-500/40 text-purple-200 text-[11px]">
                              <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-purple-300">
                                <Sparkles className="w-3 h-3" />
                                <span>Special Request ({b.reservation?.occasion}):</span>
                              </div>
                              <p className="mt-0.5 italic">
                                "{b.reservation?.specialRequests || b.reservation?.occasion}"
                              </p>
                            </div>
                          )}

                          <div className="text-xs">
                            <div className="flex justify-between text-muted">
                              <span>Food Bill:</span>
                              <span className="text-cream-100 font-bold">
                                ₹{b.preOrder?.totalBill || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[10px] text-muted uppercase">Payment:</span>
                              <span
                                className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase border ${
                                  b.payment?.status === "PAID"
                                    ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                                    : "bg-amber-950/60 border-amber-500/40 text-amber-400"
                                }`}
                              >
                                {b.payment?.status === "PAID" ? "✓ Paid Online" : "● Pay at Counter"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Column 4: Admin Authority Actions */}
                        <div className="lg:col-span-3 flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4">
                          <div className="flex items-center gap-1.5">
                            <select
                              value={b.status}
                              onChange={(e) => handleAdminStatusAction(b.id || b.bookingId, e.target.value)}
                              className="flex-1 bg-background-darker border border-white/20 text-cream-100 text-xs font-bold px-2.5 py-1.5 rounded-sm outline-none"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SEATED">SEATED (OCCUPIED)</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED / REJECT</option>
                            </select>

                            <button
                              type="button"
                              title="Print KOT & Receipt"
                              onClick={() => printEmailReceipt(b)}
                              className="p-2 rounded-sm bg-white/10 hover:bg-white/20 text-cream-200"
                            >
                              <Printer className="w-4 h-4 text-coffee-400" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            {b.status === "PENDING" && (
                              <button
                                type="button"
                                onClick={() => handleAdminStatusAction(b.id || b.bookingId, "CONFIRMED")}
                                className="py-1 px-2 rounded-xs bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase transition-colors"
                              >
                                ✓ Confirm
                              </button>
                            )}

                            {b.status === "CONFIRMED" && (
                              <button
                                type="button"
                                onClick={() => handleAdminStatusAction(b.id || b.bookingId, "SEATED")}
                                className="py-1 px-2 rounded-xs bg-blue-700 hover:bg-blue-600 text-white text-[10px] font-bold uppercase transition-colors"
                              >
                                🪑 Seat Guests
                              </button>
                            )}

                            {b.status === "SEATED" && (
                              <button
                                type="button"
                                onClick={() => handleAdminStatusAction(b.id || b.bookingId, "COMPLETED")}
                                className="py-1 px-2 rounded-xs bg-coffee-500 hover:bg-coffee-600 text-background-darker text-[10px] font-bold uppercase transition-colors"
                              >
                                🏁 Finish / Free Table
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedBooking(b)}
                              className="py-1 px-2 rounded-xs bg-white/5 hover:bg-white/15 text-cream-200 text-[10px] font-semibold uppercase transition-colors"
                            >
                              Details / Notes
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: FLOOR PLAN & TABLE MANAGEMENT                           */}
        {/* ============================================================== */}
        {activeTab === "tables" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-cream-100 uppercase tracking-wide">
                  Live Table Occupancy & Seating Floor Plan
                </h3>
                <p className="text-xs text-muted">
                  Monitor table status across Ground Floor & Upper Mezzanine Lounge.
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Available
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Reserved
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Occupied
                </span>
                <span className="flex items-center gap-1 text-neutral-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" /> Blocked
                </span>
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tableStates.map((table) => {
                const isOccupied = table.status === "OCCUPIED";
                const isReserved = table.status === "RESERVED";
                const isAvailable = table.status === "AVAILABLE";

                return (
                  <div
                    key={table.id}
                    className={`p-5 rounded-sm border transition-all ${
                      isOccupied
                        ? "bg-blue-950/30 border-blue-500/50 text-blue-200"
                        : isReserved
                        ? "bg-amber-950/30 border-amber-500/50 text-amber-200"
                        : isAvailable
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                        : "bg-neutral-900 border-neutral-700 text-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-sm bg-black/60 border border-white/10 flex items-center justify-center font-serif font-bold text-sm text-cream-100">
                        {table.number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase border ${
                          isOccupied
                            ? "bg-blue-900/60 border-blue-400 text-blue-300"
                            : isReserved
                            ? "bg-amber-900/60 border-amber-400 text-amber-300"
                            : isAvailable
                            ? "bg-emerald-900/60 border-emerald-400 text-emerald-300"
                            : "bg-neutral-800 border-neutral-600 text-neutral-400"
                        }`}
                      >
                        {table.status}
                      </span>
                    </div>

                    <h4 className="font-semibold text-cream-100 text-sm mb-1">
                      {table.name}
                    </h4>
                    <span className="text-[11px] text-muted block mb-4">
                      {table.floor} • Max Capacity: {table.capacity} Persons
                    </span>

                    {/* Quick Authority State Changer */}
                    <div className="pt-3 border-t border-white/10">
                      <label className="text-[10px] uppercase font-bold text-muted block mb-1">
                        Change Table Status:
                      </label>
                      <select
                        value={table.status}
                        onChange={(e) => handleToggleTableStatus(table.id, e.target.value)}
                        className="w-full bg-background-darker border border-white/20 text-cream-100 text-xs px-2 py-1.5 rounded-sm outline-none font-semibold"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="OCCUPIED">OCCUPIED / SEATED</option>
                        <option value="BLOCKED">BLOCKED / MAINTENANCE</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SPECIAL REQUESTS & EVENT BOARD                          */}
        {/* ============================================================== */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-cream-100 uppercase tracking-wide">
                Special Requests, Birthdays & Netflix Lounge Events
              </h3>
              <p className="text-xs text-muted">
                Highlighted custom customer arrangements requiring staff preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialRequestsList.length === 0 ? (
                <div className="col-span-2 p-12 text-center bg-[#191614] border border-white/10 rounded-sm text-muted text-xs">
                  No special requests currently queued.
                </div>
              ) : (
                specialRequestsList.map((b) => (
                  <div
                    key={b.id || b.bookingId}
                    className="p-5 rounded-sm bg-[#191614] border border-purple-500/40 shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>{b.reservation?.occasion || "Special Request"}</span>
                      </div>
                      <span className="font-serif text-coffee-300 font-bold text-xs">
                        #{b.bookingId}
                      </span>
                    </div>

                    <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-sm text-xs text-purple-200 italic font-sans">
                      "{b.reservation?.specialRequests || "No custom text — Occasion selected"}"
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                      <div>
                        <span className="text-[10px] uppercase block">Customer</span>
                        <strong className="text-cream-100">{b.customer?.name}</strong> ({b.customer?.phone})
                      </div>
                      <div>
                        <span className="text-[10px] uppercase block">Date & Time</span>
                        <strong className="text-cream-100">{b.reservation?.date} at {b.reservation?.timeSlot}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-coffee-300 font-semibold">{b.reservation?.areaName}</span>
                      <a
                        href={`tel:${b.customer?.phone}`}
                        className="inline-flex items-center gap-1 text-coffee-400 hover:underline"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Customer to Confirm Details</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PAYMENTS LEDGER                                         */}
        {/* ============================================================== */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-cream-100 uppercase tracking-wide">
                Payments & Revenue Ledger
              </h3>
              <p className="text-xs text-muted">
                Audit all online UPI QR payments, card transactions, and counter dues.
              </p>
            </div>

            <div className="bg-[#191614] border border-white/10 rounded-sm p-5 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background-darker text-muted uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3">Txn ID</th>
                      <th className="p-3">Booking ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans font-light">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted">
                          No payment transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p.id || p.transactionId} className="hover:bg-white/5">
                          <td className="p-3 font-mono text-[11px] text-coffee-300 font-bold">
                            {p.transactionId}
                          </td>
                          <td className="p-3 text-cream-200">{p.bookingId}</td>
                          <td className="p-3 font-medium text-cream-100">{p.customer?.name}</td>
                          <td className="p-3 font-bold text-emerald-400">₹{p.amount}</td>
                          <td className="p-3 text-muted uppercase font-bold text-[10px]">{p.method}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 text-muted text-[11px]">
                            {new Date(p.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: PHOTO & MEDIA UPLOADER                                  */}
        {/* ============================================================== */}
        {activeTab === "media" && (
          <div className="space-y-8">
            <div className="bg-[#191614] border border-white/10 rounded-sm p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-coffee-400 text-xs font-semibold uppercase tracking-widest">
                <Upload className="w-4 h-4" />
                <span>Upload New Cafe / Menu Photo</span>
              </div>

              {uploadMsg && (
                <div className={`p-3 rounded-sm mb-4 text-xs font-medium ${
                  uploadMsg.startsWith("✓")
                    ? "bg-emerald-950/50 border border-emerald-500/40 text-emerald-300"
                    : "bg-red-950/50 border border-red-500/40 text-red-300"
                }`}>
                  {uploadMsg}
                </div>
              )}

              <form onSubmit={handleUploadImage} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* File picker & Preview */}
                <div className="md:col-span-5 flex flex-col justify-center items-center border-2 border-dashed border-white/15 hover:border-coffee-400/60 rounded-sm p-6 bg-background-darker text-center transition-colors">
                  {uploadPreview ? (
                    <div className="relative w-full aspect-video rounded-sm overflow-hidden">
                      <img
                        src={uploadPreview}
                        alt="Upload Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadFile(null);
                          setUploadPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/80 text-cream-100 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 text-coffee-400/60 mx-auto mb-3" />
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-colors">
                        <span>Select Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-muted block mt-2">
                        JPG, PNG, WebP up to 5MB
                      </span>
                    </div>
                  )}
                </div>

                {/* Form metadata */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                      Image Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mezzanine Netflix Screening Lounge"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-2.5 rounded-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                      Gallery Category *
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-2.5 rounded-sm outline-none"
                    >
                      <option value="ambience">Lounge Ambience</option>
                      <option value="mezzanine">Mezzanine & Stairs</option>
                      <option value="neon">Neon Booths</option>
                      <option value="food">Pizzas & Momos</option>
                      <option value="drinks">Coffee & Beverages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                      Short Caption / Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cozy fairy-lit upper floor lounge setup"
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-2.5 rounded-sm outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!uploadFile || isUploading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-coffee-400 hover:bg-coffee-500 disabled:opacity-40 text-background-darker font-bold text-xs uppercase tracking-widest py-3 rounded-sm transition-all shadow-md"
                  >
                    <span>{isUploading ? `Uploading (${uploadProgress}%)...` : "Publish To Live Gallery"}</span>
                    <Upload className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>

            {/* Uploaded Photos Library */}
            <div className="bg-[#191614] border border-white/10 rounded-sm p-6 shadow-xl">
              <h3 className="font-serif text-xl text-cream-100 uppercase tracking-wide mb-4">
                Live Uploaded Media ({galleryImages.length})
              </h3>
              
              {galleryImages.length === 0 ? (
                <div className="p-8 text-center text-muted text-xs">
                  No custom images uploaded yet. Upload above to add photos to the live website gallery!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div
                      key={img.id}
                      className="bg-background-darker border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={img.src}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-black/80 text-coffee-300 text-[10px] uppercase font-bold">
                          {img.category}
                        </span>
                      </div>

                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-cream-100 truncate max-w-[140px]">
                            {img.title}
                          </h4>
                          <span className="text-[10px] text-muted block">
                            {new Date(img.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id, img.storagePath)}
                          className="p-1.5 rounded-sm bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Booking Inspection & Authority Modal / Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-xl bg-background-card border border-white/15 rounded-sm p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-muted uppercase">Authority Inspector</span>
                <h3 className="font-serif text-xl text-cream-100">
                  Booking #{selectedBooking.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-muted hover:text-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-background-darker rounded-sm">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Customer</span>
                  <strong className="text-cream-100 text-sm">{selectedBooking.customer?.name}</strong>
                  <span className="block text-muted">{selectedBooking.customer?.phone}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Reservation</span>
                  <strong className="text-cream-100">{selectedBooking.reservation?.date} at {selectedBooking.reservation?.timeSlot}</strong>
                  <span className="block text-coffee-300 font-semibold">{selectedBooking.reservation?.areaName} ({selectedBooking.reservation?.guestCount} Guests)</span>
                </div>
              </div>

              {selectedBooking.reservation?.specialRequests && (
                <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-sm">
                  <span className="text-purple-300 font-bold uppercase text-[10px] block mb-1">
                    Customer Special Request:
                  </span>
                  <p className="text-purple-200 italic">"{selectedBooking.reservation?.specialRequests}"</p>
                </div>
              )}

              {selectedBooking.preOrder?.hasPreOrder && (
                <div className="p-3 bg-background-darker rounded-sm border border-white/5">
                  <span className="text-[10px] uppercase text-muted block mb-1 font-bold">
                    Pre-Ordered Food Items (₹{selectedBooking.preOrder.totalBill}):
                  </span>
                  <ul className="space-y-1 text-cream-300">
                    {selectedBooking.preOrder.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name} ({item.variant})</span>
                        <span>₹{item.itemTotal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Admin Internal Staff Note */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-muted mb-1">
                  Staff / Admin Internal Notes:
                </label>
                <textarea
                  rows={2}
                  defaultValue={selectedBooking.adminNotes || ""}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes for staff (e.g. Birthday cake kept in fridge, table decorated)..."
                  className="w-full bg-background-darker border border-white/15 text-cream-100 p-2.5 rounded-sm outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleAdminStatusAction(selectedBooking.id || selectedBooking.bookingId, selectedBooking.status, editNotes)}
                  className="mt-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-cream-200 text-[10px] uppercase font-bold rounded-xs"
                >
                  Save Internal Note
                </button>
              </div>

              {/* Authority Reassign Table */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-muted mb-1">
                  Reassign Seating Zone:
                </label>
                <div className="flex gap-2">
                  <select
                    defaultValue={selectedBooking.reservation?.areaId}
                    onChange={(e) => handleReassignArea(selectedBooking.id || selectedBooking.bookingId, e.target.value)}
                    className="flex-1 bg-background-darker border border-white/15 text-cream-100 p-2 rounded-sm outline-none text-xs"
                  >
                    {SEATING_AREAS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.floor})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => printEmailReceipt(selectedBooking)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-coffee-400 text-background-darker font-bold text-xs uppercase tracking-wider rounded-sm shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-cream-100 text-xs uppercase tracking-wider rounded-sm font-semibold"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
