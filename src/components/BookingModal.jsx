import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  Utensils,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Minus,
  MessageCircle,
  Receipt,
  Info,
  Layers,
  Search,
  CreditCard,
  Mail,
  Printer,
  FileText,
  ShieldCheck,
  Store,
  Edit3
} from "lucide-react";
import { SEATING_AREAS, OCCASIONS } from "../data/tableData";
import { MENU_CATEGORIES, MENU_ITEMS } from "../data/menuData";
import { CAFE_INFO } from "../data/cafeInfo";
import {
  calculateTrustedBill,
  checkSlotAvailability,
  createBooking,
  updateCustomerBooking,
  isBookingEditable,
  formatWhatsAppMessage
} from "../services/bookingService";
import { printEmailReceipt } from "../services/emailService";
import { getWhatsAppUrl } from "../config/ownerConfig";
import PaymentModal from "./PaymentModal";

export default function BookingModal({
  isOpen,
  onClose,
  initialAreaId = null,
  currentUser = null,
  editBooking = null,
  onPreviewEmail = null
}) {
  // Step state: 1 (Date & Time) -> 2 (Guests & Area) -> 3 (Food Pre-Order) -> 4 (Customer Info) -> 5 (Payment & Confirm) -> 6 (Confirmation Success)
  const [step, setStep] = useState(1);

  // Form State
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("06:30 PM");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedAreaId, setSelectedAreaId] = useState(initialAreaId || "mezzanine-lounge");
  
  // Pre-order item map: { [itemKey]: { itemId, variantLabel, quantity } }
  const [preOrderCart, setPreOrderCart] = useState({});
  const [activeMenuCategory, setActiveMenuCategory] = useState("all");
  const [menuSearch, setMenuSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [occasion, setOccasion] = useState("Casual Hangout");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment choice on Step 5: "ONLINE" | "COUNTER"
  const [paymentChoice, setPaymentChoice] = useState("ONLINE");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Booking result & UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [availabilityWarning, setAvailabilityWarning] = useState("");

  // Populate from editBooking if provided
  useEffect(() => {
    if (editBooking && isOpen) {
      if (editBooking.reservation?.date) setSelectedDate(editBooking.reservation.date);
      if (editBooking.reservation?.timeSlot) setSelectedTimeSlot(editBooking.reservation.timeSlot);
      if (editBooking.reservation?.guestCount) setGuestCount(editBooking.reservation.guestCount);
      if (editBooking.reservation?.areaId) setSelectedAreaId(editBooking.reservation.areaId);
      if (editBooking.customer?.name) setCustomerName(editBooking.customer.name);
      if (editBooking.customer?.phone) setCustomerPhone(editBooking.customer.phone);
      if (editBooking.customer?.email) setCustomerEmail(editBooking.customer.email);
      if (editBooking.reservation?.occasion) setOccasion(editBooking.reservation.occasion);
      if (editBooking.reservation?.specialRequests) setSpecialRequests(editBooking.reservation.specialRequests);

      // Pre-order cart pre-fill
      if (editBooking.preOrder?.items) {
        const cartObj = {};
        editBooking.preOrder.items.forEach((item) => {
          cartObj[`${item.id}-${item.variant || "Standard"}`] = {
            itemId: item.id,
            variantLabel: item.variant || "Standard",
            quantity: item.quantity
          };
        });
        setPreOrderCart(cartObj);
      }
    }
  }, [editBooking, isOpen]);

  // Auto-fill customer info if logged in (when not in edit mode)
  useEffect(() => {
    if (currentUser && !editBooking) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !customerPhone) setCustomerPhone(currentUser.phone);
      if (currentUser.email && !customerEmail) setCustomerEmail(currentUser.email);
    }
  }, [currentUser, editBooking]);

  // Sync initial area
  useEffect(() => {
    if (initialAreaId && !editBooking) {
      setSelectedAreaId(initialAreaId);
    }
  }, [initialAreaId, editBooking]);

  // Reset when opening
  useEffect(() => {
    if (isOpen && !editBooking) {
      setStep(1);
      setErrorMessage("");
      setAvailabilityWarning("");
      setConfirmedBooking(null);
    }
  }, [isOpen, editBooking]);

  // Compute available operating hour time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dateObj = new Date(selectedDate);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

    const isSaturday = dayName === "Saturday";
    const isFriSun = dayName === "Friday" || dayName === "Sunday";

    const slots = [];
    let startHour = 11;
    let endHour = isFriSun ? 23 : 22.5;

    if (isSaturday) {
      startHour = 0;
      endHour = 24;
    }

    for (let h = startHour; h < endHour; h += 0.5) {
      const wholeHour = Math.floor(h);
      const minutes = h % 1 === 0 ? "00" : "30";
      const period = wholeHour >= 12 && wholeHour < 24 ? "PM" : "AM";
      const displayHour = wholeHour === 0 ? 12 : wholeHour > 12 ? wholeHour - 12 : wholeHour;
      slots.push(`${displayHour.toString().padStart(2, "0")}:${minutes} ${period}`);
    }

    return slots;
  }, [selectedDate]);

  // Selected Seating Area object
  const currentArea = useMemo(() => {
    return SEATING_AREAS.find((a) => a.id === selectedAreaId) || SEATING_AREAS[0];
  }, [selectedAreaId]);

  // Raw array for trusted bill computation
  const rawCartArray = useMemo(() => {
    return Object.values(preOrderCart).filter((item) => item.quantity > 0);
  }, [preOrderCart]);

  // Trusted Bill calculation
  const billSummary = useMemo(() => {
    return calculateTrustedBill(rawCartArray);
  }, [rawCartArray]);

  // Filtered menu items for Step 3 Pre-Order
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCat = activeMenuCategory === "all" || item.category === activeMenuCategory;
      const matchSearch =
        !menuSearch ||
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(menuSearch.toLowerCase());
      const matchVeg = !vegOnly || item.isVeg;
      return matchCat && matchSearch && matchVeg;
    });
  }, [activeMenuCategory, menuSearch, vegOnly]);

  // Real-time availability check when Date, Time, or Area changes
  useEffect(() => {
    let isMounted = true;
    async function check() {
      if (selectedDate && selectedTimeSlot && selectedAreaId) {
        // If editing and same slot, skip warning
        if (
          editBooking &&
          selectedDate === editBooking.reservation?.date &&
          selectedTimeSlot === editBooking.reservation?.timeSlot &&
          selectedAreaId === editBooking.reservation?.areaId
        ) {
          setAvailabilityWarning("");
          return;
        }

        const result = await checkSlotAvailability(selectedDate, selectedTimeSlot, selectedAreaId);
        if (isMounted) {
          if (!result.available) {
            setAvailabilityWarning(result.reason);
          } else {
            setAvailabilityWarning("");
          }
        }
      }
    }
    check();
    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedTimeSlot, selectedAreaId, editBooking]);

  // Cart operations
  const handleUpdateQuantity = (itemId, variantLabel = "Standard", change) => {
    const key = `${itemId}-${variantLabel}`;
    setPreOrderCart((prev) => {
      const current = prev[key] || { itemId, variantLabel, quantity: 0 };
      const newQty = Math.max(0, current.quantity + change);
      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return {
        ...prev,
        [key]: { ...current, quantity: newQty }
      };
    });
  };

  // Submit Booking (Create or Update)
  const handleSubmitBooking = async (paymentResult = null) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (editBooking) {
        // UPDATE EXISTING BOOKING VIA 6-HOUR POLICY
        const updated = await updateCustomerBooking({
          bookingId: editBooking.id || editBooking.bookingId,
          reservation: {
            date: selectedDate,
            timeSlot: selectedTimeSlot,
            areaId: selectedAreaId,
            areaName: currentArea.name,
            guestCount: guestCount,
            occasion: occasion,
            specialRequests: specialRequests
          },
          rawPreOrderItems: rawCartArray,
          customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail
          }
        });

        setConfirmedBooking(updated);
        setIsSubmitting(false);
        setStep(6);
        return;
      }

      // CREATE NEW BOOKING
      const paymentData = paymentResult || {
        method: "PAY_AT_COUNTER",
        status: "PENDING",
        transactionId: null,
        amount: billSummary.totalBill,
        paidAt: null
      };

      const booking = await createBooking({
        customer: {
          userId: currentUser?.uid || null,
          name: customerName,
          phone: customerPhone,
          email: customerEmail
        },
        reservation: {
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          areaId: selectedAreaId,
          areaName: currentArea.name,
          guestCount: guestCount,
          occasion: occasion,
          specialRequests: specialRequests
        },
        rawPreOrderItems: rawCartArray,
        payment: paymentData
      });

      setConfirmedBooking(booking);
      setIsSubmitting(false);
      setStep(6);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Could not complete reservation. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-background-card border border-white/15 rounded-sm shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-background-darker border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-coffee-400 bg-coffee-500/10 flex items-center justify-center text-coffee-300">
              {editBooking ? <Edit3 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-cream-100 uppercase tracking-wide">
                {editBooking ? `Modify Reservation #${editBooking.bookingId}` : "Book A Table"}
              </h3>
              <p className="text-xs text-muted font-sans font-light">
                {editBooking
                  ? "6-Hour policy active: Modify your seating date, time & pre-orders"
                  : "Duplex Lounge Cafe • Kalyan (W)"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-cream-100 hover:bg-white/10 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="px-6 py-3 bg-background-darker/60 border-b border-white/5 flex items-center justify-between text-xs text-muted font-sans">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? "bg-coffee-400 text-background-darker" : "bg-white/10 text-muted"}`}>1</span>
              <span className="hidden sm:inline">Date/Time</span>
            </div>
            <div className="w-6 h-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? "bg-coffee-400 text-background-darker" : "bg-white/10 text-muted"}`}>2</span>
              <span className="hidden sm:inline">Area</span>
            </div>
            <div className="w-6 h-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? "bg-coffee-400 text-background-darker" : "bg-white/10 text-muted"}`}>3</span>
              <span className="hidden sm:inline">Pre-Order</span>
            </div>
            <div className="w-6 h-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 4 ? "bg-coffee-400 text-background-darker" : "bg-white/10 text-muted"}`}>4</span>
              <span className="hidden sm:inline">Details</span>
            </div>
            <div className="w-6 h-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 5 ? "bg-coffee-400 text-background-darker" : "bg-white/10 text-muted"}`}>5</span>
              <span className="hidden sm:inline">{editBooking ? "Save" : "Payment"}</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 rounded-sm bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {availabilityWarning && (
            <div className="p-3.5 rounded-sm bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{availabilityWarning}</span>
            </div>
          )}

          {/* STEP 1: DATE & TIME SLOT */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-2">
                  Select Reservation Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-sm px-4 py-3 rounded-sm outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-light">
                    Select Time Slot
                  </label>
                  <span className="text-[11px] text-coffee-300 font-medium">
                    {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" }) === "Saturday" ? "Saturday 24 Hours" : "Standard Hours"}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1 bg-background-darker/40 rounded-sm border border-white/5">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-2 text-xs rounded-sm transition-all font-medium ${
                        selectedTimeSlot === slot
                          ? "bg-coffee-400 text-background-darker font-bold shadow-md"
                          : "bg-background-darker hover:bg-white/10 text-cream-200 border border-white/5"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST COUNT & SEATING AREA */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`w-10 h-10 rounded-sm text-xs font-bold transition-all ${
                        guestCount === num
                          ? "bg-coffee-400 text-background-darker shadow-md"
                          : "bg-background-darker hover:bg-white/10 text-cream-200 border border-white/10"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-2">
                  Choose Seating Zone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SEATING_AREAS.map((area) => (
                    <div
                      key={area.id}
                      onClick={() => setSelectedAreaId(area.id)}
                      className={`cursor-pointer p-4 rounded-sm border transition-all ${
                        selectedAreaId === area.id
                          ? "bg-coffee-500/15 border-coffee-400 text-cream-100 shadow-md"
                          : "bg-background-darker hover:bg-background-card border-white/10 text-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif text-sm font-semibold text-cream-100">
                          {area.name}
                        </span>
                        {selectedAreaId === area.id && (
                          <CheckCircle2 className="w-4 h-4 text-coffee-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-coffee-300 font-bold uppercase tracking-wider block mb-1">
                        {area.floor} • Capacity {area.minGuests}–{area.maxGuests}
                      </span>
                      <p className="text-[11px] text-muted-light leading-normal line-clamp-2">
                        {area.features[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FOOD PRE-ORDER */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-coffee-500/10 border border-coffee-500/20 p-3 rounded-sm">
                <div>
                  <span className="text-xs font-semibold text-coffee-300 block">
                    Optional Food & Drink Pre-Order
                  </span>
                  <span className="text-[11px] text-muted">
                    Pre-ordered food will be prepared fresh for your arrival.
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted block">Cart Bill:</span>
                  <span className="font-serif text-base font-bold text-coffee-300">
                    ₹{billSummary.totalBill}
                  </span>
                </div>
              </div>

              {/* Category Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMenuCategory("all")}
                  className={`px-3 py-1.5 rounded-sm uppercase tracking-wider font-semibold whitespace-nowrap ${
                    activeMenuCategory === "all"
                      ? "bg-coffee-400 text-background-darker"
                      : "bg-background-darker text-muted hover:text-cream-100"
                  }`}
                >
                  All Items
                </button>
                {MENU_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveMenuCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-sm uppercase tracking-wider font-semibold whitespace-nowrap ${
                      activeMenuCategory === cat.id
                        ? "bg-coffee-400 text-background-darker"
                        : "bg-background-darker text-muted hover:text-cream-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Menu Item Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1">
                {filteredMenuItems.slice(0, 14).map((item) => {
                  const key = `${item.id}-Standard`;
                  const qty = preOrderCart[key]?.quantity || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-sm bg-background-darker border border-white/5 flex items-center justify-between"
                    >
                      <div className="pr-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.isVeg ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          <span className="text-xs font-semibold text-cream-100 truncate block max-w-[140px]">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-coffee-300 font-bold">
                          ₹{item.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, "Standard", -1)}
                          disabled={qty === 0}
                          className="w-6 h-6 rounded-sm bg-white/10 hover:bg-white/20 disabled:opacity-30 text-cream-100 flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-cream-100">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, "Standard", 1)}
                          className="w-6 h-6 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS & OCCASION */}
          {step === 4 && (
            <div className="space-y-4">
              {currentUser && !editBooking && (
                <div className="p-3 bg-coffee-500/10 border border-coffee-500/30 rounded-sm flex items-center justify-between text-xs">
                  <span className="text-coffee-300">
                    Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">
                    Auto-Filled
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohit Deshmukh"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-3 rounded-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 45678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-3 rounded-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                    Email Address (For Confirmation) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rohit@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-3 rounded-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-3 rounded-sm outline-none"
                >
                  {OCCASIONS.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                  Special Requests / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Birthday music, window side, extra chairs..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3.5 py-3 rounded-sm outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: PAYMENT SELECTION & REVIEW / SAVE CHANGES */}
          {step === 5 && (
            <div className="space-y-5">
              {/* Summary Card */}
              <div className="p-4 bg-background-darker border border-white/10 rounded-sm space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Reservation Details:</span>
                  <span className="text-cream-100 font-semibold">
                    {selectedDate} at {selectedTimeSlot} ({guestCount} Guests)
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Seating Zone:</span>
                  <span className="text-coffee-300 font-semibold">{currentArea.name}</span>
                </div>
                <div className="flex justify-between text-muted pt-2 border-t border-white/5">
                  <span>Total Food Bill:</span>
                  <span className="text-coffee-300 font-bold text-sm">
                    ₹{billSummary.totalBill}
                  </span>
                </div>
              </div>

              {editBooking ? (
                <div className="p-4 bg-coffee-500/10 border border-coffee-500/30 rounded-sm text-xs space-y-2">
                  <div className="flex items-center gap-2 text-coffee-300 font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4 text-coffee-400" />
                    <span>Confirm Changes Under 6-Hour Policy</span>
                  </div>
                  <p className="text-muted leading-relaxed">
                    Saving these updates will update your table reservation and notify the cafe team. Your updated confirmation receipt will be emailed immediately.
                  </p>
                </div>
              ) : (
                /* Payment Choice Radio for new booking */
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-2">
                    Choose Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Option 1: Pay Online */}
                    <div
                      onClick={() => setPaymentChoice("ONLINE")}
                      className={`cursor-pointer p-4 rounded-sm border transition-all ${
                        paymentChoice === "ONLINE"
                          ? "bg-coffee-500/15 border-coffee-400 text-cream-100"
                          : "bg-background-darker border-white/10 text-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-coffee-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-cream-100">
                            Pay Online Now
                          </span>
                        </div>
                        {paymentChoice === "ONLINE" && (
                          <CheckCircle2 className="w-4 h-4 text-coffee-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-light">
                        Instant UPI QR Code, GPay, PhonePe, Paytm or Cards. Zero fees.
                      </p>
                    </div>

                    {/* Option 2: Pay at Counter */}
                    <div
                      onClick={() => setPaymentChoice("COUNTER")}
                      className={`cursor-pointer p-4 rounded-sm border transition-all ${
                        paymentChoice === "COUNTER"
                          ? "bg-coffee-500/15 border-coffee-400 text-cream-100"
                          : "bg-background-darker border-white/10 text-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-coffee-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-cream-100">
                            Pay At Counter
                          </span>
                        </div>
                        {paymentChoice === "COUNTER" && (
                          <CheckCircle2 className="w-4 h-4 text-coffee-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-light">
                        Pay with Cash, UPI, or Card at the cafe counter upon arrival.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* Email Generation Callout */}
              <div className="p-3 rounded-sm bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  An updated HTML confirmation receipt will be generated and sent to{" "}
                  <strong>{customerEmail || "your email"}</strong>.
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION SUCCESS */}
          {step === 6 && confirmedBooking && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-coffee-500/20 text-coffee-300 text-xs font-bold tracking-widest uppercase border border-coffee-500/30">
                  {editBooking ? "Reservation Modified!" : "Reservation Confirmed!"}
                </span>
                <h3 className="font-serif text-3xl text-cream-100 mt-2">
                  Booking #{confirmedBooking.bookingId}
                </h3>
                <p className="text-xs text-muted max-w-md mx-auto mt-2">
                  {editBooking
                    ? `Your modifications for ${confirmedBooking.customer.name} have been updated successfully.`
                    : `We look forward to seeing you at Duplex Lounge Cafe, ${confirmedBooking.customer.name}!`}
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="max-w-md mx-auto p-4 bg-background-darker border border-white/10 rounded-sm text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Date & Time:</span>
                  <span className="text-cream-100 font-semibold">
                    {confirmedBooking.reservation.date} at {confirmedBooking.reservation.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Seating Area:</span>
                  <span className="text-coffee-300 font-semibold">
                    {confirmedBooking.reservation.areaName} ({confirmedBooking.reservation.guestCount} Guests)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payment Status:</span>
                  <span className="text-emerald-400 font-bold">
                    {confirmedBooking.payment?.status === "PAID" ? "✓ Paid Online" : "● Pay at Counter"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5">
                  <span className="text-muted">Email Generated:</span>
                  <span className="text-cream-100 font-mono text-[11px]">
                    {confirmedBooking.customer.email}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onPreviewEmail && onPreviewEmail(confirmedBooking)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-white/10 hover:bg-white/15 text-cream-100 text-xs uppercase tracking-wider font-bold transition-colors"
                >
                  <FileText className="w-4 h-4 text-coffee-400" />
                  <span>View Email Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => printEmailReceipt(confirmedBooking)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-white/10 hover:bg-white/15 text-cream-100 text-xs uppercase tracking-wider font-bold transition-colors"
                >
                  <Printer className="w-4 h-4 text-coffee-400" />
                  <span>Print Receipt</span>
                </button>

                <a
                  href={getWhatsAppUrl(formatWhatsAppMessage(confirmedBooking))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-bold transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Controls (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="p-4 sm:p-5 bg-background-darker border-t border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-cream-100 uppercase tracking-wider font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  if (step === 4 && (!customerName || !customerPhone || !customerEmail)) {
                    setErrorMessage("Please provide customer name, phone number, and email address.");
                    return;
                  }
                  setStep(step + 1);
                }}
                disabled={Boolean(availabilityWarning)}
                className="inline-flex items-center gap-2 bg-coffee-400 hover:bg-coffee-500 disabled:opacity-40 text-background-darker text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-sm transition-all shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (editBooking) {
                    handleSubmitBooking();
                  } else if (paymentChoice === "ONLINE" && billSummary.totalBill > 0) {
                    setIsPaymentModalOpen(true);
                  } else {
                    handleSubmitBooking();
                  }
                }}
                disabled={isSubmitting || Boolean(availabilityWarning)}
                className="inline-flex items-center gap-2 bg-coffee-400 hover:bg-coffee-500 disabled:opacity-40 text-background-darker text-xs uppercase tracking-widest font-bold px-8 py-3 rounded-sm transition-all shadow-lg"
              >
                <span>
                  {isSubmitting
                    ? "Saving Changes..."
                    : editBooking
                    ? "Save Booking Changes"
                    : paymentChoice === "ONLINE" && billSummary.totalBill > 0
                    ? `Proceed To Pay ₹${billSummary.totalBill}`
                    : "Confirm Reservation"}
                </span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>

      {/* Online Payment Platform Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingDetails={{
            bookingId: `DLC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            customer: { name: customerName, phone: customerPhone, email: customerEmail },
            preOrder: billSummary
          }}
          onPaymentSuccess={(paymentResult) => {
            setIsPaymentModalOpen(false);
            handleSubmitBooking(paymentResult);
          }}
        />
      )}

    </div>
  );
}
