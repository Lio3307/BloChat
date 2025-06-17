import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { Profile } from "./components/Profile";
import { auth } from "./firebase/config";
import { NavBar } from "./components/NavBar";
import { Home } from "./Pages/Home";
import { TextPost } from "./components/TextPost";

function App() {

  const  [rememberUser, setRememberUser] = useState("")

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setRememberUser(user)
    })
  })

  return (
    <>


      <NavBar/>
      <Routes>
        <Route path="/" element={rememberUser ? <Navigate to={"/profile"}/> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={rememberUser ? <Navigate to={"/home"}/> : <Register />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/create-post" element={<TextPost/>}/>
      </Routes>
    </>
  );
}

export default App;
