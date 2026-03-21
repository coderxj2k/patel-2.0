import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoku2h7vazHy4m2HTRmSQu67JIIasMzpE",
  authDomain: "patel-electronics-872c0.firebaseapp.com",
  databaseURL: "https://patel-electronics-872c0-default-rtdb.firebaseio.com",
  projectId: "patel-electronics-872c0",
  storageBucket: "patel-electronics-872c0.firebasestorage.app",
  messagingSenderId: "888158268153",
  appId: "1:888158268153:web:c681c605a1a410d452d028",
  measurementId: "G-FTC39FJSMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// For development/demo, use fallback config
export const demoFirebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};
