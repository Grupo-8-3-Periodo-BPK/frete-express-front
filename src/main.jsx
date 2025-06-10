import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import App from "./App.jsx";
import "./index.css";
import "./styles/fonts.css";

const theme = localStorage.getItem("theme");
if (
  theme === "dark" ||
  (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
  document.body.classList.add("dark-mode");
  document.body.dataset.theme = "dark";

  // Forçar estilos no DOM
  const style = document.createElement("style");
  style.textContent = `
    html.dark, body.dark-mode, [data-theme="dark"] {
      background-color: #1f2937 !important;
      color: white !important;
    }
    
    html.dark input, html.dark textarea, html.dark select,
    body.dark-mode input, body.dark-mode textarea, body.dark-mode select {
      background-color: #374151 !important;
      color: white !important;
      border-color: #4B5563 !important;
    }
    
    html.dark #freight-form-container, body.dark-mode #freight-form-container {
      background-color: #1f2937 !important;
    }
    
    html.dark #freight-form, body.dark-mode #freight-form {
      background-color: #1f2937 !important;
      color: white !important;
    }
  `;
  document.head.appendChild(style);
} else {
  document.documentElement.classList.remove("dark");
  document.body.classList.remove("dark-mode");
  document.body.dataset.theme = "light";
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);