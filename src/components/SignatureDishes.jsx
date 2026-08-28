import React, { useState } from "react";
import { Sparkles, ArrowRight, Flame } from "lucide-react";
import { SIGNATURE_PICKS } from "../data/menuData";

export default function SignatureDishes({ onSelectCategory }) {
  return (
    <section id="signature" className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coffee-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-coffee-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Flame className="w-4 h-4 text-coffee-400" />
            <span>Duplex Picks</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-100 uppercase tracking-tight mb-4">
            Curated House Favourites
          </h2>
          <p className="text-muted text-sm sm:text-base font-light font-sans">
            Handpicked signature dishes and beverages loved by our regulars in Kalyan. All prices inclusive of taxes.
          </p>
        </div>

        {/* Signature Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SIGNATURE_PICKS.map((dish) => (
            <SignatureCard
              key={dish.id}
              dish={dish}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>

        {/* View Full Menu Callout Banner */}
        <div className="mt-14 text-center">
          <a
            href="#menu"
            className="inline-flex items-center gap-3 bg-white/5 hover:bg-coffee-500/20 border border-white/15 hover:border-coffee-400 text-cream-100 text-xs uppercase tracking-widest px-8 py-4 rounded-sm transition-all duration-300 font-medium"
          >
            <span>Explore Complete Menu & All 19 Categories</span>
            <ArrowRight className="w-4 h-4 text-coffee-400" />
          </a>
        </div>

      </div>
    </section>
  );
}

function SignatureCard({ dish, onSelectCategory }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(dish.image && !imgError);

  return (
    <div className="group relative bg-background-card hover:bg-background-cardHover border border-white/10 hover:border-coffee-500/40 rounded-sm overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-coffee-950/40 hover:-translate-y-1">
      <div>
        {/* Genuine Dish Image if available */}
        {hasImage && (
          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900 border-b border-white/5">
            <img
              src={dish.image}
              alt={`${dish.name} at Duplex Lounge Cafe`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent" />
            
            {/* Top Overlay Badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-background-darker/90 backdrop-blur-md border border-white/15 text-coffee-300 text-[10px] font-medium tracking-wider uppercase font-sans">
                <Sparkles className="w-2.5 h-2.5 text-coffee-400" />
                {dish.tag}
              </span>
            </div>

            {/* Dietary Symbol on Image */}
            <div className="absolute top-3 right-3">
              <div
                className={`w-5 h-5 rounded-sm bg-background-darker/90 border flex items-center justify-center p-0.5 ${
                  dish.isVeg ? "border-emerald-500" : "border-red-500"
                }`}
                title={dish.isVeg ? "Vegetarian" : "Non-Vegetarian"}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    dish.isVeg ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-7">
          {/* Top Badges for Text-Only Version */}
          {!hasImage && (
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-coffee-500/15 border border-coffee-500/30 text-coffee-300 text-[11px] font-medium tracking-wider uppercase font-sans">
                <Sparkles className="w-3 h-3 text-coffee-400" />
                {dish.tag}
              </span>

              {/* Dietary Symbol */}
              <div
                className={`w-5 h-5 rounded-sm bg-background-darker border flex items-center justify-center p-0.5 ${
                  dish.isVeg ? "border-emerald-500" : "border-red-500"
                }`}
                title={dish.isVeg ? "Vegetarian" : "Non-Vegetarian"}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    dish.isVeg ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Dish Title */}
          <h3 className="font-serif text-2xl text-cream-100 group-hover:text-coffee-300 transition-colors mb-2">
            {dish.name}
          </h3>

          {/* Price Display */}
          <div className="mb-3">
            <span className="text-sm font-semibold text-coffee-400 font-sans tracking-wide">
              {dish.pricingDisplay}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted text-sm font-sans font-light leading-relaxed">
            {dish.description}
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-muted-dark font-sans capitalize">
          {dish.category.replace(/-/g, " ")}
        </span>

        <button
          onClick={() => onSelectCategory && onSelectCategory(dish.category)}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-coffee-400 group-hover:text-coffee-300 font-medium font-sans hover:underline"
        >
          <span>Explore items</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
