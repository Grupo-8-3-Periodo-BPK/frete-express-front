import React, { useState, useEffect } from "react";
import { useTheme, useAuth } from "../../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import FreightCard from "../../../components/ui/card/Freight.jsx";
import { BackButton } from "../../../components/ui/button/Back.jsx";
import { getFreights } from "../../../services/freight.js";
import Loading from "../../../components/ui/modal/Loading.jsx";

function Freights() {
  const { darkMode } = useTheme();
  const { user } = useAuth(); // Obter o usuário logado
  const [freights, setFreights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, AVAILABLE, CLOSED
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreights = async () => {
      if (!user?.id) return; // Não fazer nada se não houver ID de usuário

      try {
        const allFreights = await getFreights();
        // Filtra para mostrar apenas os freights do cliente logado
        const clientFreights = allFreights.filter((f) => f.userId === user.id);
        setFreights(clientFreights);
      } catch (err) {
        setError(err.message || "Falha ao carregar os fretes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreights();
  }, [user]); // Depende do usuário

  // Filtros aplicados
  const filteredFreights = freights.filter((freight) => {
    const matchSearch =
      search === "" ||
      freight.name?.toLowerCase().includes(search.toLowerCase()) ||
      freight.origin_city?.toLowerCase().includes(search.toLowerCase()) ||
      freight.destination_city?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || freight.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`w-24 h-8 rounded animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
              </div>
              <div className={`w-32 h-10 rounded-lg animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
            </div>

            {/* Filter Skeleton */}
            <div className={`w-full h-16 rounded-xl animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-48 rounded-xl animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-900/20' : 'bg-red-100'}`}>
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Erro ao carregar fretes
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Fretes
              </h1>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Gerencie seus fretes de forma simples e eficiente
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/client/freight/create")}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all
             bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Novo Frete
          </button>
        </div>

        {/* Filtros */}
        <div
          className={`mb-8 p-6 rounded-2xl border backdrop-blur-sm ${
            darkMode
              ? "bg-gray-800 border-gray-800"
              : "bg-white/80 border-gray-200 shadow-sm"
          }`}
        >
          <div className="space-y-6">
            {/* Busca */}
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Pesquisar por título, origem ou destino..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Filtro Status */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Filtrar por status
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "ALL", label: "Todos" },
                    { value: "AVAILABLE", label: "Disponível" },
                    { value: "CLOSED", label: "Fechado" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                        statusFilter === option.value
                          ? darkMode
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                          : darkMode
                          ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={statusFilter === option.value}
                        onChange={() => setStatusFilter(option.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {filteredFreights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreights.map((freight) => (
              <FreightCard key={freight.id} freight={freight} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Nenhum frete encontrado
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } mb-6`}
            >
              Tente ajustar seus filtros ou crie um novo frete.
            </p>
          </div>
        )}

        <Loading isOpen={loading} />
      </div>
    </div>
  );
}

export default Freights;