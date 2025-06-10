import React from "react";
import { useTheme } from "../../../contexts/AuthContext";
import { motion } from "motion/react";
function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={darkMode ? {backgroundColor: "#364153"} : {backgroundColor: "#d1d5dc"}}
      transition={{duration: 0.2, ease: "easeInOut"}}
      className="p-2 rounded-full text-gray-800 dark:text-white focus:outline-none cursor-pointer"
      style={{
        backgroundColor: darkMode ? "#111827" : "#f3f4f6",
        color: darkMode ? "#f3f4f6" : "#111827",
        border: "1px solid",
        borderColor: darkMode ? "#364153" : "#d1d5dc",
      }}
      aria-label={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {darkMode ? (
        // Ícone do sol para modo claro
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Ícone da lua para modo escuro
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
      <span className="sr-only">{darkMode ? "Modo claro" : "Modo escuro"}</span>
    </motion.button>
  );
}

export default ThemeToggle;
