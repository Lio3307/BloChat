import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { Profile } from "./components/Profile";
import { NavBar } from "./components/NavBar";
import { Home } from "./Pages/Home";
import { TextPost } from "./components/TextPost";
import { useAuthContext } from "./contexts/AuthContext";

function App() {
  const { loading, userDetail } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (userDetail) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }
  }, [loading, userDetail]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={userDetail ? <Navigate to={"/home"} /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={userDetail ? <Navigate to={"/home"} /> : <Register />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-post" element={<TextPost />} />
      </Routes>
    </>
  );
}

export default App;
