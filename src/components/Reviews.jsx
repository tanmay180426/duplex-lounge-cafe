import React from "react";
import { Star, CheckCircle, Quote, ExternalLink } from "lucide-react";
import { REVIEWS_DATA } from "../data/reviewsData";
import { CAFE_INFO } from "../data/cafeInfo";

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-background-darker relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Google Rating Summary */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-coffee-400 text-xs font-semibold uppercase tracking-[0.25em] block mb-3">
              Community Love
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-100 uppercase tracking-tight">
              What People Say
            </h2>
          </div>

          {/* Rating Badge Card */}
          <div className="flex flex-wrap items-center gap-6 p-5 bg-background-card rounded-sm border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="font-serif text-4xl text-cream-100 font-bold">
                {REVIEWS_DATA.stats.averageRating.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-muted font-sans font-light mt-0.5">
                  Based on {REVIEWS_DATA.stats.totalReviews}+ Google Reviews
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <a
              href={CAFE_INFO.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-coffee-400 hover:text-coffee-300 font-medium font-sans"
            >
              <span>Write a Review</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.reviews.map((rev) => (
            <div
              key={rev.id}
              className="group bg-background-card hover:bg-background-cardHover border border-white/10 hover:border-coffee-500/40 rounded-sm p-6 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-md"
            >
              <div>
                {/* Header: Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-coffee-500/30 group-hover:text-coffee-400/50 transition-colors" />
                </div>

                {/* Comment */}
                <p className="text-cream-300/90 text-sm font-sans font-light leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Badge */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base text-cream-100">
                    {rev.author}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-coffee-400/90 font-sans mt-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>{rev.badge}</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-dark font-sans">
                  {rev.relativeTime}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
