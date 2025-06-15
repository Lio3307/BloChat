import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../firebase/config";
import { setDoc, doc, getDoc } from "firebase/firestore";

export const Login = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPass, setIsShowPass] = useState(false);

  // const [signInWithGoogle, setSignInWithGoogle] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user);
        // bisa set state: setCurrentUser(user)
      } else {
        console.log("User not logged in");
        // setCurrentUser(null)
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  const handleLoginWithGoogle = async (e) => {
    e.preventDefault();
    try {
      const signInGoogle = await signInWithPopup(auth, googleProvider);
      const userDetail = signInGoogle.user;

      const useRef = doc(db, "Users", userDetail.uid);
      const userSnap = await getDoc(useRef);
      if (!userSnap.exists()) {
        await setDoc(useRef, {
          email: userDetail.email,
          fullName: userDetail.fullName || userDetail.displayName,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (emailAddress.trim() === "" || password.trim() === "") {
      alert("Input Field cannot be empty");
      return;
    }

    if (password.length < 6) {
      alert("Password at least more than 6 character!!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailAddress, password);
      alert("Login Successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type={isShowPass ? "text" : "password"}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                onChange={() => {
                  setIsShowPass((showPass) => !showPass);
                }}
              />
              Show Password
            </div>
            <p>
              Dont have account? <Link to="/register">Sign Up Here!</Link>{" "}
            </p>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            <button
              onClick={handleLoginWithGoogle}
              className="btn btn-success w-100"
            >
              Login With Google
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
