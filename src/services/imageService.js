import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db, storage, isFirebaseConfigured } from "./firebase";

const GALLERY_IMAGES_LOCAL_KEY = "duplex_gallery_uploaded_images";
const GALLERY_EVENT_NAME = "duplex_gallery_images_update";

// Gallery Category options
export const GALLERY_CATEGORIES = [
  { id: "all", label: "All Photos" },
  { id: "ambience", label: "Lounge Ambience" },
  { id: "mezzanine", label: "Mezzanine & Stairs" },
  { id: "neon", label: "Neon Booths" },
  { id: "food", label: "Pizzas & Momos" },
  { id: "drinks", label: "Coffee & Drinks" }
];

/**
 * 💾 GET LOCAL UPLOADED IMAGES
 */
export function getLocalUploadedImages() {
  try {
    const raw = localStorage.getItem(GALLERY_IMAGES_LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * 💾 SAVE LOCAL UPLOADED IMAGES
 */
function saveLocalUploadedImages(images) {
  try {
    localStorage.setItem(GALLERY_IMAGES_LOCAL_KEY, JSON.stringify(images));
    window.dispatchEvent(new Event(GALLERY_EVENT_NAME));
  } catch (err) {
    console.error("Error saving local gallery images:", err);
  }
}

/**
 * 🖼️ CONVERT FILE TO BASE64 (FOR LOCAL STORAGE FALLBACK)
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 📤 UPLOAD GALLERY IMAGE (ADMIN ACTION)
 * Supports Firebase Storage when configured, with seamless base64 local fallback.
 */
export async function uploadGalleryImage({
  file,
  title = "Duplex Ambience",
  category = "ambience",
  caption = "",
  onProgress = null
}) {
  if (!file) throw new Error("No image file provided.");

  const imageId = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  // If Firebase Storage is configured
  if (isFirebaseConfigured && storage && db) {
    try {
      const storageRef = ref(storage, `gallery/${imageId}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          },
          (error) => {
            console.error("[Firebase Storage] Upload failed:", error);
            reject(error);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const imageDoc = {
              id: imageId,
              title: title.trim(),
              category: category,
              caption: caption.trim(),
              src: downloadUrl,
              storagePath: `gallery/${imageId}_${file.name}`,
              uploadedAt: now,
              isCustomUpload: true
            };

            await setDoc(doc(db, "gallery_images", imageId), imageDoc);
            console.log("[Firebase] Gallery image doc saved:", imageId);
            resolve(imageDoc);
          }
        );
      });
    } catch (err) {
      console.warn("[Firebase] Upload failed, falling back to local storage:", err);
    }
  }

  // Local Base64 Storage Fallback
  if (onProgress) onProgress(30);
  const base64Data = await fileToBase64(file);
  if (onProgress) onProgress(100);

  const localImageDoc = {
    id: imageId,
    title: title.trim() || file.name,
    category: category,
    caption: caption.trim() || "Uploaded by Duplex Staff",
    src: base64Data,
    storagePath: null,
    uploadedAt: now,
    isCustomUpload: true
  };

  const list = getLocalUploadedImages();
  list.unshift(localImageDoc);
  saveLocalUploadedImages(list);

  return localImageDoc;
}

/**
 * 🗑️ DELETE GALLERY IMAGE (ADMIN ACTION)
 */
export async function deleteGalleryImage(imageId, storagePath = null) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "gallery_images", imageId));
      if (storage && storagePath) {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
      }
      return true;
    } catch (err) {
      console.warn("[Firebase] Delete image warning:", err);
    }
  }

  const list = getLocalUploadedImages();
  const filtered = list.filter((img) => img.id !== imageId);
  saveLocalUploadedImages(filtered);
  return true;
}

/**
 * 📡 SUBSCRIBE TO GALLERY IMAGES (For website Gallery & Admin Manager)
 */
export function subscribeToGalleryImages(onData) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "gallery_images"), orderBy("uploadedAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = [];
          snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
          onData(list);
        },
        (err) => {
          console.warn("[Firebase] Gallery subscription fallback:", err);
          onData(getLocalUploadedImages());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Gallery subscription fallback:", err);
    }
  }

  const handleUpdate = () => {
    onData(getLocalUploadedImages());
  };

  window.addEventListener(GALLERY_EVENT_NAME, handleUpdate);
  window.addEventListener("storage", handleUpdate);

  onData(getLocalUploadedImages());

  return () => {
    window.removeEventListener(GALLERY_EVENT_NAME, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}
