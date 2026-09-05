/**
 * ☕ DUPLEX LOUNGE CAFE — SEED TABLE TYPES SCRIPT
 * Seeds the 4 bookable seating zones with their physical unit counts into Firestore.
 * 
 * Usage:
 * node scripts/seedTableTypes.js
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Error: Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in environment.");
  process.exit(1);
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const TABLE_TYPES = [
  {
    id: "mezzanine-lounge",
    name: "Upper Mezzanine Lounge",
    location: "Level 2 (Upstairs)",
    floor: "Level 2 (Upstairs)",
    minGuests: 2,
    maxGuests: 12,
    units: 1,
    description: "Private Netflix movie screening setup with plush group seating.",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "neon-booth",
    name: "Good Food Good Mood Neon Booth",
    location: "Ground Floor",
    floor: "Ground Floor",
    minGuests: 1,
    maxGuests: 6,
    units: 1,
    description: "Signature amber neon lighting backdrop with deep-cushioned booth seating.",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "ground-classic",
    name: "Ground Floor Classic Cafe Tables",
    location: "Ground Floor",
    floor: "Ground Floor",
    minGuests: 1,
    maxGuests: 4,
    units: 4, // Configurable table count
    description: "Classic comfortable cafe tables near the barista bar for dining & coffee.",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "window-corner",
    name: "Romantic Window Corner",
    location: "Ground Floor",
    floor: "Ground Floor",
    minGuests: 1,
    maxGuests: 2,
    units: 1,
    description: "Intimate cozy table with street view, ideal for couples or solo work.",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

async function seedTableTypes() {
  console.log("🌱 Seeding tableTypes collection in Firestore for project:", firebaseConfig.projectId);

  for (const zone of TABLE_TYPES) {
    try {
      const ref = doc(db, "tableTypes", zone.id);
      await setDoc(ref, zone, { merge: true });
      console.log(`✅ Seeded zone: [${zone.id}] ${zone.name} (${zone.units} unit(s), Capacity: ${zone.minGuests}-${zone.maxGuests})`);
    } catch (err) {
      console.error(`❌ Failed to seed zone ${zone.id}:`, err);
    }
  }

  console.log("\n🎉 Seeding complete! Table types are now active in Firestore.");
  process.exit(0);
}

seedTableTypes();
