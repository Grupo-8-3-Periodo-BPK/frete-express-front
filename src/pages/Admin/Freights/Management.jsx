import React, { useState, useEffect } from "react";
import { useTheme, useAuth } from "../../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import FreightCard from "../../../components/ui/card/Freight.jsx";
import { BackButton } from "../../../components/ui/button/Back.jsx";
import { getFreights } from "../../../services/freight.js";
import Loading from "../../../components/ui/modal/Loading.jsx";

function ManageAllFreights() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [freights, setFreights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // Filtros ajustados
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreights = async () => {
      try {
        const data = await getFreights();
        setFreights(data);
      } catch (err) {
        setError(err.message || "Falha ao carregar os fretes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreights();
  }, []);

  const filteredFreights = freights.filter((freight) => {
    const matchSearch =
      search === "" ||
      freight.origin_city?.toLowerCase().includes(search.toLowerCase()) ||
      freight.destination_city?.toLowerCase().includes(search.toLowerCase()) ||
      freight.id?.toString().includes(search);

    const matchStatus =
      statusFilter === "ALL" || freight.status === statusFilter; // Corrigido para freight.status

    return matchSearch && matchStatus;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Erro ao carregar fretes
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
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
            <BackButton />
            <div>
              <h1
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Gerenciamento de Fretes
              </h1>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Visualize todos os fretes da plataforma.
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div
          className={`mb-8 p-6 rounded-2xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar por ID, origem ou destino..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-4 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

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
                        ? "bg-blue-600 border-blue-600 text-white"
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
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
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
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Nenhum frete encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar seus filtros de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAllFreights;
