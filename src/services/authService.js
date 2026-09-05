import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

const AUTH_EVENT_NAME = "duplex_admin_auth_changed";

function emitAuth(user) {
  try {
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: user }));
  } catch (err) {
    console.error("Admin auth event emit error:", err);
  }
}

async function logAdminLogin({ email, success, reason = "" }) {
  const log = {
    email: (email || "").toLowerCase(),
    success: Boolean(success),
    reason: reason.slice(0, 200),
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 200) : "",
    timestamp: new Date().toISOString()
  };
  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, "admin_login_logs"), {
        ...log,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn("[admin_login_logs] Firestore write warning:", err);
    }
  }
  try {
    const key = "duplex_admin_login_logs";
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(log);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
  } catch {
    // ignore
  }
}

/**
 * 🔐 ADMIN SIGN IN (Email + Password via Firebase Auth + admins collection)
 *
 * Only users that exist in the Firestore `admins` collection (by UID or email)
 * OR carry a custom claim `admin: true` are accepted.
 */
export async function adminSignIn(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();

  if (!cleanEmail || !cleanPassword) {
    throw new Error("Please enter both admin email and password.");
  }

  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Live authentication is not configured. Set Firebase environment variables to enable admin login."
    );
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    let isAdmin = false;

    if (db) {
      try {
        const adminByUid = await getDoc(doc(db, "admins", cred.user.uid));
        const adminByEmail = await getDoc(doc(db, "admins", cleanEmail));
        if (adminByUid.exists() || adminByEmail.exists()) {
          isAdmin = true;
        }
      } catch (e) {
        console.warn("Admin Firestore check:", e);
      }
    }

    const tokenResult = await cred.user.getIdTokenResult();
    if (tokenResult.claims && tokenResult.claims.admin === true) {
      isAdmin = true;
    }

    if (!isAdmin) {
      await fbSignOut(auth);
      logAdminLogin({ email: cleanEmail, success: false, reason: "not in admins collection" });
      throw new Error("Access denied. This account does not have cafe administrator permissions.");
    }

    const adminData = {
      uid: cred.user.uid,
      name: cred.user.displayName || "Cafe Admin",
      email: cred.user.email,
      role: "admin",
      isAdmin: true
    };

    logAdminLogin({ email: cleanEmail, success: true });
    emitAuth(adminData);
    return adminData;
  } catch (err) {
    const msg = err.message || "Admin authentication failed. Please check your credentials.";
    if (!/not in admins collection/.test(msg)) {
      logAdminLogin({ email: cleanEmail, success: false, reason: msg });
    }
    throw new Error(msg);
  }
}

/**
 * 🚪 ADMIN SIGN OUT
 */
export async function signOut() {
  if (isFirebaseConfigured && auth) {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn("Firebase sign out warning:", err);
    }
  }
  emitAuth(null);
}

/**
 * 👂 SUBSCRIBE TO ADMIN AUTH STATE CHANGES
 */
export function subscribeToAdminAuth(callback) {
  const handleEvent = (e) => callback(e.detail || null);
  window.addEventListener(AUTH_EVENT_NAME, handleEvent);

  let fbUnsub = null;
  if (isFirebaseConfigured && auth) {
    fbUnsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        emitAuth(null);
        callback(null);
        return;
      }
      let profile = {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split("@")[0] || "Admin",
        email: fbUser.email || "",
        role: "admin",
        isAdmin: false
      };
      if (db) {
        try {
          const adminByUid = await getDoc(doc(db, "admins", fbUser.uid));
          const adminByEmail = await getDoc(doc(db, "admins", profile.email || ""));
          if (adminByUid.exists() || adminByEmail.exists()) {
            profile.isAdmin = true;
          }
        } catch (e) {
          console.warn(e);
        }
      }
      if (profile.isAdmin) emitAuth(profile);
      callback(profile.isAdmin ? profile : null);
    });
  }

  return () => {
    window.removeEventListener(AUTH_EVENT_NAME, handleEvent);
    if (fbUnsub) fbUnsub();
  };
}