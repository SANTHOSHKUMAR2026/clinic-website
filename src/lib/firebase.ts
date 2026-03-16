import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase conditionally to prevent crashes if env vars are missing
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let functions: any = null;

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn("Firebase config is missing. Please add .env.local with Firebase credentials.");
}

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    functions = getFunctions(app, "asia-south1");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { app, auth, db, storage, functions };

// --- Firestore Database Schema Documentation --- //
/*
Collections:

1. `patients`
  - id: Auto-generated Auth UID or Document ID
  - name: string
  - age: number
  - gender: string (Male/Female/Other)
  - mobile: string
  - email: string
  - address: string
  - totalVisits: number
  - lastVisit: timestamp

2. `appointments`
  - id: Document ID
  - patientId: string (Reference to patients)
  - patientName: string
  - patientMobile: string
  - appointmentDate: string (YYYY-MM-DD)
  - appointmentTime: string (e.g. "2:00 PM")
  - reasonForVisit: string (SKIN/HAIR/NAIL)
  - isPreviousPatient: boolean
  - status: string (Upcoming / Completed / Cancelled)
  - paymentId: string
  - paymentStatus: string (Pending / Paid / Refunded)
  - createdAt: timestamp

3. `payments`
  - id: Document ID (Razorpay Order ID)
  - appointmentId: string
  - patientId: string
  - amount: number
  - paymentMethod: string
  - transactionId: string (Razorpay Payment ID)
  - status: string (Success / Failed / Refunded)
  - timestamp: timestamp

4. `admin`
  - id: User ID
  - email: string
  - role: string ("admin")
*/
