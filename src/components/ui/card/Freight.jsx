import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../../contexts/AuthContext";

function FreightCard({ freight }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme(); // false quando em modo claro

  const handleNavigate = () => {
    // Define a rota base de acordo com o tipo de usuário
    const basePath = {
      ADMIN: "/admin/freights",
      CLIENT: "/client/freight",
      DRIVER: "/driver/freights",
    }[user.role] || "/freights";

    navigate(`${basePath}/${freight.id}`);
  };

  // Configurações de estilo para os diferentes status do frete
  const statusConfig = {
    AVAILABLE: {
      text: "Disponível",
      // No modo claro: texto verde escuro em um fundo verde claro
      color: darkMode
        ? "text-green-400 bg-green-900/20"
        : "text-green-600 bg-green-100",
    },
    CLOSED: {
      text: "Fechado",
      // No modo claro: texto vermelho em um fundo vermelho claro
      color: darkMode
        ? "text-red-400 bg-red-900/20"
        : "text-red-500 bg-red-100",
    },
  };

  // Define o status a ser exibido, com um fallback para status não mapeados
  const statusInfo = statusConfig[freight.status] || {
    text: freight.status,
    // No modo claro: texto cinza em um fundo cinza claro
    color: darkMode
      ? "text-gray-400 bg-gray-900/20"
      : "text-gray-500 bg-gray-100",
  };

  // --- Renderização do Componente ---

  return (
    <div
      onClick={handleNavigate}
      className={`
        rounded-xl p-4 shadow-sm transition-all cursor-pointer 
        hover:shadow-md 
        ${darkMode ? "bg-gray-800" : "bg-white"} 
      `}
    >
      {/* Cabeçalho do Card: Nome e Status */}
      <div className="flex justify-between items-start mb-3">
        <h3
          className={`
            font-medium 
            ${darkMode ? "text-white" : "text-gray-900"} 
          `}
        >
          {freight.name}
        </h3>
        <span
          className={`
            px-2 py-1 rounded-full text-xs font-semibold 
            ${statusInfo.color} 
          `}
        >
          {statusInfo.text}
        </span>
      </div>

      {/* Corpo do Card: Detalhes do Frete */}
      <div className="space-y-2 text-sm mt-4">
        {/* Origem */}
        <div
          className={`
            flex items-center gap-2 
            ${darkMode ? "text-gray-300" : "text-gray-600"} 
          `}
        >
          <span className="opacity-70">Origem:</span>
          <span>
            {freight.origin_city} - {freight.origin_state}
          </span>
        </div>

        {/* Destino */}
        <div
          className={`
            flex items-center gap-2 
            ${darkMode ? "text-gray-300" : "text-gray-600"} 
          `}
        >
          <span className="opacity-70">Destino:</span>
          <span>
            {freight.destination_city} - {freight.destination_state}
          </span>
        </div>

        {/* Data */}
        <div
          className={`
            flex items-center gap-2 
            ${darkMode ? "text-gray-300" : "text-gray-600"} 
          `}
        >
          <span className="opacity-70">Data:</span>
          <span>{new Date(freight.initial_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default FreightCard;