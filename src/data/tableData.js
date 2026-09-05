export const SEATING_AREAS = [
  {
    id: "mezzanine-lounge",
    name: "Upper Mezzanine Lounge",
    subtitle: "Netflix Screening & Group Lounge",
    floor: "Level 2 (Upstairs)",
    minGuests: 2,
    maxGuests: 12,
    units: 1, // Number of physical units of this zone
    image: "/assets/duplex-mezzanine-stairs.jpg",
    features: [
      "Fairy-lit spiral staircase access",
      "Private Netflix movie screening setup",
      "Comfortable plush sofa & table seating",
      "Ideal for birthday parties & group hangouts"
    ],
    badge: "Most Popular"
  },
  {
    id: "neon-booth",
    name: "Good Food Good Mood Neon Booth",
    subtitle: "Signature Ambient Booth",
    floor: "Ground Floor",
    minGuests: 1,
    maxGuests: 6,
    units: 1, // Number of physical units of this zone
    image: "/assets/duplex-neon-booth.jpg",
    features: [
      "Signature amber neon lighting backdrop",
      "Geometric art acoustic wall",
      "Plush deep-cushioned booth seating",
      "Ideal for dates & aesthetic photo sessions"
    ],
    badge: "Signature Vibe"
  },
  {
    id: "ground-classic",
    name: "Ground Floor Classic Cafe Tables",
    subtitle: "Casual Dine-In Seating",
    floor: "Ground Floor",
    minGuests: 1,
    maxGuests: 4,
    units: 4, // Number of physical units of this zone (configurable)
    image: null,
    features: [
      "Quick access to barista & counter",
      "Comfortable cafe chair seating",
      "Great for quick meals & coffee catchups"
    ],
    badge: "Classic"
  },
  {
    id: "window-corner",
    name: "Romantic Window Corner",
    subtitle: "Cozy Corner Table",
    floor: "Ground Floor",
    minGuests: 1,
    maxGuests: 2,
    units: 1, // Number of physical units of this zone
    image: null,
    features: [
      "Quiet corner table with street view",
      "Intimate cozy setting for couples or solo work",
      "Power outlet available"
    ],
    badge: "Intimate"
  }
];

export const OCCASIONS = [
  "Casual Hangout",
  "Birthday Celebration",
  "Netflix Watch Party / Movie Night",
  "Romantic Date",
  "Anniversary",
  "College / Friends Reunion",
  "Study / Work Session"
];

// Physical Table inventory for Admin Floor Plan & Table Management
export const CAFE_PHYSICAL_TABLES = [
  { id: "T-M1", number: "M1", name: "Mezzanine Netflix Sofa Lounge", areaId: "mezzanine-lounge", floor: "Level 2", capacity: 8, status: "AVAILABLE" },
  { id: "T-M2", number: "M2", name: "Mezzanine Side Table A", areaId: "mezzanine-lounge", floor: "Level 2", capacity: 4, status: "AVAILABLE" },
  { id: "T-N1", number: "N1", name: "Main Neon Sign Booth", areaId: "neon-booth", floor: "Level 1", capacity: 6, status: "RESERVED" },
  { id: "T-N2", number: "N2", name: "Acoustic Art Booth", areaId: "neon-booth", floor: "Level 1", capacity: 4, status: "AVAILABLE" },
  { id: "T-C1", number: "C1", name: "Barista Front Table", areaId: "ground-classic", floor: "Level 1", capacity: 4, status: "AVAILABLE" },
  { id: "T-C2", number: "C2", name: "Center Cafe Table", areaId: "ground-classic", floor: "Level 1", capacity: 4, status: "AVAILABLE" },
  { id: "T-C3", number: "C3", name: "Wall Bench Table", areaId: "ground-classic", floor: "Level 1", capacity: 2, status: "AVAILABLE" },
  { id: "T-W1", number: "W1", name: "Window Street View Table", areaId: "window-corner", floor: "Level 1", capacity: 2, status: "AVAILABLE" }
];
