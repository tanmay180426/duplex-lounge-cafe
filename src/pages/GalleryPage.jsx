import React, { useState, useEffect, useMemo } from "react";
import { Camera, Sparkles, Filter, X, ZoomIn } from "lucide-react";
import { GALLERY_ITEMS } from "../data/galleryData";
import { subscribeToGalleryImages } from "../services/imageService";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [dynamicImages, setDynamicImages] = useState([]);

  useEffect(() => {
    const unsub = subscribeToGalleryImages((imgs) => setDynamicImages(imgs));
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const allImages = useMemo(() => {
    return [
      ...dynamicImages,
      ...GALLERY_ITEMS.map((item) => ({
        ...item,
        src: item.image || item.src
      }))
    ];
  }, [dynamicImages]);

  const filteredImages = useMemo(() => {
    if (activeCategory === "all") return allImages;
    return allImages.filter((img) => img.category === activeCategory);
  }, [allImages, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-coffee-400">
          Visual Atmosphere
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-cream-100 uppercase tracking-wide">
          Cafe Ambience & Gallery
        </h1>
        <p className="text-xs sm:text-sm text-muted-light font-light leading-relaxed">
          Take a look inside Kalyan's most aesthetic duplex lounge, fairy-lit mezzanine stairs, neon photo booths & delicious plates.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto text-xs">
        {[
          { id: "all", label: "All Photos" },
          { id: "ambience", label: "Lounge Ambience" },
          { id: "mezzanine", label: "Mezzanine & Stairs" },
          { id: "neon", label: "Neon Booths" },
          { id: "food", label: "Pizzas & Food" },
          { id: "drinks", label: "Coffee & Drinks" }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-sm uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? "bg-coffee-400 text-background-darker font-bold shadow-md"
                : "bg-[#141211] text-muted hover:text-cream-100 border border-white/5"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Images Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            onClick={() => setActiveLightboxImg(img)}
            className="group relative aspect-square bg-[#141211] border border-white/10 hover:border-coffee-400/60 rounded-sm overflow-hidden cursor-pointer transition-all shadow-md"
          >
            <img
              src={img.src}
              alt={img.title || "Duplex Cafe"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <span className="text-[10px] text-coffee-400 uppercase font-bold tracking-wider">
                {img.category}
              </span>
              <h4 className="text-xs font-serif font-bold text-cream-100 truncate">
                {img.title}
              </h4>
              {img.caption && (
                <p className="text-[11px] text-muted-light line-clamp-1 mt-0.5 font-light">
                  {img.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImg && (
        <div
          onClick={() => setActiveLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#141211] border border-white/15 rounded-sm overflow-hidden shadow-2xl space-y-3 p-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-serif text-lg text-cream-100">{activeLightboxImg.title}</h3>
              <button
                onClick={() => setActiveLightboxImg(null)}
                className="p-1 text-muted hover:text-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video max-h-[70vh] overflow-hidden rounded-sm bg-black">
              <img
                src={activeLightboxImg.src}
                alt={activeLightboxImg.title}
                className="w-full h-full object-contain"
              />
            </div>

            {activeLightboxImg.caption && (
              <p className="text-xs text-muted font-light">{activeLightboxImg.caption}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
