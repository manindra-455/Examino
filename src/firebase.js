import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyCQM68pitvY4tLfnplEdfIpV0gtF6Op4bE",
  authDomain: "examino-f22a4.firebaseapp.com",
  projectId: "examino-f22a4",
  storageBucket: "examino-f22a4.firebasestorage.app",
  messagingSenderId: "440994412722",
  appId: "1:440994412722:web:c035b90394166b0a9af1ab",
  measurementId: "G-5S1X3XP235"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); 
const auth = getAuth(app); 

export { auth, db };