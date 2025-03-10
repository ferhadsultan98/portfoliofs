// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove, update, onValue, push } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyClvkg7Z7jUunCBwguHlYOnF_hTVEV9N4Y",
  authDomain: "adminpanel-faff5.firebaseapp.com",
  databaseURL: "https://adminpanel-faff5-default-rtdb.firebaseio.com",
  projectId: "adminpanel-faff5",
  storageBucket: "adminpanel-faff5.firebasestorage.app",
  messagingSenderId: "1005832850429",
  appId: "1:1005832850429:web:95499881b194c43a7e6794"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Database ve Authentication nesnelerini al
const database = getDatabase(app);
const auth = getAuth(app);

// İzin verilen UID
const ALLOWED_UID = "TYNt14EbveTHQvSOiWFCxlQP7wz1";

// Kullanıcı giriş fonksiyonu
const loginUser = async (email, password) => {
  try {
    // Firebase Authentication ile giriş yap
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // UID kontrolü
    if (user.uid !== ALLOWED_UID) {
      await signOut(auth); // UID eşleşmiyorsa çıkış yap
      throw new Error("Bu UID ile giriş yapma yetkiniz yok: " + user.uid);
    }

    console.log("Giriş başarılı, UID:", user.uid);
    return user;
  } catch (error) {
    console.error("Giriş hatası:", error.message);
    throw error;
  }
};

// Kullanıcı çıkış fonksiyonu
const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Kullanıcı çıkış yaptı.");
  } catch (error) {
    console.error("Çıkış hatası:", error.message);
    throw error;
  }
};

// Kullanıcı giriş durumu kontrolü
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Kullanıcı giriş yaptı, UID:", user.uid);
    // UID kontrolü
    if (user.uid !== ALLOWED_UID) {
      console.log("Yetkisiz kullanıcı, çıkış yapılıyor... UID:", user.uid);
      signOut(auth);
    }
  } else {
    console.log("Kullanıcı çıkış yaptı veya giriş yapmadı.");
  }
});

// Veritabanına veri yazma fonksiyonu
const writeData = async (path, data) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("Kullanıcı giriş yapmamış!");
      throw new Error("Kullanıcı giriş yapmamış!");
    }
    if (user.uid !== ALLOWED_UID) {
      console.error("Bu UID ile işlem yapma yetkiniz yok:", user.uid);
      throw new Error("Bu UID ile işlem yapma yetkiniz yok!");
    }

    const dbRef = ref(database, path);
    await set(dbRef, data);
    console.log("Veri başarıyla yazıldı:", data);
    return true;
  } catch (error) {
    console.error("Veri yazma hatası:", error.message);
    throw error;
  }
};

// Veritabanından veri okuma fonksiyonu
const readData = async (path) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("Kullanıcı giriş yapmamış!");
      throw new Error("Kullanıcı giriş yapmamış!");
    }
    if (user.uid !== ALLOWED_UID) {
      console.error("Bu UID ile işlem yapma yetkiniz yok:", user.uid);
      throw new Error("Bu UID ile işlem yapma yetkiniz yok!");
    }

    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      console.log("Veri:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("Veri bulunamadı:", path);
      return null;
    }
  } catch (error) {
    console.error("Veri okuma hatası:", error.message);
    throw error;
  }
};

// Dışa aktarılacak modüller
export { getDatabase, database, ref, set, get, child, remove, update, onValue, push, auth, loginUser, logoutUser, writeData, readData };