import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage"; // Adjust paths based on your folder structure
import Registration from "./components/Registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect empty root URL directly to the Login Page */}
        <Route path="/" element={<Navigate to="/LoginPage" />} />
        
        {/* Define paths that match your <Link to="..."> values */}
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;