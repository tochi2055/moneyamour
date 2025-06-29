import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore"
import { getStorage, connectStorageEmulator, FirebaseStorage } from "firebase/storage"

// Initialize Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

// Only initialize Firebase if we're in a browser environment
if (isBrowser) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    // Connect to emulators in development
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
      connectAuthEmulator(auth, "http://localhost:9099")
      connectFirestoreEmulator(db, "localhost", 8080)
      connectStorageEmulator(storage, "localhost", 9199)
    }

    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Helper function to check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return isBrowser && app && auth && db && storage
}

export { app, auth, db, storage }
