import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../firebase/config";
import { useAuthContext } from "../contexts/AuthContext";

export const Login = () => {
  // const [emailAddress, setEmailAddress] = useState("");
  // const [password, setPassword] = useState("");
  const [isShowPass, setIsShowPass] = useState(false);

  const { email, setEmail, password, setPassword, signInEmail, signInGoogle } =
    useAuthContext();

  // const [signInWithGoogle, setSignInWithGoogle] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/home");
      } else {
        console.log("User not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = async (e) => {
    e.preventDefault();
    signInGoogle(db, auth, googleProvider);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    signInEmail(auth, email, password);
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <button type="submit" className="btn m-2 btn-primary w-100">
              Login
            </button>
            <button
              onClick={handleLoginWithGoogle}
              className="btn m-2 btn-success w-100"
            >
              Login With Google
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
