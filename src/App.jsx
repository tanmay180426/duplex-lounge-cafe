import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileActionBar from "./components/MobileActionBar";
import BookingModal from "./components/BookingModal";
import AdminDashboard from "./components/AdminDashboard";

import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import BookingPage from "./pages/BookingPage";
import GalleryPage from "./pages/GalleryPage";
import StoryPage from "./pages/StoryPage";
import LocationPage from "./pages/LocationPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const validPages = ["home", "menu", "book", "gallery", "story", "location"];
    return validPages.includes(hash) ? hash : "home";
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialAreaId, setBookingInitialAreaId] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    return hash === "admin" || hash === "admin/login" || hash === "admin/dashboard";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (hash === "admin" || hash === "admin/login" || hash === "admin/dashboard") {
        setIsAdminOpen(true);
        return;
      }
      setIsAdminOpen(false);
      const validPages = ["home", "menu", "book", "gallery", "story", "location"];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenBooking = (areaId = null) => {
    setBookingInitialAreaId(areaId || null);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleExitAdmin = () => {
    setIsAdminOpen(false);
    window.location.hash = currentPage || "home";
  };

  if (isAdminOpen) {
    return <AdminDashboard onExitAdmin={handleExitAdmin} />;
  }

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-cream-200 font-sans flex flex-col selection:bg-coffee-500 selection:text-background-darker">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-grow">
        {currentPage === "home" && (
          <HomePage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}
        {currentPage === "menu" && <MenuPage onOpenBooking={handleOpenBooking} />}
        {currentPage === "book" && <BookingPage onOpenBooking={handleOpenBooking} />}
        {currentPage === "gallery" && <GalleryPage />}
        {currentPage === "story" && (
          <StoryPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}
        {currentPage === "location" && <LocationPage onOpenBooking={handleOpenBooking} />}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <MobileActionBar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialAreaId={bookingInitialAreaId}
      />
    </div>
  );
}