import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

const AUTH_USER_KEY = "duplex_current_user";
const AUTH_EVENT_NAME = "duplex_auth_state_changed";

// Default admin email
export const ADMIN_EMAILS = ["admin@duplexcafe.com", "manager@duplexcafe.com"];

// Pre-seeded demo customer account
const DEMO_CUSTOMER = {
  uid: "cust_demo_rohit",
  name: "Rohit Deshmukh",
  email: "rohit@example.com",
  phone: "+91 98201 45678",
  role: "customer",
  photoURL: null,
  createdAt: new Date().toISOString()
};

const DEMO_ADMIN = {
  uid: "admin_master_dlc",
  name: "Duplex Staff Admin",
  email: "admin@duplexcafe.com",
  phone: "+91 98999 00000",
  role: "admin",
  photoURL: null,
  createdAt: new Date().toISOString()
};

/**
 * 💾 GET CURRENT LOCAL USER SESSION
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * 💾 SAVE USER SESSION & NOTIFY LISTENERS
 */
export function saveUserSession(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: user }));
  } catch (err) {
    console.error("Auth session save error:", err);
  }
}

/**
 * 🔑 CUSTOMER SIGN IN
 */
export async function customerSignIn(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  // Quick Demo account bypass for development
  if (cleanEmail === "rohit@example.com" && password === "customer123") {
    saveUserSession(DEMO_CUSTOMER);
    return DEMO_CUSTOMER;
  }

  // Admin login check
  if (ADMIN_EMAILS.includes(cleanEmail) && (password === "duplex123" || password === "admin123")) {
    saveUserSession(DEMO_ADMIN);
    return DEMO_ADMIN;
  }

  // Firebase Auth if enabled
  if (isFirebaseConfigured && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      let userData = {
        uid: cred.user.uid,
        name: cred.user.displayName || cleanEmail.split("@")[0],
        email: cred.user.email,
        phone: cred.user.phoneNumber || "",
        role: ADMIN_EMAILS.includes(cleanEmail) ? "admin" : "customer",
        photoURL: cred.user.photoURL || null
      };

      // Try fetching additional Firestore profile
      if (db) {
        try {
          const userDoc = await getDoc(doc(db, "users", cred.user.uid));
          if (userDoc.exists()) {
            userData = { ...userData, ...userDoc.data() };
          }
        } catch (e) {
          console.warn("Firestore user fetch error:", e);
        }
      }

      saveUserSession(userData);
      return userData;
    } catch (err) {
      throw new Error(err.message || "Failed to sign in. Please check credentials.");
    }
  }

  // Local user registry fallback
  const registeredUsersRaw = localStorage.getItem("duplex_registered_users");
  const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : [];
  const found = registeredUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (found) {
    const sessionData = {
      uid: found.uid,
      name: found.name,
      email: found.email,
      phone: found.phone,
      role: "customer",
      photoURL: null,
      createdAt: found.createdAt
    };
    saveUserSession(sessionData);
    return sessionData;
  }

  throw new Error("Invalid email or password. You can also click 'Use Quick Demo Customer' below.");
}

/**
 * 📝 CUSTOMER SIGN UP / REGISTRATION
 */
export async function customerSignUp({ name, email, phone, password }) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();

  if (!cleanName || !cleanEmail || !password) {
    throw new Error("Name, email, and password are required.");
  }

  // Firebase Auth if enabled
  if (isFirebaseConfigured && auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(cred.user, { displayName: cleanName });

      const newUserData = {
        uid: cred.user.uid,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: "customer",
        createdAt: new Date().toISOString()
      };

      if (db) {
        try {
          await setDoc(doc(db, "users", cred.user.uid), newUserData);
        } catch (err) {
          console.warn("Firestore user creation warning:", err);
        }
      }

      saveUserSession(newUserData);
      return newUserData;
    } catch (err) {
      throw new Error(err.message || "Registration failed. Email might already be in use.");
    }
  }

  // Local register fallback
  const uid = `cust_${Date.now().toString(36)}`;
  const newLocalUser = {
    uid,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    password: password,
    role: "customer",
    createdAt: new Date().toISOString()
  };

  const registeredUsersRaw = localStorage.getItem("duplex_registered_users");
  const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : [];

  if (registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error("An account with this email address already exists. Please sign in.");
  }

  registeredUsers.push(newLocalUser);
  localStorage.setItem("duplex_registered_users", JSON.stringify(registeredUsers));

  const sessionData = {
    uid: newLocalUser.uid,
    name: newLocalUser.name,
    email: newLocalUser.email,
    phone: newLocalUser.phone,
    role: "customer",
    photoURL: null,
    createdAt: newLocalUser.createdAt
  };
  saveUserSession(sessionData);
  return sessionData;
}

/**
 * 🔐 ADMIN SIGN IN
 */
export async function adminSignIn(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  // Fast dev admin bypass
  if ((cleanEmail === "admin@duplexcafe.com" || cleanEmail === "manager@duplexcafe.com") && password === "duplex123") {
    saveUserSession(DEMO_ADMIN);
    return DEMO_ADMIN;
  }

  if (isFirebaseConfigured && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const adminData = {
        uid: cred.user.uid,
        name: cred.user.displayName || "Admin",
        email: cred.user.email,
        role: "admin"
      };
      saveUserSession(adminData);
      return adminData;
    } catch (err) {
      throw new Error(err.message || "Admin authentication failed.");
    }
  }

  if (password === "duplex123" || password === "admin123") {
    const adminData = {
      uid: `admin_${Date.now()}`,
      name: cleanEmail.split("@")[0].toUpperCase() + " (Staff)",
      email: cleanEmail,
      role: "admin"
    };
    saveUserSession(adminData);
    return adminData;
  }

  throw new Error("Invalid admin credentials. Use default password: duplex123");
}

/**
 * 🚪 SIGN OUT
 */
export async function signOutUser() {
  if (isFirebaseConfigured && auth) {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn("Firebase signout warning:", e);
    }
  }
  saveUserSession(null);
}

/**
 * 📡 SUBSCRIBE TO AUTH STATE CHANGES
 */
export function subscribeToAuth(callback) {
  const handleCustom = (e) => {
    callback(e.detail !== undefined ? e.detail : getCurrentUser());
  };

  window.addEventListener(AUTH_EVENT_NAME, handleCustom);
  window.addEventListener("storage", handleCustom);

  // Initial callback
  callback(getCurrentUser());

  return () => {
    window.removeEventListener(AUTH_EVENT_NAME, handleCustom);
    window.removeEventListener("storage", handleCustom);
  };
}
