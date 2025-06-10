import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Truck,
  Clock,
  CheckCircle,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFreights } from "../../../services/freight";
import { useTheme, useAuth } from "../../../contexts/AuthContext";
import { createContract } from "../../../services/contract";
import { getVehiclesByUser } from "../../../services/vehicle";
import { getContractsByDriver } from "../../../services/contract";

const DriverFreights = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // O filtro por urgência foi removido pois o dado não existe no objeto de frete
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [freights, setFreights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await getVehiclesByUser(user.user_id);
      setVehicles(response || []);
    };
    fetchVehicles();
  }, [user]);

  useEffect(() => {
    const fetchContracts = async () => {
      const response = await getContractsByDriver(user.user_id);
      setContracts(response || []);
    };
    fetchContracts();
  }, [user]);

  
  useEffect(() => {
    const fetchFreights = async () => {
      try {
        setLoading(true);
        const response = await getFreights();
        setFreights(response.data || []);
      } catch (err) {
        setError(
          "Não foi possível carregar os fretes. Tente novamente mais tarde."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFreights();
  }, []);

  const filteredFreights = freights.filter((freight) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      freight.name.toLowerCase().includes(searchTermLower) ||
      freight.origin_city.toLowerCase().includes(searchTermLower) ||
      freight.destination_city.toLowerCase().includes(searchTermLower);
    
    return matchesSearch;
  });

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    // Adiciona um fuso horário para evitar problemas de data off-by-one
    return new Date(dateString + 'T00:00:00').toLocaleDateString("pt-BR");
  };

  const handleApply = async (freightId) => {

    const freight = freights.find((freight) => freight.id === freightId);
    const contractData = {
      freight_id: freightId,
      driver_id: user.user_id,
      client_id: freight.userId,
      vehicle_id: vehicles[0].id,
      agreed_value: 0,
      pickup_date: freight.initial_date,
      delivery_date: freight.final_date
    };
    await createContract(contractData);
  };

  const isApplied = (freightId) => contracts.some((contract) => contract.freight_id === freightId);

  // ao candidatar-se ta criando sempre varios contratos, mas nao ta atualizando o contrato existente

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
        <p>Carregando fretes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-medium">Erro ao carregar</h3>
          <p className="mt-2 text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full ${darkMode ? "bg-gray-900" : "bg-gray-100"} text-white p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fretes Disponíveis</h1>
          <p className="text-gray-400">
            Encontre e candidate-se aos melhores fretes da sua região
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 md:w-auto w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome do frete, origem, destino..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-400">
              <Clock className="inline w-4 h-4 mr-1" />
              Atualizado agora
            </div>
          </div>
        </div>

        {/* Stats - Adaptadas para os dados disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Fretes Disponíveis</h3>
            <p className="text-2xl font-bold text-white">{freights.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Candidaturas Enviadas</h3>
            <p className="text-2xl font-bold text-blue-400">
              {contracts.length}
            </p>
          </div>
        </div>

        {/* Freight Cards */}
        <div className="space-y-6">
          {filteredFreights.length > 0 ? (
            filteredFreights.map((freight) => (
              <div
                key={freight.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {freight.name}
                        </h3>
                        {/* Informações como client_name e posted_time não existem */}
                      </div>
                      {/* Urgência removida */}
                    </div>

                    <div className="flex items-center text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                      <span className="text-sm">
                        {freight.origin_city}, {freight.origin_state} →{" "}
                        {freight.destination_city}, {freight.destination_state}
                      </span>
                      {/* Distância não existe */}
                    </div>

                    <div className="flex items-center text-gray-300 mb-3">
                      <Truck className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-sm">
                        Peso: {freight.weight} kg
                      </span>
                      {/* Outras infos como cargo_type e vehicle_type não existem */}
                    </div>
                  </div>

                  {/* Dates & Actions */}
                  <div className="flex flex-col justify-between items-start lg:items-end">
                     <div className="flex flex-col lg:text-right w-full">
                        <div className="mb-4">
                            <div className="flex items-center text-gray-400 text-sm mb-1 lg:justify-end">
                                <Calendar className="w-4 h-4 mr-1" />
                                Coleta
                            </div>
                            <div className="text-white font-medium">
                                {formatDate(freight.initial_date)}
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center text-gray-400 text-sm mb-1 lg:justify-end">
                                <Calendar className="w-4 h-4 mr-1" />
                                Entrega
                            </div>
                            <div className="text-white font-medium">
                                {formatDate(freight.final_date)}
                            </div>
                        </div>
                     </div>
                    <div className="flex flex-col gap-2 w-full mt-4 lg:mt-0">
                      <button
                        onClick={() =>
                          navigate(`/driver/freights/${freight.id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-center rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => handleApply(freight.id)}
                        disabled={isApplied(freight.id)}
                        className={`px-4 py-2 text-center rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          isApplied(freight.id)
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                      >
                        {isApplied(freight.id) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                        {isApplied(freight.id)
                          ? "Candidatura Enviada"
                          : "Candidatar-se"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold">Nenhum frete encontrado</h3>
              <p className="text-gray-400 mt-2">
                Tente ajustar sua busca ou verifique novamente mais tarde.
              </p>
            </div>
          )}
        </div>

        {/* Pagination (funcionalidade a ser implementada) */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-400">
            Mostrando {filteredFreights.length} de {freights.length} fretes
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverFreights;