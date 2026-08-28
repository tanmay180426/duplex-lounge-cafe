import React from "react";
import { ArrowDown, MapPin, UtensilsCrossed, Calendar, Star } from "lucide-react";
import { CAFE_INFO } from "../data/cafeInfo";
import { getCafeStatus } from "../utils/hoursHelper";

export default function Hero({ onOpenBooking }) {
  const status = getCafeStatus();

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background"
    >
      {/* Real Cafe Hero Background (Good Food Good Mood Neon Booth) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/duplex-neon-booth.jpg"
          alt="Duplex Lounge Cafe Interior & Neon Sign"
          className="w-full h-full object-cover object-center opacity-40 filter brightness-95 contrast-105"
        />
        {/* Multi-layer Gradient Overlays for Deep Visual Hierarchy */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-transparent to-background/95" />
        <div className="absolute inset-0 bg-radial-gradient" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in shadow-lg">
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status.isOpen ? "bg-emerald-400" : "bg-coffee-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                status.isOpen ? "bg-emerald-500" : "bg-coffee-500"
              }`}
            />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-cream-200">
            {status.statusLabel} • {status.subLabel}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-cream-100 uppercase font-normal leading-[1.08] mb-6 animate-fade-up">
          Good Food. <br />
          Good Mood. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-300 via-coffee-400 to-coffee-200 font-serif italic">
            Duplex.
          </span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-light font-light leading-relaxed mb-10 text-cream-300/90 animate-fade-up font-sans">
          {CAFE_INFO.subheading}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fade-up">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-sm shadow-xl shadow-coffee-950/50 hover:shadow-coffee-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book A Table</span>
          </button>

          <a
            href="#menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-background-elevated hover:bg-white/10 text-cream-200 border border-white/15 hover:border-coffee-400 font-medium text-sm uppercase tracking-widest px-8 py-4 rounded-sm backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <UtensilsCrossed className="w-4 h-4 text-coffee-400" />
            <span>Explore Menu</span>
          </a>
        </div>

        {/* Quick Social Proof / Location summary */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-cream-200 font-medium font-sans">5.0 Star Rating</span>
            <span className="text-muted-dark">({CAFE_INFO.googleRating.reviewCount}+ Google Reviews)</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-coffee-400" />
            <span>Tisgao Naka, Kalyan (W)</span>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/60 hover:text-coffee-400 transition-colors z-10 focus:outline-none"
        aria-label="Scroll to introduction"
      >
        <span className="text-[10px] uppercase tracking-[0.25em]">Discover</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
}
