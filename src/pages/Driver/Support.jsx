import React, { useState } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";

function SupportPage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } py-12 px-6 transition-colors duration-300`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center">
          <h1 className={`text-3xl sc-380:text-2xl relative inline-block font-bold mb-4 text-center ${
              darkMode ? "text-white" : "text-gray-800"}`}
            >Suporte ao Cliente
          </h1>
        </div>

        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded mb-6 text-sm animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white px-4 py-3 rounded mb-6 text-sm animate-pulse">
            {success}
          </div>
        )}

        <form className="space-y-6">
          <div>
            <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Seu email
            </label>
            <div className={`flex items-center gap-2 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-300"} p-3 rounded-lg`}>
              <span className={`${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                {user.email}
              </span>
            </div>
          </div>

          <div>
            <label
              className={`block mb-2 text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Descreva o problema
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              rows="4"
              placeholder="Nos conte o que aconteceu..."
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !description}
            className={`w-full p-3 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
              loading || !description
                ? "bg-gray-400 cursor-not-allowed"
                : darkMode
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-400"
                : "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400"
            } text-white shadow-sm hover:shadow-md`}
          >
            {loading ? "Enviando..." : "Enviar Email"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SupportPage;
