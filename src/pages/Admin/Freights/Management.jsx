import React, { useState, useEffect } from "react";
import { useTheme } from "../../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import FreightCard from "../../../components/ui/card/Freight.jsx";
import { BackButton } from "../../../components/ui/button/Back.jsx";
import { getFreights } from "../../../services/freight.js";
import Loading from "../../../components/ui/modal/Loading.jsx";

function ManageAllFreights() {
  const { darkMode } = useTheme();
  const [freights, setFreights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [peso, setPeso] = useState("todos");
  const [categoria, setCategoria] = useState("todos");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreights = async () => {
      try {
        const response = await getFreights();
        if (response.status === 200) {
          setFreights(response.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response.data.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreights();
  }, []);

  // Filtros aplicados
  const filteredFreights = freights.filter((freight) => {
    const matchSearch =
      search === "" ||
      freight.produto?.toLowerCase().includes(search.toLowerCase()) ||
      freight.cliente?.toLowerCase().includes(search.toLowerCase());
    const matchPeso =
      peso === "todos" ||
      (peso === "ate1000" && freight.peso <= 1000) ||
      (peso === "ate5000" && freight.peso > 1000 && freight.peso <= 5000) ||
      (peso === "acima10000" && freight.peso > 10000);
    const matchCategoria =
      categoria === "todos" ||
      (categoria === "caminhao" && freight.categoria === "Caminhão");
    return matchSearch && matchPeso && matchCategoria;
  });

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
            
            {/* Filter Skeleton */}
            <div className="w-full h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
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
      <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Erro ao carregar fretes</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <BackButton message={"Voltar"} />
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Fretes
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Frete
          </button>
        </div>

        {/* Filtros */}
        <div className={`mb-8 p-6 rounded-2xl border backdrop-blur-sm ${
          darkMode 
            ? "bg-gray-900/50 border-gray-800" 
            : "bg-white/80 border-gray-200 shadow-sm"
        }`}>
          <div className="space-y-6">
            {/* Busca */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Pesquisar por produto ou cliente..."
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
              {/* Filtro Peso */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Filtrar por peso
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "todos", label: "Todos" },
                    { value: "ate1000", label: "Até 1.000 kg" },
                    { value: "ate5000", label: "Até 5.000 kg" },
                    { value: "acima10000", label: "A partir de 10.000 kg" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                        peso === option.value
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
                        name="peso"
                        value={option.value}
                        checked={peso === option.value}
                        onChange={() => setPeso(option.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro Categoria */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Filtrar por categoria
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "todos", label: "Todos" },
                    { value: "caminhao", label: "Caminhão" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                        categoria === option.value
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
                        name="categoria"
                        value={option.value}
                        checked={categoria === option.value}
                        onChange={() => setCategoria(option.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {filteredFreights.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Nenhum frete encontrado
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
              Tente ajustar os filtros ou criar um novo frete
            </p>
            <button
              onClick={() => navigate("/client/freight/create")}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl
                bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Primeiro Frete
            </button>
          </div>
        ) : (
          <>
            <div className={`flex items-center justify-between mb-6`}>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {filteredFreights.length} {filteredFreights.length === 1 ? 'frete encontrado' : 'fretes encontrados'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreights.map((freight) => (
                <FreightCard key={freight.id} freight={freight} />
              ))}
            </div>
          </>
        )}
        
        <Loading isOpen={loading} />
      </div>
    </div>
  );
}

export default ManageAllFreights;