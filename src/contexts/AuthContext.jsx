import { useState, useEffect, createContext, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/config";

import { setDoc, doc, getDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

const AuthProvider = createContext();

export const AuthContext = ({ children }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetail(docSnap.data());
          } else {
            console.log("User document not found");
            setUserDetail(null);
          }
        } catch (err) {
          console.error(err);
          setUserDetail(null);
        }
      } else {
        setUserDetail(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function subscribe(auth, db, setLoading) {
    const result = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetail(docSnap.data());
          } else {
            console.log("User document not found");
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setUserDetail(null);
      }
      setLoading(false);
    });
    return result;
  }

  async function signUpEmail(db, fullName, auth, email, password) {
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      fullName.trim() === ""
    ) {
      alert("input field cannot be empty or space!!");
      return;
    }
    if (password.length < 6) {
      alert("Create password at least 6 length!");
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await setDoc(doc(db, "Users", currentUser.uid), {
          email: currentUser.email,
          fullName: fullName,
        });
      }
      alert("Register successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function signInEmail(auth, email, password) {
    if (email.trim() === "" || password.trim() === "") {
      alert("input field cannot be empty or space!!");
      return;
    }
    if (password.length < 6) {
      alert("Create password at least 6 length!");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          alert("Email tidak terdaftar! Silakan daftar terlebih dahulu.");
          break;

        case "auth/wrong-password":
          alert("Password yang Anda masukkan salah!");
          break;

        case "auth/invalid-credential":
          alert("Email atau password yang Anda masukkan salah!");
          break;

        case "auth/invalid-email":
          alert("Format email tidak valid!");
          break;

        case "auth/user-disabled":
          alert("Akun Anda telah dinonaktifkan!");
          break;

        case "auth/too-many-requests":
          alert("Terlalu banyak percobaan login. Silakan coba lagi nanti.");
          break;

        case "auth/network-request-failed":
          alert("Gagal terhubung ke server. Periksa koneksi internet Anda.");
          break;

        default:
          alert("Terjadi kesalahan saat login: " + err.message);
          break;
      }
    } finally {
      setLoading(false);
    }
  }

  async function signInGoogle(db, auth, GoogleProvider) {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, GoogleProvider);
      const googleUser = result.user;

      const userRef = doc(db, "Users", googleUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: googleUser.email,
          fullName: googleUser.displayName,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    email,
    password,
    fullName,
    setFullName,
    setEmail,
    setPassword,
    signUpEmail,
    signInEmail,
    signInGoogle,
    userDetail,
    setUserDetail,
    subscribe,
    loading,
    setLoading,
  };

  return (
    <>
      <AuthProvider.Provider value={value}>{children}</AuthProvider.Provider>
    </>
  );
};

export const useAuthContext = () => useContext(AuthProvider);
