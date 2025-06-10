import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../../contexts/AuthContext";

function Loading({ isOpen }) {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`max-w-sm w-full mx-4 rounded-lg p-6 shadow-xl 
              ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <svg
                  className={`animate-spin h-10 w-10 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p
                className={`text-center font-subtitle ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                } mb-2`}
              >
                Carregando...
              </p>
              <p
                className={`text-center text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Por favor, aguarde um momento
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Loading;
