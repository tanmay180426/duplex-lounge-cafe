import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  RotateCcw
} from "lucide-react";
import { SEATING_AREAS } from "../data/tableData";
import {
  getAvailableTimeSlots,
  getAvailableZonesForPartySize,
  getCurrentISTTime,
  createBooking,
  DEFAULT_SLOT_INTERVAL_MINUTES,
  validateIndianPhone,
  logCustomerSession
} from "../services/bookingService";
import BookingConfirmation from "./BookingConfirmation";

export default function BookingModal({
  isOpen,
  onClose,
  initialAreaId = null
}) {
  const [step, setStep] = useState(1);

  // Step 1
  const [selectedDate, setSelectedDate] = useState(() => getCurrentISTTime().todayDateString);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Step 2
  const [guestCount, setGuestCount] = useState(2);
  const [selectedAreaId, setSelectedAreaId] = useState(initialAreaId || "mezzanine-lounge");

  // Step 3
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null); // { zoneName, timeSlot, date } when capacity hit

  useEffect(() => {
    if (isOpen) {
      const { todayDateString } = getCurrentISTTime();
      if (!selectedDate) setSelectedDate(todayDateString);
      if (initialAreaId) setSelectedAreaId(initialAreaId);
      setStep(1);
      setErrorMessage("");
      setConfirmedBooking(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const availableTimeSlots = useMemo(
    () => getAvailableTimeSlots(selectedDate, DEFAULT_SLOT_INTERVAL_MINUTES),
    [selectedDate]
  );

  useEffect(() => {
    if (availableTimeSlots.length > 0) {
      if (!selectedTimeSlot || !availableTimeSlots.includes(selectedTimeSlot)) {
        setSelectedTimeSlot(availableTimeSlots[0]);
      }
    } else {
      setSelectedTimeSlot("");
    }
  }, [availableTimeSlots, selectedTimeSlot]);

  const suggestedZones = useMemo(
    () => getAvailableZonesForPartySize(guestCount),
    [guestCount]
  );

  useEffect(() => {
    if (suggestedZones.length > 0) {
      const exists = suggestedZones.some((z) => z.id === selectedAreaId);
      if (!exists) setSelectedAreaId(suggestedZones[0].id);
    }
  }, [suggestedZones, selectedAreaId]);

  const currentArea = useMemo(
    () => SEATING_AREAS.find((a) => a.id === selectedAreaId) || SEATING_AREAS[0],
    [selectedAreaId]
  );

  const handleProceedToReview = () => {
    setErrorMessage("");
    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    const phoneCheck = validateIndianPhone(customerPhone);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.reason);
      return;
    }
    // Normalize to E.164 for storage
    setCustomerPhone(phoneCheck.normalized);
    return handleSubmitBooking();
  };

  const handleSubmitBooking = async () => {
    setErrorMessage("");
    setFullyBooked(null);
    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        name: customerName,
        phone: customerPhone,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        zoneId: selectedAreaId,
        partySize: guestCount,
        specialRequests,
        email: ""
      });
      setConfirmedBooking(booking);
      setIsSubmitting(false);
      setStep(4);
      await logCustomerSession({
        outcome: "success",
        name: booking.name,
        phone: booking.phone,
        date: booking.date,
        timeSlot: booking.timeSlot,
        zoneId: booking.zoneId,
        zoneName: booking.zoneName,
        partySize: booking.partySize,
        bookingId: booking.bookingId
      });
    } catch (err) {
      setIsSubmitting(false);
      const msg = err.message || "Could not submit reservation. Please try again.";
      if (/fully booked/i.test(msg)) {
        setFullyBooked({
          zoneName: currentArea.name,
          timeSlot: selectedTimeSlot,
          date: selectedDate
        });
        await logCustomerSession({
          outcome: "fully_booked",
          name: customerName,
          phone: customerPhone,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          zoneId: selectedAreaId,
          zoneName: currentArea.name,
          partySize: guestCount,
          errorMessage: msg
        });
      } else {
        setErrorMessage(msg);
        await logCustomerSession({
          outcome: "error",
          name: customerName,
          phone: customerPhone,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          zoneId: selectedAreaId,
          zoneName: currentArea.name,
          partySize: guestCount,
          errorMessage: msg
        });
      }
    }
  };

  const handlePickAnother = () => {
    setFullyBooked(null);
    setErrorMessage("");
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-background-card border border-white/15 rounded-sm shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-5 sm:p-6 bg-background-darker border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-coffee-400 bg-coffee-500/10 flex items-center justify-center text-coffee-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-cream-100 uppercase tracking-wide">
                Book A Table
              </h3>
              <p className="text-xs text-muted font-sans font-light">
                Duplex Lounge Cafe • Kalyan (W)
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

        {step <= 3 && (
          <div className="px-6 py-3 bg-background-darker/60 border-b border-white/5 flex items-center justify-between text-xs text-muted font-sans">
            {[
              { n: 1, label: "Date & Time" },
              { n: 2, label: "Guests & Zone" },
              { n: 3, label: "Your Details" }
            ].map((s, i, arr) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step >= s.n
                        ? "bg-coffee-400 text-background-darker"
                        : "bg-white/10 text-muted"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < arr.length - 1 && <div className="w-6 h-[1px] bg-white/10" />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-sm bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-2">
                  Select Reservation Date
                </label>
                <input
                  type="date"
                  min={getCurrentISTTime().todayDateString}
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
                    {selectedDate === getCurrentISTTime().todayDateString
                      ? "Slots ≥ 1 hr ahead (IST)"
                      : "Full Operational Hours"}
                  </span>
                </div>

                {availableTimeSlots.length === 0 ? (
                  <div className="p-6 rounded-sm bg-background-darker/60 border border-amber-500/30 text-center space-y-2">
                    <Clock className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs text-amber-200 font-medium">
                      No further time slots available for today.
                    </p>
                    <p className="text-[11px] text-muted">
                      Please choose a future date.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1 bg-background-darker/40 rounded-sm border border-white/5">
                    {availableTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2.5 px-2 text-xs rounded-sm transition-all font-medium ${
                          selectedTimeSlot === slot
                            ? "bg-coffee-400 text-background-darker font-bold shadow-md scale-[1.02]"
                            : "bg-background-darker hover:bg-white/10 text-cream-200 border border-white/5"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-2">
                  Number of Guests
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-light">
                    Seating Zones for {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
                  </label>
                  <span className="text-[11px] text-coffee-300 font-medium">
                    {suggestedZones.length} Option{suggestedZones.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {suggestedZones.map((area) => (
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
                        {area.floor} • Capacity {area.minGuests}–{area.maxGuests} • {area.units || 1}{" "}
                        {area.units === 1 ? "Table" : "Tables"}
                      </span>
                      {area.features && area.features[0] && (
                        <p className="text-[11px] text-muted-light leading-normal line-clamp-2">
                          {area.features[0]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 rounded-sm bg-coffee-500/10 border border-coffee-500/30 text-xs text-coffee-200">
                Just a few quick details and you're done. We'll confirm your table by
                phone as soon as possible.
              </div>

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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9 +]*"
                    placeholder="e.g. 83695 76147"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-3.5 py-3 rounded-sm outline-none"
                  />
                </div>
                <p className="text-[11px] text-muted mt-1">
                  10-digit Indian mobile number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1">
                  Special Requests <span className="text-muted normal-case">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 text-muted absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    placeholder="e.g. Birthday cake, window side, extra chairs..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-3.5 py-3 rounded-sm outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && confirmedBooking && (
            <BookingConfirmation
              booking={confirmedBooking}
              onClose={onClose}
              onDone={onClose}
            />
          )}

          {fullyBooked && (
            <div className="text-center py-6 space-y-5">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-950/60 border-2 border-red-500 text-red-400 flex items-center justify-center shadow-xl shadow-red-950/30">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-300 text-xs font-bold tracking-widest uppercase border border-red-500/40">
                  Sorry, Fully Booked
                </span>
                <h3 className="font-serif text-2xl text-cream-100 mt-2">
                  No tables free in {fullyBooked.zoneName}
                </h3>
                <p className="text-xs text-muted mt-1.5 max-w-sm mx-auto">
                  The <strong className="text-cream-100">{fullyBooked.zoneName}</strong> is
                  fully booked for{" "}
                  <strong className="text-cream-100">{fullyBooked.date}</strong> at{" "}
                  <strong className="text-cream-100">{fullyBooked.timeSlot}</strong>.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-sm bg-background-darker border border-white/10 text-left text-xs space-y-2">
                <span className="block text-[10px] uppercase tracking-widest text-coffee-400 font-bold">
                  You can still get a table — try one of these
                </span>
                <ul className="space-y-1.5 text-cream-200">
                  <li className="flex items-start gap-2">
                    <span className="text-coffee-400">•</span>
                    <span>Pick a <strong>different time slot</strong> on the same day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-coffee-400">•</span>
                    <span>Choose a <strong>different seating zone</strong> if available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-coffee-400">•</span>
                    <span>Try a <strong>different date</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-coffee-400">•</span>
                    <span>Or call us to put you on the waitlist</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handlePickAnother}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker text-xs uppercase tracking-wider font-bold transition-all shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Pick Another Time / Zone</span>
                </button>
                <a
                  href="tel:+918369576147"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-white/10 hover:bg-white/15 text-cream-100 text-xs uppercase tracking-wider font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 text-coffee-400" />
                  <span>Call to Waitlist</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-xs text-muted hover:text-cream-100 uppercase tracking-wider font-semibold"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {step <= 3 && (
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

            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedTimeSlot || availableTimeSlots.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-coffee-400 hover:bg-coffee-500 disabled:opacity-40 text-background-darker text-xs uppercase tracking-wider font-bold transition-all shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker text-xs uppercase tracking-wider font-bold transition-all shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleProceedToReview}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker text-xs uppercase tracking-wider font-bold transition-all shadow-md"
              >
                <span>Review & Submit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}