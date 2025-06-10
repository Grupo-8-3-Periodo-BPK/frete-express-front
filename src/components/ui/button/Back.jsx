import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/AuthContext";

export const BackButton = ({message, navigateTo}) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <button
      onClick={() => navigate(navigateTo || -1)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
        ${
          darkMode
            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        } shadow-sm hover:shadow cursor-pointer`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      {message || "Voltar"}
    </button>
  );
}

