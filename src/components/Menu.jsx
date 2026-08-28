import React, { useState, useMemo } from "react";
import { Search, X, Utensils, Info, Check, Sparkles } from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS } from "../data/menuData";
import { CAFE_INFO } from "../data/cafeInfo";
import MenuCard from "./MenuCard";

export default function Menu({ selectedCategory = "all", onCategoryChange }) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  // Sync external category state if updated from elsewhere
  React.useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    if (onCategoryChange) {
      onCategoryChange(catId);
    }
  };

  // Filter items based on activeCategory, searchQuery, and vegOnly
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !vegOnly || item.isVeg === true;

      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [activeCategory, searchQuery, vegOnly]);

  return (
    <section id="menu" className="py-20 sm:py-28 bg-background-darker relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-coffee-400 text-xs font-semibold uppercase tracking-[0.25em] block mb-3">
            Handcrafted Menu
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-100 uppercase tracking-tight mb-4">
            Explore The Menu
          </h2>
          <p className="text-muted text-sm sm:text-base font-light font-sans mb-6">
            From steaming momos and stone-baked pizzas to smashed burgers, pastas, Spanish iced lattes, and thick shakes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-coffee-500/20 border border-white/15 text-xs text-cream-200 uppercase tracking-wider font-sans font-medium transition-colors"
            >
              <span>📄 View Official Printed Menu Cards</span>
            </a>
          </div>
        </div>

        {/* Search & Dietary Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-background-card p-4 rounded-sm border border-white/10 shadow-lg">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search momos, pizza, burger, pasta, cortado, shake..."
              className="w-full bg-background-elevated border border-white/10 focus:border-coffee-400 text-cream-100 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-sm focus:outline-none placeholder:text-muted/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream-100"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Pure Veg Filter Toggle & Item Count */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium border transition-all duration-200 ${
                vegOnly
                  ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400"
                  : "bg-background-elevated border-white/10 text-muted hover:text-cream-200"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                  vegOnly ? "border-emerald-400 bg-emerald-400" : "border-emerald-500"
                }`}
              >
                {vegOnly ? (
                  <Check className="w-2.5 h-2.5 text-background-darker stroke-[3]" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <span>Pure Veg Only</span>
            </button>

            <span className="text-xs text-muted font-sans font-light">
              Showing <strong className="text-cream-200 font-semibold">{filteredItems.length}</strong> items
            </span>
          </div>
        </div>

        {/* Category Pills (Scrollable horizontally on mobile) */}
        <div className="relative mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none snap-x">
            {MENU_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 border ${
                    isActive
                      ? "bg-coffee-400 text-background-darker border-coffee-400 shadow-md shadow-coffee-950/40"
                      : "bg-background-card hover:bg-background-elevated text-cream-300/80 hover:text-cream-100 border-white/10"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-background-card border border-white/5 rounded-sm">
            <Utensils className="w-10 h-10 text-muted mx-auto mb-3 opacity-40" />
            <h4 className="font-serif text-xl text-cream-200 mb-2">
              No matching items found
            </h4>
            <p className="text-muted text-xs max-w-sm mx-auto font-sans mb-4">
              We couldn't find anything matching "{searchQuery}". Try selecting another category or resetting the search.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setVegOnly(false);
              }}
              className="text-xs uppercase tracking-widest text-coffee-400 hover:underline font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Accurate Tax Inclusion Note */}
        <div className="mt-12 p-4 rounded-sm bg-coffee-500/10 border border-coffee-500/20 flex items-start gap-3 text-xs text-cream-200 font-sans font-light">
          <Info className="w-4 h-4 text-coffee-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-coffee-300">Note:</strong> {CAFE_INFO.taxNote}. Freshly prepared to order. Please inform our staff of any food allergies prior to ordering.
          </p>
        </div>

      </div>
    </section>
  );
}
