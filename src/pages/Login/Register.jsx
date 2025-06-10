import React from "react";
import { useTheme } from "../../contexts/AuthContext";
import { BackButton } from "../../components/ui/button/Back";
import { BsTruck } from "react-icons/bs";
import { FaRegBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Register() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();


  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <BackButton navigateTo="/login" />
          <h1 className={`text-2xl font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Escolha seu perfil</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/register/driver")}
            className={`group p-6 rounded-xl transition-all duration-200
              ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50"
              } shadow-sm hover:shadow-md cursor-pointer`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`p-4 rounded-full transition-colors duration-200
                ${
                  darkMode
                    ? "bg-blue-500/10 group-hover:bg-blue-500/20"
                    : "bg-blue-50 group-hover:bg-blue-100"
                }`}
              >
                <BsTruck
                  className={`${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  size={40}
                />
              </div>
              <div>
                <h2
                  className={`text-lg font-medium mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Motorista
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Encontre e negocie as melhores opções de fretes em todo o
                  Brasil
                </p>
              </div>
            </div>
          </button>

          {/* Card do Cliente */}
          <button
            onClick={() => navigate("/register/client")}
            className={`group p-6 rounded-xl transition-all duration-200
              ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50"
              } shadow-sm hover:shadow-md cursor-pointer`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className={`p-4 rounded-full transition-colors duration-200
                ${
                  darkMode
                    ? "bg-purple-500/10 group-hover:bg-purple-500/20"
                    : "bg-purple-50 group-hover:bg-purple-100"
                }`}
              >
                <FaRegBuilding
                  className={`${
                    darkMode ? "text-purple-400" : "text-purple-500"
                  }`}
                  size={40}
                />
              </div>
              <div>
                <h2
                  className={`text-lg font-medium mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Cliente
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Anuncie seus fretes e encontre motoristas de forma rápida e
                  segura
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
