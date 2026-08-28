import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Tv,
  Camera,
  Heart,
  Phone
} from "lucide-react";
import { SEATING_AREAS, CAFE_PHYSICAL_TABLES } from "../data/tableData";
import { getLiveDayAvailabilityMatrix } from "../services/bookingService";
import { OWNER_CONFIG } from "../config/ownerConfig";

export default function BookingPage({ onOpenBooking }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState("all");
  const [availabilityMatrix, setAvailabilityMatrix] = useState({});

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // Refresh availability matrix whenever date changes
  useEffect(() => {
    const matrix = getLiveDayAvailabilityMatrix(selectedDate);
    setAvailabilityMatrix(matrix);
  }, [selectedDate]);

  // Generate operating time slots for selected date
  const timeSlots = useMemo(() => {
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

    for (let h = startHour; h < endHour; h += 1) {
      const wholeHour = Math.floor(h);
      const period = wholeHour >= 12 && wholeHour < 24 ? "PM" : "AM";
      const displayHour = wholeHour === 0 ? 12 : wholeHour > 12 ? wholeHour - 12 : wholeHour;
      slots.push(`${displayHour.toString().padStart(2, "0")}:00 ${period}`);
    }

    return slots;
  }, [selectedDate]);

  const filteredAreas = useMemo(() => {
    if (selectedAreaFilter === "all") return SEATING_AREAS;
    return SEATING_AREAS.filter((a) => a.id === selectedAreaFilter);
  }, [selectedAreaFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12 animate-fade-in font-sans">
      
      {/* Header & Policy Badge */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Instant Auto-Confirmation • Zero Waiting</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-cream-100 uppercase tracking-wide">
          Live Seating & Table Booking
        </h1>
        
        <p className="text-xs sm:text-sm text-muted-light font-light leading-relaxed">
          View live seating availability in real time across our Ground Floor and Upper Mezzanine Lounge. Valid bookings are <strong>automatically confirmed instantly</strong> with zero delay.
        </p>

        {/* 6-Hour Policy Notice */}
        <div className="p-3 bg-[#191614] border border-coffee-400/30 rounded-sm text-xs text-cream-200 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-coffee-400 shrink-0" />
          <span>
            <strong>6-Hour Policy:</strong> You can edit your table time or pre-orders online up to <strong>6 hours before arrival</strong>.
          </span>
        </div>
      </div>

      {/* Date & Area Filter Controls */}
      <div className="bg-[#141211] border border-white/10 p-5 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Date Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted uppercase font-bold">Select Date:</span>
          <button
            type="button"
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-sm transition-colors ${
              selectedDate === todayStr
                ? "bg-coffee-400 text-background-darker"
                : "bg-white/5 text-muted hover:text-cream-100"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(tomorrowStr)}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-sm transition-colors ${
              selectedDate === tomorrowStr
                ? "bg-coffee-400 text-background-darker"
                : "bg-white/5 text-muted hover:text-cream-100"
            }`}
          >
            Tomorrow
          </button>
          <input
            type="date"
            min={todayStr}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-background-darker border border-white/15 text-cream-100 text-xs px-2.5 py-1.5 rounded-sm outline-none"
          />
        </div>

        {/* Area Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted uppercase font-bold">Filter Zone:</span>
          <select
            value={selectedAreaFilter}
            onChange={(e) => setSelectedAreaFilter(e.target.value)}
            className="bg-background-darker border border-white/15 text-cream-100 text-xs px-3 py-1.5 rounded-sm outline-none"
          >
            <option value="all">All Seating Zones (4)</option>
            {SEATING_AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.floor})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* 4 Seating Zones Cards with Live Time Slot Availability Matrix */}
      <div className="space-y-8">
        {filteredAreas.map((area) => {
          return (
            <div
              key={area.id}
              className="bg-[#141211] border border-white/10 hover:border-coffee-400/40 rounded-sm overflow-hidden transition-all shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Area Visual & Details */}
                <div className="lg:col-span-4 p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-xs bg-coffee-500/20 text-coffee-300 text-[10px] font-bold uppercase tracking-wider">
                        {area.floor}
                      </span>
                      <span className="text-[10px] text-muted font-bold uppercase">
                        👥 Capacity: {area.minGuests}–{area.maxGuests} Guests
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-cream-100">{area.name}</h3>
                    <p className="text-xs text-muted mt-2 leading-relaxed font-light">
                      {area.features.join(" • ")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenBooking(area.id)}
                    className="w-full py-3 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-widest transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Instant Reserve Table</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Live Time Slots Availability Grid */}
                <div className="lg:col-span-8 p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-base text-cream-100 uppercase tracking-wide">
                        Live Availability Matrix for {new Date(selectedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </h4>
                      <span className="text-[11px] text-muted">
                        Click any open green slot to book directly with instant auto-approval.
                      </span>
                    </div>

                    {/* Legend */}
                    <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold uppercase">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> Open
                      </span>
                      <span className="flex items-center gap-1 text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-400" /> Reserved
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((slot) => {
                      const key = `${slot}_${area.id}`;
                      const isBooked = Boolean(availabilityMatrix[key]);

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => onOpenBooking(area.id)}
                          className={`p-2.5 rounded-sm text-center transition-all flex flex-col items-center justify-between border ${
                            isBooked
                              ? "bg-red-950/20 border-red-500/30 text-red-400 opacity-60 cursor-not-allowed"
                              : "bg-background-darker hover:bg-emerald-950/40 border-white/10 hover:border-emerald-500/50 text-cream-100 hover:text-emerald-300 shadow-sm"
                          }`}
                        >
                          <span className="text-xs font-semibold block">{slot}</span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded-xs ${
                              isBooked
                                ? "bg-red-900/40 text-red-300"
                                : "bg-emerald-900/40 text-emerald-300"
                            }`}
                          >
                            {isBooked ? "Reserved" : "Available"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
