import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Calendar,
  Lock
} from "lucide-react";
import { InstagramIcon } from "./Icons";
import { CAFE_INFO } from "../data/cafeInfo";
import { getCafeStatus } from "../utils/hoursHelper";

export default function Navbar({
  currentPage = "home",
  onNavigate,
  onOpenBooking,
  onOpenAdmin
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState(getCafeStatus());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const timer = setInterval(() => {
      setStatus(getCafeStatus());
    }, 60000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const navPages = [
    { id: "home", label: "Home" },
    { id: "menu", label: "Menu" },
    { id: "book", label: "Live Seating & Book" },
    { id: "gallery", label: "Gallery" },
    { id: "story", label: "Story & Reviews" },
    { id: "location", label: "Location & Hours" }
  ];

  const handlePageClick = (pageId) => {
    if (onNavigate) onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#0E0D0C]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-xl shadow-black/40"
            : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handlePageClick("home")}
            className="group flex items-center gap-3 text-cream-200 focus:outline-none text-left"
          >
            <div className="w-10 h-10 rounded-full border border-coffee-400/80 bg-background-darker flex items-center justify-center relative shadow-md group-hover:border-coffee-300 transition-colors">
              <div className="text-center">
                <span className="text-[11px] font-serif font-bold text-coffee-300 tracking-tighter leading-none block">
                  DLC
                </span>
                <span className="text-[6px] tracking-widest text-muted uppercase block -mt-0.5">
                  CAFE
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.2em] font-normal uppercase text-cream-100 group-hover:text-coffee-300 transition-colors">
                DU<span className="text-coffee-400">P</span>LEX
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-muted uppercase font-sans -mt-1 font-medium">
                Lounge Cafe • Kalyan
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navPages.map((page) => {
              const isActive = currentPage === page.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => handlePageClick(page.id)}
                  className={`text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-sm transition-all ${
                    isActive
                      ? "bg-coffee-500/20 text-coffee-300 border border-coffee-400/40 shadow-sm"
                      : "text-cream-300/80 hover:text-cream-100 hover:bg-white/5"
                  }`}
                >
                  {page.label}
                </button>
              );
            })}

            <a
              href={CAFE_INFO.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow @duplexloungecafe on Instagram"
              className="p-2 text-muted hover:text-pink-400 transition-colors ml-1"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                status.isOpen
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                  : "bg-neutral-900 border-neutral-700 text-neutral-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status.isOpen ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
                }`}
              />
              <span className="tracking-wider uppercase text-[9px] font-bold">
                {status.isOpen ? "Open Now" : "Closed"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onOpenBooking(null)}
              className="px-4 py-2 rounded-sm bg-coffee-400 hover:bg-coffee-500 text-background-darker text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-coffee-950/40 inline-flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              title="Admin Portal"
              aria-label="Admin Portal"
              className="p-2 rounded-sm text-muted hover:text-coffee-300 hover:bg-white/5 transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => onOpenBooking(null)}
              className="px-3 py-1.5 rounded-sm bg-coffee-400 text-background-darker text-xs font-bold uppercase tracking-wider"
            >
              Book
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm text-cream-200 hover:text-coffee-400 hover:bg-white/5 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl text-cream-100 uppercase">
                DU<span className="text-coffee-400">P</span>LEX
              </span>
              <span className="text-[10px] text-muted uppercase">Lounge Cafe</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-muted hover:text-cream-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2 py-6 flex-1 overflow-y-auto">
            {navPages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => handlePageClick(page.id)}
                className={`w-full text-left px-4 py-3 rounded-sm text-sm uppercase tracking-wider font-semibold transition-colors flex items-center justify-between ${
                  currentPage === page.id
                    ? "bg-coffee-400 text-background-darker font-bold"
                    : "text-cream-200 hover:bg-white/5"
                }`}
              >
                <span>{page.label}</span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </button>
            ))}

            <a
              href={CAFE_INFO.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-4 py-3 rounded-sm text-sm uppercase tracking-wider font-semibold text-pink-400 hover:bg-white/5 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram @duplexloungecafe</span>
              </span>
              <ArrowRight className="w-4 h-4 opacity-60" />
            </a>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 bg-neutral-900 border border-white/15 text-muted text-xs font-bold uppercase tracking-wider rounded-sm text-center"
            >
              Staff / Admin Portal
            </button>
          </div>
        </div>
      )}
    </>
  );
}