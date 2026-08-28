import React from "react";
import { Coffee, Pizza, Flame, Sparkles, ArrowUpRight } from "lucide-react";

export default function WhyDuplex() {
  const cards = [
    {
      icon: Coffee,
      badge: "Handcrafted",
      title: "Café & Coffee",
      description: "Artisanal espresso, Spanish iced lattes, rich mochas, and refreshing cold brews crafted with premium coffee beans.",
      categoryLink: "coffee"
    },
    {
      icon: Pizza,
      badge: "Freshly Baked",
      title: "Comfort Food",
      description: "Stone-baked thin crust pizzas, creamy Alfredo & Arrabbiata pastas, cheesy garlic bread, and loaded tortilla wraps.",
      categoryLink: "pizza"
    },
    {
      icon: Flame,
      badge: "Signature Picks",
      title: "Crowd Favourites",
      description: "Authentic steamed and crispy fried momos, chef's sharing combos, and thick indulgent Lotus Biscoff milkshakes.",
      categoryLink: "momos"
    },
    {
      icon: Sparkles,
      badge: "Ambience",
      title: "Lounge Vibes",
      description: "A cozy retreat in Kalyan with warm ambient illumination, comfortable seating, and the perfect relaxed background music.",
      categoryLink: "all"
    }
  ];

  return (
    <section id="why-duplex" className="py-20 sm:py-28 bg-background-darker border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16">
          <div>
            <span className="text-coffee-400 text-xs font-semibold uppercase tracking-[0.25em] block mb-3">
              Crafted For You
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-100 uppercase tracking-tight">
              Why Duplex?
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-muted max-w-md text-sm sm:text-base font-light font-sans">
            Every detail at Duplex—from the temperature of your latte to our cozy booth seating—is curated for your comfort.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative bg-background-card hover:bg-background-cardHover border border-white/10 hover:border-coffee-500/40 rounded-sm p-7 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-coffee-950/40"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-sm bg-coffee-500/10 border border-coffee-500/20 flex items-center justify-center text-coffee-400 group-hover:bg-coffee-400 group-hover:text-background-darker transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted group-hover:text-coffee-300 font-sans border border-white/10 px-2 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  {/* Card Title & Desc */}
                  <h3 className="font-serif text-xl sm:text-2xl text-cream-100 mb-3 group-hover:text-coffee-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-muted text-sm font-sans font-light leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Explore Link */}
                <a
                  href="#menu"
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-coffee-400 group-hover:text-coffee-300 font-medium pt-4 border-t border-white/5"
                >
                  <span>Explore items</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
