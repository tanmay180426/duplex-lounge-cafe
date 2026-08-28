import React from "react";
import { MapPin, Phone, Mail, Navigation, ExternalLink, Store } from "lucide-react";
import { CAFE_INFO } from "../data/cafeInfo";
import OpeningHours from "./OpeningHours";

export default function Location() {
  return (
    <section id="visit" className="py-20 sm:py-28 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-coffee-400 text-xs font-semibold uppercase tracking-[0.25em] block mb-3">
            Find Your Way
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-100 uppercase tracking-tight mb-4">
            Visit Duplex Lounge
          </h2>
          <p className="text-muted text-sm sm:text-base font-light font-sans">
            Conveniently located at Tisgao Naka in Kalyan, right next to Tisai Gate.
          </p>
        </div>

        {/* Storefront Image + Address Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Real Storefront Photo + Address Card */}
          <div className="lg:col-span-6 bg-background-card border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between shadow-xl">
            
            {/* Storefront Real Photo Header */}
            <div className="relative h-56 sm:h-64 overflow-hidden bg-neutral-900">
              <img
                src="/assets/duplex-storefront.jpg"
                alt="Duplex Lounge Cafe Storefront & Signboard"
                className="w-full h-full object-cover object-top filter brightness-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-background-darker/90 backdrop-blur-md border border-white/15 text-coffee-300 text-[11px] font-medium tracking-wider uppercase font-sans">
                  <Store className="w-3.5 h-3.5 text-coffee-400" />
                  Official Storefront
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-coffee-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Physical Address</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-cream-100 mb-3">
                  Duplex Lounge Cafe
                </h3>

                <div className="space-y-1 text-cream-300/90 text-sm sm:text-base font-sans font-light mb-6">
                  <p className="font-medium text-cream-100">{CAFE_INFO.address.shop}</p>
                  <p>{CAFE_INFO.address.landmark}</p>
                  <p>{CAFE_INFO.address.area}</p>
                  <p className="text-coffee-300 font-medium">{CAFE_INFO.address.city}, {CAFE_INFO.address.state} — {CAFE_INFO.address.pincode}</p>
                </div>

                {/* Direct Verified Channels */}
                <div className="space-y-2.5 pt-4 border-t border-white/10 font-sans">
                  {CAFE_INFO.contact.phone && (
                    <a
                      href={`tel:${CAFE_INFO.contact.phone}`}
                      className="flex items-center gap-3 text-sm text-cream-200 hover:text-coffee-400 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-coffee-400 group-hover:bg-coffee-400 group-hover:text-background-darker transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span>{CAFE_INFO.contact.phoneDisplay}</span>
                    </a>
                  )}

                  {CAFE_INFO.contact.email && (
                    <a
                      href={`mailto:${CAFE_INFO.contact.email}`}
                      className="flex items-center gap-3 text-sm text-cream-200 hover:text-coffee-400 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-coffee-400 group-hover:bg-coffee-400 group-hover:text-background-darker transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span>{CAFE_INFO.contact.email}</span>
                    </a>
                  )}

                  {CAFE_INFO.contact.instagram && (
                    <a
                      href={CAFE_INFO.contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-cream-200 hover:text-coffee-400 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-coffee-400 group-hover:bg-coffee-400 group-hover:text-background-darker transition-colors">
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </div>
                      <span>{CAFE_INFO.contact.instagramHandle}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10">
                <a
                  href={CAFE_INFO.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-sm transition-all duration-200 shadow-md font-sans"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={CAFE_INFO.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-background-elevated hover:bg-white/10 text-cream-200 border border-white/15 hover:border-coffee-400 font-medium text-xs uppercase tracking-widest py-3.5 px-4 rounded-sm transition-all duration-200 font-sans"
                >
                  <svg
                    className="w-4 h-4 text-coffee-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Opening Hours Component */}
          <div className="lg:col-span-6">
            <OpeningHours />
          </div>

        </div>

        {/* Embedded Google Map */}
        <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 aspect-[16/9] sm:aspect-[21/9] min-h-[320px]">
          <iframe
            title="Duplex Lounge Cafe Location Map"
            src={CAFE_INFO.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
          <div className="absolute top-4 right-4 z-10">
            <a
              href={CAFE_INFO.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-background-darker/90 backdrop-blur-md border border-white/20 hover:border-coffee-400 text-cream-100 text-xs font-medium px-4 py-2 rounded-sm shadow-xl transition-colors font-sans"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-coffee-400" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
