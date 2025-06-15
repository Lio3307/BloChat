import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { Profile } from "./components/Profile";
import { auth } from "./firebase/config";
import { NavBar } from "./components/NavBar";

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
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </>
  );
}

export default App;
