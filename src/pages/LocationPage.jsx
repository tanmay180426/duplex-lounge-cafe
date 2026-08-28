import React from "react";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { CAFE_INFO } from "../data/cafeInfo";
import { OWNER_CONFIG, getWhatsAppUrl } from "../config/ownerConfig";

export default function LocationPage({ onOpenBooking }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-coffee-400">
          Find Us in Kalyan
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-cream-100 uppercase tracking-wide">
          Location & Hours
        </h1>
        <p className="text-xs sm:text-sm text-muted-light font-light leading-relaxed">
          Conveniently located at Tisgao Naka, easily accessible from Kalyan Railway Station.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact & Hours Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Address Details */}
          <div className="bg-[#141211] border border-white/10 p-6 rounded-sm space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-coffee-400 shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-lg text-cream-100 uppercase">
                  Address & Landmarks
                </h3>
                <p className="text-xs text-cream-200 mt-1 leading-relaxed">
                  Shop No. 2, Sai Suman Building, Next to Tisai Gate,<br />
                  Tisgao Naka, Kalyan (West), Maharashtra 421306
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2.5">
              <a
                href={CAFE_INFO.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xs text-center transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open Google Maps</span>
              </a>

              <a
                href={`tel:${OWNER_CONFIG.callingPhone}`}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-cream-100 font-bold text-xs uppercase tracking-wider rounded-xs transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-coffee-400" />
                <span>Call</span>
              </a>

              <a
                href={getWhatsAppUrl("Hello Duplex Lounge Cafe, I need directions to the cafe.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xs transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Operating Hours Table */}
          <div className="bg-[#141211] border border-white/10 p-6 rounded-sm space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-coffee-400" />
              <h3 className="font-serif text-lg text-cream-100 uppercase">
                Operating Hours
              </h3>
            </div>

            <div className="space-y-2 text-xs divide-y divide-white/5">
              <div className="flex justify-between py-1.5 text-muted">
                <span>Monday – Thursday</span>
                <span className="text-cream-100 font-semibold">11:00 AM – 10:30 PM</span>
              </div>
              <div className="flex justify-between py-1.5 text-muted">
                <span>Friday</span>
                <span className="text-cream-100 font-semibold">11:00 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between py-1.5 text-amber-400 font-bold">
                <span>Saturday</span>
                <span>Open 24 Hours ✨</span>
              </div>
              <div className="flex justify-between py-1.5 text-muted">
                <span>Sunday</span>
                <span className="text-cream-100 font-semibold">11:00 AM – 11:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Interactive Google Map Embed */}
        <div className="lg:col-span-7 bg-[#141211] border border-white/10 rounded-sm overflow-hidden min-h-[380px] shadow-2xl relative">
          <iframe
            title="Duplex Lounge Cafe Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.123456789!2d73.131234!3d19.231234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEzJzUyLjQiTiA3M8KwMDcnNTIuNCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "420px", filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>

      </div>

    </div>
  );
}
