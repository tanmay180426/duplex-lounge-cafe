import React, { useState, useEffect } from "react";
import { Maximize2, Camera, Sparkles } from "lucide-react";
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from "../data/galleryData";
import { subscribeToGalleryImages } from "../services/imageService";
import Lightbox from "./Lightbox";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Subscribe to real-time custom uploaded images
  useEffect(() => {
    const unsubscribe = subscribeToGalleryImages((customList) => {
      setUploadedImages(customList);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Combine custom uploaded images with static curated gallery items
  const allImages = [
    ...uploadedImages.map((img) => ({
      id: img.id,
      title: img.title,
      category: img.category || "ambience",
      caption: img.caption || "Duplex Lounge Moment",
      image: img.src,
      aspect: "normal",
      isCustom: true
    })),
    ...GALLERY_ITEMS
  ];

  const filteredGallery =
    activeCategory === "all"
      ? allImages
      : allImages.filter((item) => item.category === activeCategory);

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (prevIndex) => (prevIndex - 1 + filteredGallery.length) % filteredGallery.length
      );
    }
  };

  const handleNextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (prevIndex) => (prevIndex + 1) % filteredGallery.length
      );
    }
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-coffee-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Camera className="w-4 h-4" />
            <span>Visual Story</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-100 uppercase tracking-tight mb-4">
            The Duplex Gallery
          </h2>
          <p className="text-muted text-sm sm:text-base font-light font-sans">
            A glimpse into our cozy ambiance, mouth-watering comfort food, and warm lounge corners in Kalyan.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-coffee-400 text-background-darker border-coffee-400 shadow-md font-bold"
                    : "bg-background-card hover:bg-background-cardHover text-cream-300/80 hover:text-cream-100 border-white/10"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => {
            const heightClass =
              item.aspect === "tall"
                ? "row-span-2 h-96 sm:h-[450px]"
                : item.aspect === "wide"
                ? "h-64 sm:h-72"
                : "h-64 sm:h-80";

            return (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(index)}
                className={`group relative overflow-hidden rounded-sm cursor-pointer border border-white/10 bg-background-card shadow-lg ${heightClass}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                  loading="lazy"
                />

                {item.isCustom && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-xs bg-coffee-400 text-background-darker text-[9px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>New</span>
                  </div>
                )}

                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h4 className="font-serif text-lg text-cream-100 font-normal">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted font-sans font-light mt-1">
                        {item.caption}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-cream-100 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Maximize2 className="w-4 h-4 text-coffee-300" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          item={filteredGallery[lightboxIndex]}
          onClose={handleCloseLightbox}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}
    </section>
  );
}
