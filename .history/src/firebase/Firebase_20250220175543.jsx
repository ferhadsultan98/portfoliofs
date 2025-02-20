// Firebase SDK-lərini daxil et
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove, update } from "firebase/database";
import { db, getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Firestore-ı əlavə et

// Firebase konfiqurasiyasını əlavə et
const firebaseConfig = {
  apiKey: "AIzaSyClvkg7Z7jUunCBwguHlYOnF_hTVEV9N4Y",
  authDomain: "adminpanel-faff5.firebaseapp.com",
  databaseURL: "https://adminpanel-faff5-default-rtdb.firebaseio.com",
  projectId: "adminpanel-faff5",
  storageBucket: "adminpanel-faff5.firebasestorage.app",
  messagingSenderId: "1005832850429",
  appId: "1:1005832850429:web:95499881b194c43a7e6794"
};

// Firebase tətbiqini başlat
const app = initializeApp(firebaseConfig);

// Realtime Database və Firestore-u əldə et
const database = getDatabase(app);
const firestore = getFirestore(app);

// Firestore funksiyalarını ixrac et
export { getDatabase, database, ref, set, get, child, remove, update, firestore, collection, query, where, getDocs };
