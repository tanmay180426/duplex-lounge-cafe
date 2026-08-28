import React from "react";
import { Clock, Check, Calendar } from "lucide-react";
import { CAFE_INFO } from "../data/cafeInfo";
import { getCafeStatus } from "../utils/hoursHelper";

export default function OpeningHours() {
  const status = getCafeStatus();

  return (
    <div className="bg-background-card border border-white/10 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-coffee-500/10 border border-coffee-500/20 flex items-center justify-center text-coffee-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-coffee-400 font-medium block">
                Timings
              </span>
              <h3 className="font-serif text-2xl text-cream-100 font-normal">
                Opening Hours
              </h3>
            </div>
          </div>

          {/* Dynamic Status Pill */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border ${
              status.isOpen
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                : "bg-neutral-900 border-neutral-700 text-neutral-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status.isOpen ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
              }`}
            />
            <span>{status.statusLabel}</span>
          </div>
        </div>

        {/* Current status note */}
        <div className="mb-6 p-3.5 bg-white/5 border border-white/5 rounded-sm flex items-center justify-between text-xs">
          <span className="text-muted">Current status:</span>
          <span className="text-cream-200 font-medium font-sans">
            {status.subLabel}
          </span>
        </div>

        {/* Schedule List */}
        <div className="space-y-2.5 font-sans">
          {CAFE_INFO.hours.map((schedule) => {
            const isToday =
              schedule.day.toLowerCase() === status.todayDay.toLowerCase();

            return (
              <div
                key={schedule.day}
                className={`flex items-center justify-between py-2 px-3 rounded-sm text-xs sm:text-sm transition-colors ${
                  isToday
                    ? "bg-coffee-500/15 border border-coffee-500/40 text-cream-100 font-medium"
                    : "text-muted hover:text-cream-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{schedule.day}</span>
                  {isToday && (
                    <span className="text-[9px] uppercase tracking-wider bg-coffee-400 text-background-darker px-1.5 py-0.5 rounded-sm font-bold font-sans">
                      Today
                    </span>
                  )}
                </div>
                <span className={isToday ? "text-coffee-300 font-semibold" : "text-cream-300/80"}>
                  {schedule.display}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 pt-4 border-t border-white/5 text-[11px] text-muted-dark font-sans flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-coffee-400" />
        <span>Hours may differ slightly on national holidays & festivals.</span>
      </div>
    </div>
  );
}
