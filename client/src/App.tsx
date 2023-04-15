import React from "react";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/Signin";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route element={<Dashboard />} path="/" />
          <Route element={<SignIn />} path="/signin" />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
