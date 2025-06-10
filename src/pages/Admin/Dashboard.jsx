import React, { useEffect, useState } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoPeopleSharp } from "react-icons/io5";
import { FaCar, FaHandshake, FaPlus, FaTruck } from "react-icons/fa";

function Dashboard() {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [stats] = useState({
    fretesAtivos: 12,
    motoristasDisponiveis: 8,
    clientesAtivos: 24,
  });

  const atividadesRecentes = [
    {
      id: 1,
      tipo: "Frete",
      descricao: "Novo frete #F2305 adicionado",
      tempo: "Há 30 min",
    },
    {
      id: 2,
      tipo: "Cliente",
      descricao: "Cliente 'Indústrias ABC' cadastrado",
      tempo: "Há 2h",
    },
    {
      id: 3,
      tipo: "Motorista",
      descricao: "Motorista João reportou atraso",
      tempo: "Há 3h",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} p-4 sm:p-6`}>
      <div className={`max-w-5xl mx-auto ${darkMode ? "bg-gray-800" : "bg-white border border-gray-300"} rounded-xl shadow-sm p-4 sm:p-6`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Bem-vindo(a), {user?.name || "Administrador"}
            </p>
          </div>
          <button
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors w-full sm:w-auto text-center"
            onClick={handleLogout}
          >Sair
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Fretes Ativos
            </p>
            <h3 className="text-xl font-bold mt-1">{stats.fretesAtivos}</h3>
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Motoristas
            </p>
            <h3 className="text-xl font-bold mt-1">
              {stats.motoristasDisponiveis}
            </h3>
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Clientes
            </p>
            <h3 className="text-xl font-bold mt-1">{stats.clientesAtivos}</h3>
          </div>
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div
            className={`lg:col-span-2 ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50 border border-gray-200"
            } p-4 rounded-lg`}
          >
            <h2 className="text-lg font-medium mb-3">Perfil</h2>
            {user ? (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="opacity-70">Nome:</span>{" "}
                  {user.name || "Não disponível"}
                </p>
                <p>
                  <span className="opacity-70">Email:</span>{" "}
                  {user.email || "Não disponível"}
                </p>
                <p>
                  <span className="opacity-70">Função:</span>{" "}
                  {user.role === "CLIENT"
                    ? "Cliente"
                    : user.role === "DRIVER"
                    ? "Motorista"
                    : "Administrador"}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/admin/profile")}
                    className={`text-sm px-3 py-1.5 rounded ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Editar perfil
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm opacity-70">
                Informações do usuário não disponíveis.
              </p>
            )}
          </div>

          {/* Atividades Recentes */}
          <div
            className={`lg:col-span-3 ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50 border border-gray-200"
            } p-4 rounded-lg`}
          >
            <h2 className="text-lg font-medium mb-3">Atividades Recentes</h2>
            <div className="space-y-3">
              {atividadesRecentes.map((atividade) => (
                <div
                  key={atividade.id}
                  className={`text-sm p-2 rounded ${
                    darkMode ? "bg-gray-800/50" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-xs font-medium">
                      {atividade.tipo}
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {atividade.tempo}
                    </span>
                  </div>
                  <p className="mt-1">{atividade.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div
          className={`mt-6 ${
            darkMode ? "bg-gray-700/50" : "bg-gray-50 border border-gray-200"
          } p-4 rounded-lg`}
        >
          <h2 className="text-lg font-medium mb-3">Gerenciamento</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { label: "Ver Fretes", path: "/admin/freights", icon: <FaTruck className="text-2xl text-blue-400" /> },
              { label: "Usuários", path: "/admin/users", icon: <IoPeopleSharp className="text-2xl text-blue-400" /> },
              { label: "Veículos", path: "/admin/vehicles", icon: <FaCar className="text-2xl text-blue-400" /> },
              { label: "Contratos", path: "/admin/contracts", icon: <FaHandshake className="text-2xl text-blue-400" /> },
            ].map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`p-3 cursor-pointer text-sm font-medium rounded-lg transition-all flex flex-col items-center justify-center
                  ${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-white hover:bg-gray-100 border border-gray-200"
                  } shadow-sm hover:shadow`}
              >
                <span className="text-xl mb-1">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
