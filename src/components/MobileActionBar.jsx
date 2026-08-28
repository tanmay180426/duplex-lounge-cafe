import React from "react";
import { Navigation, Calendar, UtensilsCrossed, Home, Camera } from "lucide-react";
import { CAFE_INFO } from "../data/cafeInfo";

export default function MobileActionBar({ currentPage, onNavigate, onOpenBooking }) {
  return (
    <aside
      aria-label="Mobile quick actions"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0E0D0C]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 shadow-2xl shadow-black safe-bottom font-sans"
    >
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        
        {/* Home */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-sm transition-colors text-center ${
            currentPage === "home"
              ? "bg-coffee-500/20 text-coffee-300 border border-coffee-400/40"
              : "text-muted hover:text-cream-100"
          }`}
        >
          <Home className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-semibold tracking-wider uppercase font-sans">
            Home
          </span>
        </button>

        {/* Menu */}
        <button
          type="button"
          onClick={() => onNavigate("menu")}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-sm transition-colors text-center ${
            currentPage === "menu"
              ? "bg-coffee-500/20 text-coffee-300 border border-coffee-400/40"
              : "text-muted hover:text-cream-100"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-semibold tracking-wider uppercase font-sans">
            Menu
          </span>
        </button>

        {/* Live Seating & Book */}
        <button
          type="button"
          onClick={() => onNavigate("book")}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-sm transition-colors text-center ${
            currentPage === "book"
              ? "bg-coffee-400 text-background-darker font-bold shadow-md"
              : "bg-coffee-400/90 text-background-darker font-semibold"
          }`}
        >
          <Calendar className="w-4 h-4 mb-1 stroke-[2.5]" />
          <span className="text-[10px] font-bold tracking-wider uppercase font-sans">
            Live Book
          </span>
        </button>

        {/* Location & Directions */}
        <button
          type="button"
          onClick={() => onNavigate("location")}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-sm transition-colors text-center ${
            currentPage === "location"
              ? "bg-coffee-500/20 text-coffee-300 border border-coffee-400/40"
              : "text-muted hover:text-cream-100"
          }`}
        >
          <Navigation className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-semibold tracking-wider uppercase font-sans">
            Visit
          </span>
        </button>

      </div>
    </aside>
  );
}
