import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJNtK7YP4mvt6lCMVCNDM1qHoLFAOxCAg",
  authDomain: "react-slinkup.firebaseapp.com",
  projectId: "react-slinkup",
  storageBucket: "react-slinkup.firebasestorage.app",
  messagingSenderId: "1018224135932",
  appId: "1:1018224135932:web:3ed73b5543a1b155331179",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
