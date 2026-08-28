import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export default function MenuCard({ item }) {
  const [imageError, setImageError] = useState(false);

  // Format price display
  const priceText = item.pricingDisplay || (item.price ? `₹${item.price}` : "");
  const hasValidImage = Boolean(item.image && !imageError);

  return (
    <div className="group bg-background-card hover:bg-background-cardHover border border-white/10 hover:border-coffee-500/40 rounded-sm p-5 transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 shadow-md">
      <div>
        {/* Optional Image with Error Fallback (ONLY if genuine validated photo is available) */}
        {hasValidImage && (
          <div className="relative mb-4 rounded-sm overflow-hidden aspect-[16/10] bg-neutral-900">
            <img
              src={item.image}
              alt={`${item.name} at Duplex Lounge Cafe`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-card/80 via-transparent to-transparent" />
            
            {/* Dietary Indicator on image */}
            <div className="absolute top-2.5 right-2.5">
              <div
                className={`w-5 h-5 rounded-sm bg-background-darker/90 backdrop-blur-sm border flex items-center justify-center p-0.5 ${
                  item.isVeg ? "border-emerald-500" : "border-red-500"
                }`}
                title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.isVeg ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>

            {item.popular && (
              <div className="absolute bottom-2.5 left-2.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-coffee-500 text-background-darker text-[10px] font-bold tracking-wider uppercase font-sans">
                  <Sparkles className="w-2.5 h-2.5" />
                  Popular
                </span>
              </div>
            )}
          </div>
        )}

        {/* Top Badges for Text-Only Card */}
        {!hasValidImage && (
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Dietary Indicator Box */}
              <div
                className={`w-4 h-4 rounded-sm bg-background-darker border flex items-center justify-center p-0.5 ${
                  item.isVeg ? "border-emerald-500" : "border-red-500"
                }`}
                title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.isVeg ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </div>

              {/* Popular Badge */}
              {item.popular && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-coffee-500/15 border border-coffee-500/30 text-coffee-300 text-[10px] font-semibold tracking-wider uppercase font-sans">
                  <Sparkles className="w-2.5 h-2.5 text-coffee-400" />
                  Popular
                </span>
              )}
            </div>

            <span className="text-[10px] uppercase tracking-wider text-muted-dark font-sans capitalize">
              {item.category.replace(/-/g, " ")}
            </span>
          </div>
        )}

        {/* Title & Price Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
          <h4 className="font-serif text-lg text-cream-100 group-hover:text-coffee-300 transition-colors leading-snug">
            {item.name}
          </h4>
          <span className="text-xs sm:text-sm font-semibold text-coffee-400 font-sans tracking-wide">
            {priceText}
          </span>
        </div>

        {/* Description */}
        <p className="text-muted text-xs sm:text-sm font-sans font-light leading-relaxed mb-4">
          {item.description}
        </p>
      </div>

      {/* Footer Meta Row */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-dark font-sans">
        <span className="text-muted/60">
          All taxes included
        </span>
        <span className="text-coffee-400/80 group-hover:text-coffee-300 font-medium">
          Fresh to Order
        </span>
      </div>
    </div>
  );
}
