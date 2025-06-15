import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxnkR56yu6CuZ_WsoOk8PPg6z1kde7bGg",
  authDomain: "fir-learntest-25495.firebaseapp.com",
  projectId: "fir-learntest-25495",
  storageBucket: "fir-learntest-25495.firebasestorage.app",
  messagingSenderId: "976346293283",
  appId: "1:976346293283:web:7618daa55dc56eac2ffd96",
  measurementId: "G-07ZBGZ50D6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()