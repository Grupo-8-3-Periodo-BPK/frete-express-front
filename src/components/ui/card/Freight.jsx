import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../../contexts/AuthContext";

function FreightCard({ freight }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const handleNavigate = () => {
    if (!user || !user.role) {
      console.warn(
        "User role not defined, cannot navigate to freight details."
      );
      return;
    }
    switch (user.role) {
      case "ADMIN":
        navigate(`/admin/freights/${freight.id}`);
        break;
      case "CLIENT":
        navigate(`/client/freights/${freight.id}`);
        break;
      case "DRIVER":
        navigate(`/driver/freights/${freight.id}`);
        break;
      default:
        navigate(`/freights/${freight.id}`);
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className={`rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer 
        ${darkMode ? "bg-gray-800" : "bg-white"}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
          {freight.name}
        </h3>
        <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {new Date(freight.initial_date).toLocaleDateString()}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          <span className="opacity-70">Origem:</span>
          <span>
            {freight.origin_city} - {freight.origin_state}
          </span>
        </div>
        <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          <span className="opacity-70">Destino:</span>
          <span>
            {freight.destination_city} - {freight.destination_state}
          </span>
        </div>
        <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          <span className="opacity-70">Peso:</span>
          <span>{freight.weight}kg</span>
        </div>
      </div>
    </div>
  );
}

export default FreightCard;
