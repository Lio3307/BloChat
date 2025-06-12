import { useState } from "react";
import { Link } from "react-router-dom";



export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isShowPass, setIsShowPass] = useState(false);

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h3 className="text-center mb-4">Register</h3>
          <form>
            {/* Name */}
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
                  onChange={() => setIsShowPass(showPass => !showPass)}
                />
                <label htmlFor="checkboxPass" className="form-check-label">
                  Show Password
                </label>

                <p>Already have account? <Link to="/">Login Here!!</Link> </p>
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
