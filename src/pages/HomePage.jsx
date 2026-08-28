import React from "react";
import {
  Calendar,
  Utensils,
  MapPin,
  ArrowRight,
  Sparkles,
  Tv,
  Camera,
  Heart,
  Clock,
  Phone,
  ChevronRight,
  Star,
  Layers,
  Award,
  Flame,
  CheckCircle2
} from "lucide-react";
import { InstagramIcon } from "../components/Icons";
import { CAFE_INFO } from "../data/cafeInfo";
import { SEATING_AREAS } from "../data/tableData";
import { SIGNATURE_PICKS } from "../data/menuData";
import { REVIEWS_DATA } from "../data/reviewsData";
import { OWNER_CONFIG, getWhatsAppUrl } from "../config/ownerConfig";

export default function HomePage({ onNavigate, onOpenBooking }) {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16 animate-fade-in font-sans">
      
      {/* 1. HERO SECTION WITH DIRECT QUICK ACTION HUBS */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Background Image with Ambient Glow Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/duplex-mezzanine-stairs.jpg"
            alt="Duplex Lounge Cafe Interior & Mezzanine Stairs"
            className="w-full h-full object-cover object-center brightness-[0.4] filter scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C] via-black/60 to-black/80" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-coffee-500/15 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coffee-500/20 border border-coffee-400/40 text-coffee-300 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-lg shadow-coffee-950/40">
            <Sparkles className="w-3.5 h-3.5 text-coffee-400" />
            <span>Kalyan's Premier Ambient Duplex Lounge</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-cream-100 uppercase leading-[1.1]">
            Good Food. <br />
            <span className="font-serif italic font-normal text-coffee-300">
              Good Vibes.
            </span>{" "}
            Duplex.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-cream-300 font-light max-w-2xl mx-auto leading-relaxed">
            Experience Kalyan's unique double-level cafe featuring fairy-lit mezzanine seating, private Netflix movie screenings, signature neon booths & artisan pizzas.
          </p>

          {/* 4 PRIMARY QUICK ACTION HUBS (Direct Navigation) */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            
            {/* Action 1: Live Book Table */}
            <button
              type="button"
              onClick={() => onNavigate("book")}
              className="group p-4 sm:p-5 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker transition-all duration-300 shadow-xl shadow-coffee-900/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-6 h-6 text-background-darker" />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest block text-background-darker/80">
                  Instant Confirm
                </span>
                <strong className="font-serif text-sm sm:text-base font-bold uppercase tracking-wide block">
                  Book Table
                </strong>
              </div>
            </button>

            {/* Action 2: Explore Menu */}
            <button
              type="button"
              onClick={() => onNavigate("menu")}
              className="group p-4 sm:p-5 rounded-sm bg-background-darker/90 hover:bg-[#1a1715] border border-white/15 hover:border-coffee-400/60 text-cream-100 transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <Utensils className="w-6 h-6 text-coffee-400" />
                <ArrowRight className="w-4 h-4 text-coffee-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest block text-muted">
                  80+ Dishes
                </span>
                <strong className="font-serif text-sm sm:text-base font-semibold uppercase tracking-wide block text-cream-100">
                  Explore Menu
                </strong>
              </div>
            </button>

            {/* Action 3: Instagram Hub */}
            <a
              href={CAFE_INFO.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 sm:p-5 rounded-sm bg-background-darker/90 hover:bg-[#1a1715] border border-white/15 hover:border-coffee-400/60 text-cream-100 transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <InstagramIcon className="w-6 h-6 text-pink-400" />
                <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest block text-muted">
                  @duplexloungecafe
                </span>
                <strong className="font-serif text-sm sm:text-base font-semibold uppercase tracking-wide block text-cream-100">
                  Instagram
                </strong>
              </div>
            </a>

            {/* Action 4: Get Directions */}
            <button
              type="button"
              onClick={() => onNavigate("location")}
              className="group p-4 sm:p-5 rounded-sm bg-background-darker/90 hover:bg-[#1a1715] border border-white/15 hover:border-coffee-400/60 text-cream-100 transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <MapPin className="w-6 h-6 text-emerald-400" />
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest block text-muted">
                  Tisgao Naka, Kalyan
                </span>
                <strong className="font-serif text-sm sm:text-base font-semibold uppercase tracking-wide block text-cream-100">
                  Get Directions
                </strong>
              </div>
            </button>

          </div>

        </div>
      </section>

      {/* 2. MAIN INTERIOR & ATTRACTIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-coffee-400">
            Aesthetic Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-cream-100 uppercase tracking-wide">
            Interior Main Attractions
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Explore the signature zones crafted for chill hangouts, romantic dates, study sessions & private celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Attraction 1: Upper Mezzanine Lounge */}
          <div className="group bg-[#141211] border border-white/10 hover:border-coffee-400/50 rounded-sm overflow-hidden transition-all duration-300 shadow-xl flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/assets/duplex-mezzanine-stairs.jpg"
                alt="Mezzanine Lounge & Spiral Staircase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 text-coffee-300 text-xs font-bold uppercase tracking-wider border border-coffee-400/40">
                Level 2 (Upstairs)
              </span>
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-coffee-500 text-background-darker text-[10px] font-bold uppercase tracking-wider">
                Netflix Screening
              </span>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-serif text-2xl text-cream-100 group-hover:text-coffee-300 transition-colors">
                  Upper Mezzanine Lounge & Spiral Stairs
                </h3>
                <p className="text-xs sm:text-sm text-muted-light mt-2 leading-relaxed font-light">
                  Ascend our fairy-lit spiral staircase to a cozy upstairs lounge. Complete with plush sofa seating, warm lighting, and a private Netflix movie screening setup for birthday parties and group gatherings.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-coffee-400 font-semibold">
                  Capacity: 2 to 12 Guests
                </span>
                <button
                  type="button"
                  onClick={() => onOpenBooking("mezzanine-lounge")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cream-100 hover:text-coffee-300 transition-colors"
                >
                  <span>Book Mezzanine</span>
                  <ChevronRight className="w-4 h-4 text-coffee-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Attraction 2: Good Food Good Mood Neon Booth */}
          <div className="group bg-[#141211] border border-white/10 hover:border-coffee-400/50 rounded-sm overflow-hidden transition-all duration-300 shadow-xl flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/assets/duplex-neon-booth.jpg"
                alt="Good Food Good Mood Neon Booth"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 text-coffee-300 text-xs font-bold uppercase tracking-wider border border-coffee-400/40">
                Ground Floor
              </span>
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-background-darker text-[10px] font-bold uppercase tracking-wider">
                Photo Spot
              </span>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-serif text-2xl text-cream-100 group-hover:text-coffee-300 transition-colors">
                  Signature Neon Booth & Acoustic Art Wall
                </h3>
                <p className="text-xs sm:text-sm text-muted-light mt-2 leading-relaxed font-light">
                  Our iconic amber-glow "Good Food Good Mood" neon sign with geometric acoustic art backdrops. The perfect intimate date setting and Instagram photo-op in Kalyan.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-coffee-400 font-semibold">
                  Capacity: 2 to 6 Guests
                </span>
                <button
                  type="button"
                  onClick={() => onOpenBooking("neon-booth")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cream-100 hover:text-coffee-300 transition-colors"
                >
                  <span>Book Neon Booth</span>
                  <ChevronRight className="w-4 h-4 text-coffee-400" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Explore All Seating Button */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate("book")}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-white/10 hover:bg-white/15 border border-white/15 text-cream-100 text-xs uppercase tracking-widest font-bold transition-all shadow-md"
          >
            <Layers className="w-4 h-4 text-coffee-400" />
            <span>View Full Live Seating Floor Plan & Availability</span>
          </button>
        </div>
      </section>

      {/* 3. SIGNATURE PICKS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coffee-400">
              Freshly Prepared
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-cream-100 uppercase tracking-wide mt-1">
              Signature Dishes & Drinks
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("menu")}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-coffee-300 hover:text-coffee-200 transition-colors"
          >
            <span>View All 80+ Menu Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SIGNATURE_PICKS.slice(0, 4).map((dish) => (
            <div
              key={dish.id}
              className="bg-[#141211] border border-white/10 rounded-sm p-4 flex flex-col justify-between space-y-3 hover:border-coffee-400/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-xs bg-coffee-500/20 text-coffee-300 text-[10px] font-bold uppercase">
                  {dish.tag || "Signature"}
                </span>
                <span className="font-serif text-sm font-bold text-coffee-300">
                  {dish.pricingDisplay || `₹${dish.price || 149}`}
                </span>
              </div>
              <div>
                <h4 className="font-serif text-base text-cream-100 font-semibold">{dish.name}</h4>
                <p className="text-xs text-muted mt-1 line-clamp-2">{dish.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("menu")}
                className="w-full py-2 bg-white/5 hover:bg-coffee-400 hover:text-background-darker text-cream-200 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
              >
                View in Menu
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INSTAGRAM HUB & LIVE COMMUNITY CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-br from-[#1c1410] via-[#141211] to-[#0E0D0C] border border-coffee-400/30 rounded-sm shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-widest">
              <InstagramIcon className="w-4 h-4" />
              <span>Join 5,000+ Coffee & Vibe Lovers</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-cream-100 uppercase">
              Tag Us On Instagram <span className="text-coffee-300">@duplexloungecafe</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-light font-light leading-relaxed">
              Share your neon booth portraits, pizza moments & mezzanine movie nights with the hashtag <strong>#DuplexMoments</strong> to get featured on our official channel!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href={CAFE_INFO.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-widest rounded-sm text-center transition-all shadow-lg inline-flex items-center justify-center gap-2"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow On Instagram</span>
            </a>

            <button
              type="button"
              onClick={() => onNavigate("gallery")}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-cream-100 font-bold text-xs uppercase tracking-widest rounded-sm text-center transition-colors inline-flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-coffee-400" />
              <span>View Gallery</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. LOCATION QUICK BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-[#141211] border border-white/10 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-cream-100 uppercase">
                Find Duplex Lounge Cafe in Kalyan
              </h4>
              <p className="text-xs text-muted mt-0.5">
                Shop No. 2, Sai Suman Building, Next to Tisai Gate, Tisgao Naka, Kalyan (W)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("location")}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
            >
              Get Live Map Directions
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
