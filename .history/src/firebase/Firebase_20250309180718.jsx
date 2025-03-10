// Firebase SDK'dan gerekli modülleri import et
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove, update, onValue, push } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

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

// Sabit kullanıcı adı ve şifre (kodda kontrol için)
const ALLOWED_USERNAME = "farhad";
const ALLOWED_PASSWORD = "farxad14";
const ALLOWED_EMAIL = "farhad@example.com"; // Firebase Authentication'da kullanacağımız email

// Kullanıcı giriş fonksiyonu
const loginUser = async (username, password) => {
  try {
    // Kullanıcı adı ve şifreyi kontrol et
    if (username !== ALLOWED_USERNAME || password !== ALLOWED_PASSWORD) {
      throw new Error("Geçersiz kullanıcı adı veya şifre!");
    }

    // Firebase Authentication ile giriş yap
    const userCredential = await signInWithEmailAndPassword(auth, ALLOWED_EMAIL, ALLOWED_PASSWORD);
    const user = userCredential.user;
    console.log("Giriş başarılı:", user.uid);
    return user;
  } catch (error) {
    console.error("Giriş hatası:", error.message);
    throw error;
  }
};

// Kullanıcı giriş durumu kontrolü
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Kullanıcı giriş yaptı:", user.uid);
  } else {
    console.log("Kullanıcı çıkış yaptı veya giriş yapmadı.");
  }
});

// Veritabanına veri yazma fonksiyonu
const writeData = async (path, data) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Kullanıcı giriş yapmamış!");

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
    if (!user) throw new Error("Kullanıcı giriş yapmamış!");

    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      console.log("Veri:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("Veri bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Veri okuma hatası:", error.message);
    throw error;
  }
};

// Dışa aktarılacak modüller
export { getDatabase, database, ref, set, get, child, remove, update, onValue, push, auth, loginUser, writeData, readData };