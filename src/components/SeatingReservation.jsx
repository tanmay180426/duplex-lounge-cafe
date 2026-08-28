import React from "react";
import { 
  Calendar, 
  Users, 
  Tv, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Coffee,
  Heart
} from "lucide-react";
import { SEATING_AREAS } from "../data/tableData";

export default function SeatingReservation({ onOpenBooking }) {
  return (
    <section id="book-table" className="py-20 sm:py-28 bg-background-darker relative overflow-hidden border-t border-white/5">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-coffee-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coffee-500/10 border border-coffee-500/30 text-coffee-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reserved Dining Experience</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-cream-100 uppercase tracking-tight leading-tight mb-6">
            Book Your Table <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 via-coffee-400 to-coffee-200 italic">
              At Duplex Lounge
            </span>
          </h2>

          <p className="text-muted text-sm sm:text-base md:text-lg font-light font-sans max-w-2xl mx-auto leading-relaxed">
            Reserve your favorite spot in advance—from our private Mezzanine Netflix lounge upstairs to glowing neon booths on the ground floor. Zero reservation fee & instant confirmation.
          </p>
        </div>

        {/* 4 Seating Area Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SEATING_AREAS.map((area) => (
            <div
              key={area.id}
              className="group bg-background-card hover:bg-background-cardHover border border-white/10 hover:border-coffee-400/50 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-coffee-950/40"
            >
              <div>
                {/* Image Header or Gradient Placeholder */}
                <div className="relative h-60 sm:h-72 overflow-hidden bg-neutral-900">
                  {area.image ? (
                    <img
                      src={area.image}
                      alt={area.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-background-elevated via-background-card to-coffee-950/40 flex items-center justify-center p-8 text-center">
                      <div className="max-w-xs">
                        <Coffee className="w-12 h-12 text-coffee-400 mx-auto mb-3 opacity-60" />
                        <h4 className="font-serif text-xl text-cream-100 mb-1">{area.name}</h4>
                        <p className="text-xs text-muted font-sans">{area.subtitle}</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-background-card via-background-card/30 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-sm bg-background-darker/90 backdrop-blur-md border border-white/15 text-coffee-300 text-[11px] font-bold tracking-wider uppercase font-sans">
                      {area.floor}
                    </span>
                    {area.badge && (
                      <span className="px-3 py-1 rounded-sm bg-coffee-400 text-background-darker text-[11px] font-bold tracking-wider uppercase font-sans shadow-md">
                        {area.badge}
                      </span>
                    )}
                  </div>

                  {/* Guest Capacity Badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-sm bg-black/80 backdrop-blur-md border border-white/10 text-cream-100 text-xs font-medium font-sans flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-coffee-400" />
                    <span>{area.minGuests} – {area.maxGuests} Guests</span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 sm:p-8">
                  <div className="mb-4">
                    <h3 className="font-serif text-2xl sm:text-3xl text-cream-100 group-hover:text-coffee-300 transition-colors mb-1">
                      {area.name}
                    </h3>
                    <p className="text-coffee-400/90 text-xs uppercase tracking-wider font-semibold font-sans">
                      {area.subtitle}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-6">
                    {area.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-cream-300/90 font-sans font-light">
                        <CheckCircle2 className="w-4 h-4 text-coffee-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-6 sm:p-8 pt-0">
                <button
                  type="button"
                  onClick={() => onOpenBooking(area.id)}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-white/5 hover:bg-coffee-400 text-cream-100 hover:text-background-darker border border-white/15 hover:border-coffee-400 py-3.5 px-6 rounded-sm text-xs uppercase tracking-widest font-bold font-sans transition-all duration-300 shadow-md group-hover:bg-coffee-400 group-hover:text-background-darker group-hover:border-coffee-400"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve This Area</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Booking Benefits & Quick Action Banner */}
        <div className="rounded-sm bg-gradient-to-r from-background-card via-background-elevated to-background-card border border-coffee-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-coffee-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Confirmation & Flexible Slots</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream-100 mb-4">
                Planning a Birthday, Date or Hangout?
              </h3>
              <p className="text-muted text-sm sm:text-base font-light font-sans max-w-2xl mb-6">
                Pre-book your seating to guarantee your table, customize with our Netflix setup upstairs, or optionally pre-order your momos and pizzas so food is ready when you arrive.
              </p>

              {/* 3 Quick Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-cream-200 font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-coffee-500/20 text-coffee-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span>Zero Booking Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-coffee-500/20 text-coffee-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span>Instant WhatsApp Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-coffee-500/20 text-coffee-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span>Optional Food Pre-Order</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <button
                type="button"
                onClick={() => onOpenBooking(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-sm shadow-xl shadow-coffee-950/60 hover:shadow-coffee-500/30 transition-all duration-300 transform hover:-translate-y-0.5 font-sans"
              >
                <Calendar className="w-4 h-4" />
                <span>Book A Table Now</span>
              </button>
              <span className="text-[11px] text-muted mt-3 font-sans">
                Open Mon–Sun • Saturday 24 Hours
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
