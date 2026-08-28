import React from "react";
import { Sparkles, Tv, Layers, Coffee } from "lucide-react";
import { CAFE_INFO } from "../data/cafeInfo";

export default function Intro() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-coffee-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Real Duplex Mezzanine & Spiral Stairs Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl shadow-black/80 aspect-[4/5] group bg-neutral-900">
                <img
                  src="/assets/duplex-mezzanine-stairs.jpg"
                  alt="Duplex Mezzanine Lounge & Spiral Stairs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                
                {/* Floating Badge Tag inside image */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-sm bg-background-card/95 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-2 text-coffee-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Two-Level Lounge Concept</span>
                  </div>
                  <p className="font-serif italic text-sm text-cream-100">
                    "Ground floor cafe vibes with an intimate upper mezzanine lounge & Netflix screening."
                  </p>
                </div>
              </div>

              {/* Decorative Accent Frame */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-coffee-400/40 pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-coffee-400/40 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 text-coffee-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Duplex Story</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-100 tracking-tight leading-tight mb-6">
              More than just a café. <br />
              <span className="text-coffee-300 font-serif italic">Kalyan's two-level sanctuary.</span>
            </h2>

            <p className="text-cream-300/80 text-base sm:text-lg font-light leading-relaxed mb-6 font-sans">
              {CAFE_INFO.story}
            </p>

            <p className="text-muted text-sm sm:text-base font-light leading-relaxed mb-10 font-sans">
              Whether you are meeting friends after college, enjoying a quiet corner with a Spanish Iced Latte, or savoring our freshly steamed momos and loaded pizzas, Duplex gives you two distinct floors of cozy ambient energy in the heart of Tisgao Naka.
            </p>

            {/* 3 Core Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-sm bg-coffee-500/10 border border-coffee-500/20 flex items-center justify-center text-coffee-400 mb-1">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base text-cream-100 font-medium">
                  Two-Level Layout
                </h3>
                <p className="text-xs text-muted font-sans font-light leading-normal">
                  Ground floor counter & fairy-lit spiral mezzanine lounge.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-sm bg-coffee-500/10 border border-coffee-500/20 flex items-center justify-center text-coffee-400 mb-1">
                  <Tv className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base text-cream-100 font-medium">
                  Netflix & Chill
                </h3>
                <p className="text-xs text-muted font-sans font-light leading-normal">
                  Mezzanine entertainment setup for relaxed movie & hangout sessions.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-sm bg-coffee-500/10 border border-coffee-500/20 flex items-center justify-center text-coffee-400 mb-1">
                  <Coffee className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base text-cream-100 font-medium">
                  Inclusive Pricing
                </h3>
                <p className="text-xs text-muted font-sans font-light leading-normal">
                  All taxes included on all momos, burgers, pizzas, and brews.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
