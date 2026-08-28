import React from "react";
import { MapPin, ArrowUp, Lock, Calendar, Phone, Mail } from "lucide-react";
import { InstagramIcon } from "./Icons";
import { CAFE_INFO } from "../data/cafeInfo";
import { OWNER_CONFIG } from "../config/ownerConfig";

export default function Footer({ onNavigate, onOpenAdmin, onOpenBooking }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
      scrollToTop();
    }
  };

  return (
    <footer className="bg-[#0A0908] border-t border-white/10 pt-16 pb-28 md:pb-16 text-cream-300 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <button
                type="button"
                onClick={() => handleLinkClick("home")}
                className="inline-block mb-4 text-left"
              >
                <span className="font-serif text-3xl tracking-[0.2em] uppercase text-cream-100 block">
                  DU<span className="text-coffee-400">P</span>LEX
                </span>
                <span className="text-[10px] tracking-[0.3em] text-muted uppercase font-sans font-medium">
                  Lounge Cafe • Kalyan (West)
                </span>
              </button>
              
              <p className="text-muted text-sm font-sans font-light leading-relaxed max-w-sm mb-6">
                Kalyan's premier double-story lounge cafe featuring fairy-lit mezzanine seating, private Netflix movie screenings, ambient neon booths, and delicious pizzas & coffee.
              </p>

              {onOpenBooking && (
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 bg-coffee-500/20 hover:bg-coffee-500/30 border border-coffee-500/40 text-coffee-300 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors font-sans"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve Table</span>
                </button>
              )}
            </div>

            {/* Social & Maps Icons */}
            <div className="flex items-center gap-3">
              <a
                href={CAFE_INFO.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 hover:border-pink-500 flex items-center justify-center text-cream-200 hover:text-pink-400 transition-colors"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={CAFE_INFO.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 hover:border-emerald-500 flex items-center justify-center text-cream-200 hover:text-emerald-400 transition-colors"
                aria-label="Google Maps Location"
              >
                <MapPin className="w-4 h-4" />
              </a>
              <a
                href={`tel:${OWNER_CONFIG.callingPhone}`}
                className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 hover:border-coffee-400 flex items-center justify-center text-cream-200 hover:text-coffee-400 transition-colors"
                aria-label="Call Cafe"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Multi-Page Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-base text-cream-100 uppercase tracking-wider mb-5">
              Pages & Exploration
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-widest font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick("home")}
                  className="text-muted hover:text-coffee-400 transition-colors"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick("menu")}
                  className="text-muted hover:text-coffee-400 transition-colors"
                >
                  Food & Drinks Menu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick("book")}
                  className="text-coffee-400 hover:text-coffee-300 font-bold transition-colors"
                >
                  Live Seating & Book
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick("gallery")}
                  className="text-muted hover:text-coffee-400 transition-colors"
                >
                  Ambience Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick("story")}
                  className="text-muted hover:text-coffee-400 transition-colors"
                >
                  Story & Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick("location")}
                  className="text-muted hover:text-coffee-400 transition-colors"
                >
                  Location & Hours
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours Column */}
          <div className="lg:col-span-4 space-y-4 text-xs font-sans">
            <h4 className="font-serif text-base text-cream-100 uppercase tracking-wider mb-2">
              Visit & Contact
            </h4>
            
            <p className="text-muted leading-relaxed">
              Shop No. 2, Sai Suman Building, Next to Tisai Gate, Tisgao Naka, Kalyan (W), Maharashtra 421306
            </p>

            <div className="text-muted space-y-1 pt-1">
              <p>Mon – Fri: 11:00 AM – 11:00 PM</p>
              <p className="text-amber-400 font-semibold">Saturday: Open 24 Hours ✨</p>
              <p>Sunday: 11:00 AM – 11:00 PM</p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-cream-200 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Authority Portal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-sans font-light">
          <p>© {new Date().getFullYear()} Duplex Lounge Cafe. All rights reserved.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-cream-300 hover:text-coffee-400 transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
