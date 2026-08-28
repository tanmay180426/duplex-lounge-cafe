import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Calendar,
  ArrowRight,
  Plus,
  Check
} from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS } from "../data/menuData";

export default function MenuPage({ onOpenBooking }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // "default" | "price-low" | "price-high"

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchVeg = !vegOnly || item.isVeg;
      return matchCat && matchSearch && matchVeg;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, searchQuery, vegOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-coffee-400">
          Freshly Crafted Delicacies
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-cream-100 uppercase tracking-wide">
          Duplex Lounge Menu
        </h1>
        <p className="text-xs sm:text-sm text-muted-light font-light leading-relaxed">
          From artisan stone-baked pizzas and loaded burgers to momos, pastas, signature cold brews & mojitos.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#141211] border border-white/10 p-5 rounded-sm space-y-4">
        
        {/* Top Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pizzas, momos, pasta, burgers, cold brew..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-4 py-2.5 rounded-sm outline-none"
            />
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs px-3 py-2.5 rounded-sm outline-none"
            >
              <option value="default">Default Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Veg Only Toggle */}
          <div className="sm:col-span-3 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className={`w-full sm:w-auto px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border ${
                vegOnly
                  ? "bg-emerald-950/60 border-emerald-500 text-emerald-400"
                  : "bg-background-darker border-white/15 text-muted hover:text-cream-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Veg Only Filter</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-sm uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-coffee-400 text-background-darker font-bold shadow-md"
                : "bg-background-darker text-muted hover:text-cream-100 border border-white/5"
            }`}
          >
            All Items ({MENU_ITEMS.length})
          </button>

          {MENU_CATEGORIES.map((cat) => {
            const count = MENU_ITEMS.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-sm uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-coffee-400 text-background-darker font-bold shadow-md"
                    : "bg-background-darker text-muted hover:text-cream-100 border border-white/5"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center bg-[#141211] border border-white/10 rounded-sm text-muted text-xs">
          No dishes match your search criteria. Try another filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#141211] border border-white/10 hover:border-coffee-400/40 rounded-sm p-5 flex flex-col justify-between space-y-4 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        item.isVeg ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <span className="text-[10px] uppercase font-bold text-coffee-300">
                      {item.category}
                    </span>
                  </div>
                  <span className="font-serif text-lg font-bold text-cream-100">
                    ₹{item.price}
                  </span>
                </div>

                <h3 className="font-serif text-lg text-cream-100 font-semibold">{item.name}</h3>
                <p className="text-xs text-muted-light mt-1 font-light leading-relaxed">
                  {item.description}
                </p>

                {/* Variants if any */}
                {item.variants && item.variants.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.variants.map((v, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-xs bg-white/5 text-cream-300 text-[10px]"
                      >
                        {v.label}: <strong>₹{v.price}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-muted">Fresh & Hot</span>
                <button
                  type="button"
                  onClick={() => onOpenBooking(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-coffee-400 hover:bg-coffee-500 text-background-darker text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pre-Order With Table</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking CTA Banner */}
      <div className="p-8 bg-gradient-to-r from-coffee-500/20 via-[#141211] to-[#141211] border border-coffee-400/40 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-2xl text-cream-100 uppercase">
            Craving Good Food at Duplex?
          </h3>
          <p className="text-xs text-muted">
            Reserve your favorite table and have your food ready the minute you arrive!
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenBooking(null)}
          className="px-8 py-3.5 bg-coffee-400 hover:bg-coffee-500 text-background-darker font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-md inline-flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Table & Pre-Order</span>
        </button>
      </div>

    </div>
  );
}
