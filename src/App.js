import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Serbar from "./components/bar";
import MenuBar from "./components/menubar";
import Profile from "./components/profile";
import AdminPage from "./components/admin";
import AdminWrapper from "./components/AdminWrapper";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={
            <>
              <Serbar />
              <MenuBar />
            </>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPage />}/>
        <Route path="/menubar" element={<MenuBar />}/>
         <Route
          path="/admin/*"
          element={
            <AdminWrapper>
              <AdminPage />
            </AdminWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
