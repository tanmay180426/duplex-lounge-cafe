import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileActionBar from "./components/MobileActionBar";
import BookingModal from "./components/BookingModal";
import AdminDashboard from "./components/AdminDashboard";
import CustomerAuthModal from "./components/CustomerAuthModal";
import CustomerPortalModal from "./components/CustomerPortalModal";
import EmailPreviewModal from "./components/EmailPreviewModal";

// Multi-Page Views
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import BookingPage from "./pages/BookingPage";
import GalleryPage from "./pages/GalleryPage";
import StoryPage from "./pages/StoryPage";
import LocationPage from "./pages/LocationPage";

import { subscribeToAuth, getCurrentUser } from "./services/authService";

export default function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser);

  // Multi-Page Routing State: "home" | "menu" | "book" | "gallery" | "story" | "location"
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const validPages = ["home", "menu", "book", "gallery", "story", "location"];
    return validPages.includes(hash) ? hash : "home";
  });

  // Modal Visibility States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialAreaId, setBookingInitialAreaId] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [customerAuthMode, setCustomerAuthMode] = useState("signin");
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [emailPreviewBooking, setEmailPreviewBooking] = useState(null);

  // Subscribe to Auth state changes
  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Listen to browser forward/backward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      const validPages = ["home", "menu", "book", "gallery", "story", "location"];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Page navigation handler
  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenBooking = (areaId = null) => {
    setEditingBooking(null);
    setBookingInitialAreaId(areaId || null);
    setIsBookingOpen(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setBookingInitialAreaId(booking.reservation?.areaId || null);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setEditingBooking(null);
  };

  const handleOpenCustomerAuth = (mode = "signin") => {
    setCustomerAuthMode(mode);
    setIsCustomerAuthOpen(true);
  };

  const handlePreviewEmail = (booking) => {
    setEmailPreviewBooking(booking);
  };

  // If Admin Dashboard is open, render Admin Screen full-screen
  if (isAdminOpen) {
    return (
      <AdminDashboard
        onExitAdmin={() => setIsAdminOpen(false)}
        onPreviewEmail={handlePreviewEmail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-cream-200 font-sans flex flex-col selection:bg-coffee-500 selection:text-background-darker">
      
      {/* Top Header with Multi-Page Navigation Tabs */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCustomerAuth={() => handleOpenCustomerAuth("signin")}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Multi-Page Route Render */}
      <main className="flex-grow">
        {currentPage === "home" && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === "menu" && (
          <MenuPage
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === "book" && (
          <BookingPage
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === "gallery" && (
          <GalleryPage />
        )}

        {currentPage === "story" && (
          <StoryPage
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === "location" && (
          <LocationPage
            onOpenBooking={handleOpenBooking}
          />
        )}
      </main>

      {/* Global Multi-Page Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileActionBar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      {/* Table Booking & Pre-Order Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialAreaId={bookingInitialAreaId}
        currentUser={currentUser}
        editBooking={editingBooking}
        onPreviewEmail={handlePreviewEmail}
      />

      {/* Customer Sign In / Sign Up Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        initialMode={customerAuthMode}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Customer "My Bookings" & Profile Portal */}
      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
        currentUser={currentUser}
        onOpenBooking={() => handleOpenBooking(null)}
        onEditBooking={handleEditBooking}
        onPreviewEmail={handlePreviewEmail}
      />

      {/* HTML Email Confirmation Preview Modal */}
      <EmailPreviewModal
        isOpen={Boolean(emailPreviewBooking)}
        onClose={() => setEmailPreviewBooking(null)}
        booking={emailPreviewBooking}
      />

    </div>
  );
}
