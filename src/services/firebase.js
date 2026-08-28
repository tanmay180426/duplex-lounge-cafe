import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "your_firebase_api_key_here" &&
  !firebaseConfig.apiKey.includes("your_firebase")
);

let app = null;
let db = null;
let auth = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log("[Firebase] Successfully connected to Firebase Project:", firebaseConfig.projectId);
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
  }
} else {
  console.info(
    "[Firebase] Live credentials not found in .env.local. Running in Local Reactive Mode for development & testing. Set VITE_FIREBASE_* variables to connect live project."
  );
}

export { app, db, auth, storage };
