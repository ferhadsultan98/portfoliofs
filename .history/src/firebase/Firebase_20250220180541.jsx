// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove, update } from "firebase/database";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClvkg7Z7jUunCBwguHlYOnF_hTVEV9N4Y",
  authDomain: "adminpanel-faff5.firebaseapp.com",
  databaseURL: "https://adminpanel-faff5-default-rtdb.firebaseio.com",
  projectId: "adminpanel-faff5",
  storageBucket: "adminpanel-faff5.firebasestorage.app",
  messagingSenderId: "1005832850429",
  appId: "1:1005832850429:web:95499881b194c43a7e6794"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Realtime Database
const database = getDatabase(app);
const firestore = getFirestore(app);  // Firestore instance

// Export Firebase instances and functions
export { getDatabase, ref, set, get, child, remove, update, getFirestore, collection, query, where, getDocs  };
