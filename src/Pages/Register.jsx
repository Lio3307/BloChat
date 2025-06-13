import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { setDoc, doc } from "firebase/firestore";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [isShowPass, setIsShowPass] = useState(false);
  const navigate = useNavigate()

  
  
  const handleRegister = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (trimmedName === "" || trimmedEmail === "" || trimmedPassword === "") {
      alert("Input fields cannot be empty or only spaces!");
      return;
    }
    if(password.length < 6) {
      alert("Create password at least 6 length!!")
      return;
    }
    alert("Registering...")
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if(user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          fullName: name
        })
      }
      alert("Register Success!!")
      navigate("/")
    } catch (error) {
      console.error(error)
    } 
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h3 className="text-center mb-4">Register</h3>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Create Password
              </label>
              <input
                type={isShowPass ? "text" : "password"}
                id="password"
                className="form-control"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  id="checkboxPass"
                  className="form-check-input"
                  onChange={() => setIsShowPass((showPass) => !showPass)}
                />
                <label htmlFor="checkboxPass" className="form-check-label">
                  Show Password
                </label>


                <p className="my-2">
                  Already have account? <Link to="/">Login Here!!</Link>{" "}
                </p>
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
