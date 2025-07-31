import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs, 
  updateDoc 
} from "firebase/firestore";
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

/** Tight typings so we can re‑export everything cleanly */
interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
  auth: Auth;
}

/** Singleton – avoids re‑initialising in dev hot reloads */
let services: FirebaseServices | null = null;

export function getFirebase(): FirebaseServices {
  if (services) return services;

  // ✅ read your keys from .env (Vite uses import.meta.env)
  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId:
            import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
        });

  services = {
    app,
    db: getFirestore(app),
    storage: getStorage(app),
    auth: getAuth(app),
  };
  return services;
}

export { 
  collection, 
  doc, 
  setDoc, 
  getDoc, // ← ADD these
  getDocs,
  updateDoc,
  ref, 
  uploadBytes, 
  getDownloadURL,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
};
