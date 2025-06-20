import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../../contexts/AuthContext";

function FreightCard({ freight }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const handleNavigate = () => {
    // A navegação é baseada no Roteamento que já existe
    const basePath =
      {
        ADMIN: "/admin/freights",
        CLIENT: "/client/freight",
        DRIVER: "/driver/freights",
      }[user.role] || "/freights";

    navigate(`${basePath}/${freight.id}`);
  };

  const statusConfig = {
    AVAILABLE: {
      text: "Disponível",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    },
    CLOSED: {
      text: "Fechado",
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    },
  };

  const statusInfo = statusConfig[freight.status] || {
    text: freight.status,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  };

  return (
    <div
      onClick={handleNavigate}
      className={`rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer 
        ${darkMode ? "bg-gray-800" : "bg-white"}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <h3
          className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {freight.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
        >
          {statusInfo.text}
        </span>
      </div>

      <div className="space-y-2 text-sm mt-4">
        <div
          className={`flex items-center gap-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <span className="opacity-70">Origem:</span>
          <span>
            {freight.origin_city} - {freight.origin_state}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <span className="opacity-70">Destino:</span>
          <span>
            {freight.destination_city} - {freight.destination_state}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <span className="opacity-70">Data:</span>
          <span>{new Date(freight.initial_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default FreightCard;
