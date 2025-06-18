import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { Profile } from "./components/Profile";
import { NavBar } from "./components/NavBar";
import { Home } from "./Pages/Home";
import { TextPost } from "./components/TextPost";
import { useAuthContext } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { ViewDetail } from "./Pages/ViewDetail";
import { YourPost } from "./Pages/YourPost";
import { EditPost } from "./Pages/EditPost";

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
      {userDetail && <NavBar />}
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
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/create-post" element={<TextPost />} />
        <Route path="/view-detail/:id" element={<ViewDetail/>}/>
        <Route path="/your-post" element={<YourPost/>} />
        <Route path="/edit-post/:id" element={<EditPost/>} />
      </Routes>
    </>
  );
}

export default App;
