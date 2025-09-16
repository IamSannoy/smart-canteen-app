import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function AdminWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email === "admin@example.com") {
        // Admin logged in ✅
        if (!location.pathname.startsWith("/admin")) {
          // Admin left admin area → logout
          signOut(auth).then(() => {
            navigate("/login"); // Redirect to login
          });
        }
      }
    });

    return () => unsubscribe();
  }, [location, navigate]);

  return <>{children}</>;
}
