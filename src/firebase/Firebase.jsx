// Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove, update, onValue, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyClvkg7Z7jUunCBwguHlYOnF_hTVEV9N4Y",
  authDomain: "adminpanel-faff5.firebaseapp.com",
  databaseURL: "https://adminpanel-faff5-default-rtdb.firebaseio.com",
  projectId: "adminpanel-faff5",
  storageBucket: "adminpanel-faff5.firebasestorage.app",
  messagingSenderId: "1005832850429",
  appId: "1:1005832850429:web:95499881b194c43a7e6794"
};

const app = initializeApp(firebaseConfig);


const database = getDatabase(app);

export { getDatabase, database, ref, set, get, child, remove, update, onValue, push };
