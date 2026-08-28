import React from "react";
import { Sparkles, Heart, Coffee, Users, Star, Quote, Award } from "lucide-react";
import { REVIEWS_DATA } from "../data/reviewsData";

export default function StoryPage({ onNavigate, onOpenBooking }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-16 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-coffee-400">
          Our Heritage & Vibe
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-cream-100 uppercase tracking-wide">
          The Duplex Experience
        </h1>
        <p className="text-xs sm:text-sm text-muted-light font-light leading-relaxed">
          How we brought a cozy, two-story community lounge to Tisgao Naka, Kalyan.
        </p>
      </div>

      {/* Origin Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-muted-light font-light leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream-100 uppercase font-normal">
            More Than Just A Cafe — A Second Home
          </h2>
          <p>
            Duplex Lounge Cafe was founded with a single distinct vision: to break away from sterile, cookie-cutter coffee chains and give the vibrant youth, students, and families of Kalyan a truly soulful space.
          </p>
          <p>
            By designing a unique architectural mezzanine structure connected by a spiral fairy-lit staircase, we created distinct experiential zones under one roof — from private Netflix movie watch parties upstairs to energetic acoustic photo booths downstairs.
          </p>
          <div className="pt-2 flex items-center gap-4 text-coffee-300 font-serif font-semibold text-sm">
            <span>☕ Handcrafted Coffee</span>
            <span>•</span>
            <span>🎬 Private Screenings</span>
            <span>•</span>
            <span>✨ 100% Good Vibes</span>
          </div>
        </div>

        <div className="relative aspect-video rounded-sm overflow-hidden border border-white/10 shadow-2xl">
          <img
            src="/assets/duplex-mezzanine-stairs.jpg"
            alt="Duplex Cafe Mezzanine"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Customer Reviews & Love */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-coffee-400">
            Real Customer Love
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-cream-100 uppercase mt-1">
            What Our Guests Say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS_DATA.reviews.slice(0, 6).map((r) => (
            <div
              key={r.id}
              className="bg-[#141211] border border-white/10 p-6 rounded-sm space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-cream-200 font-light italic leading-relaxed">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <strong className="text-coffee-300">{r.author}</strong>
                <span className="text-[10px] text-muted uppercase">{r.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
