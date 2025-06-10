import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/index";
import { useTheme } from "../../contexts/AuthContext";

export default function AppLayout() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Header />
      <div className="pt-16"><Outlet /></div>
    </div>
  );
}
