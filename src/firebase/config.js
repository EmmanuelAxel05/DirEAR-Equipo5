// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdWXQHd9eHZaJB0AVksnT2JAgxchCn1Hs",
  authDomain: "direar-c0b34.firebaseapp.com",
  projectId: "direar-c0b34",
  storageBucket: "direar-c0b34.firebasestorage.app",
  messagingSenderId: "458290684188",
  appId: "1:458290684188:web:2ac0d12d85df90a5645ad9",
  measurementId: "G-S1N8J9MWLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Autenticación y Base de Datos (Firestore)
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics opcional (compatible con entornos web modernos)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { analytics };