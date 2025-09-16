import React, { useEffect, useState } from "react";
import { auth, provider, db,ADMIN_EMAIL } from "../firebase";
import { useNavigate } from "react-router-dom";
import AdminPage from "./admin";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Serbar() {
const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const provider= new GoogleAuthProvider();

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === ADMIN_EMAIL) {
        navigate("/admin"); // go to admin page
      } else {
        navigate("/"); // go to normal home page
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="head">
      <img src="./pic.png" alt="Site Logo" className="site-logo" />
      <h1>CampusBite</h1>

      {user ? (
        <button onClick={() => navigate("/profile")}>
          {user.displayName || "Profile"}
        </button>
      ) : (
        <button onClick={login}>Log in</button>
        
      )}
    </div>
  );
}