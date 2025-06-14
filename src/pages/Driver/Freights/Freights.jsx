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
import Alert from "../../../components/ui/modal/Alert";
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
  const [forceUpdate, setForceUpdate] = useState(0); // Estado para forçar atualização
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (user.user_id) {
        const response = await getVehiclesByUser(user.user_id);
        setVehicles(response || []);
      } else setVehicles([]);
    };
    fetchVehicles();
  }, [user]);

  useEffect(() => {
    const fetchContracts = async () => {
      if (user.user_id) {
        try {
          const response = await getContractsByDriver(user.user_id);
          setContracts(response || []);
        } catch (error) {
          setContracts([]);
        }
      } else setContracts([]);
    };
    fetchContracts();
  }, [user, forceUpdate]);

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
    if (typeof value !== "number") return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    // Adiciona um fuso horário para evitar problemas de data off-by-one
    return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR");
  };

  // Verifica se o usuário já se candidatou a este frete
  const isApplied = (freightId) => {
    // Converte para string para garantir a comparação correta
    const freightIdStr = String(freightId);

    return contracts.some((contract) => {
      // Verifica todas as possíveis propriedades que podem conter o ID do frete
      const contractFreightId =
        contract.freight_id ||
        contract.freightId ||
        (contract.freight && contract.freight.id) ||
        null;

      if (contractFreightId) {
        const contractFreightIdStr = String(contractFreightId);
        return contractFreightIdStr === freightIdStr;
      }
      return false;
    });
  };

  const showAlert = (message, type) => {
    setAlert({message, type});
    setIsAlertOpen(true);
  };

  const handleApply = async (freightId) => {
    // Verifica se já existe um contrato para este frete
    if (isApplied(freightId)) {
      return;
    }

    const freight = freights.find((freight) => freight.id === freightId);
    const contractData = {
      freight_id: freightId,
      driver_id: user.user_id,
      client_id: freight.userId,
      vehicle_id: vehicles.length > 0 ? vehicles[0].id : null,
      agreed_value: 0,
      pickup_date: freight.initial_date,
      delivery_date: freight.final_date,
    };

    try {
      const result = await createContract(contractData);

      // Atualiza a lista de contratos após criar um novo
      const updatedContracts = await getContractsByDriver(user.user_id);
      setContracts(updatedContracts || []);

      // Força a atualização da interface
      setFreights([...freights]);
      setForceUpdate((prev) => prev + 1);

      // Alerta para confirmar a candidatura
      showAlert("Candidatura enviada com sucesso!", "success");
    } catch (error) {
      showAlert("Erro ao enviar candidatura. Tente novamente.", "error");
    }
  };

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
    <div
      className={`min-h-screen w-full p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Fretes Disponíveis
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Encontre e candidate-se aos melhores fretes da sua região
          </p>
        </div>

        {/* Filters and Search */}
        <div
          className={`rounded-lg p-6 mb-6 ${darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 md:w-auto w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome do frete, origem, destino..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              <Clock className="inline w-4 h-4 mr-1" />
              Atualizado agora
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
              }`}
          >
            <h3
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              Fretes Disponíveis
            </h3>
            <p
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                }`}
            >
              {freights.length}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
              }`}
          >
            <h3
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              Candidaturas Enviadas
            </h3>
            <p
              className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"
                }`}
            >
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
                className={`rounded-lg p-6 transition-all ${darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white border border-gray-200 hover:shadow-lg"
                  }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3
                          className={`text-lg font-semibold mb-1 ${darkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                          {freight.name}
                        </h3>
                      </div>
                    </div>
                    <div
                      className={`flex items-center mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      <MapPin
                        className={`w-4 h-4 mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"
                          }`}
                      />
                      <span className="text-sm">
                        {freight.origin_city}, {freight.origin_state} →{" "}
                        {freight.destination_city}, {freight.destination_state}
                      </span>
                    </div>
                    <div
                      className={`flex items-center mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      <Truck
                        className={`w-4 h-4 mr-2 ${darkMode ? "text-green-400" : "text-green-500"
                          }`}
                      />
                      <span className="text-sm">Peso: {freight.weight} kg</span>
                    </div>
                  </div>

                  {/* Dates & Actions */}
                  <div className="flex flex-col justify-between items-start lg:items-end">
                    <div className="flex flex-col lg:text-right w-full">
                      <div className="mb-4">
                        <div
                          className={`flex items-center text-sm mb-1 lg:justify-end ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          <Calendar className="w-4 h-4 mr-1" /> Coleta
                        </div>
                        <div
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {formatDate(freight.initial_date)}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div
                          className={`flex items-center text-sm mb-1 lg:justify-end ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          <Calendar className="w-4 h-4 mr-1" /> Entrega
                        </div>
                        <div
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {formatDate(freight.final_date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full mt-4 lg:mt-0 ">
                      <button
                        onClick={() =>
                          navigate(`/driver/freights/${freight.id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer px-4 py-2 text-center rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> Ver Detalhes
                      </button>
                      <button
                        onClick={() => handleApply(freight.id)}
                        disabled={isApplied(freight.id)}
                        className={`px-4 py-2 text-center rounded-lg font-medium cursor-pointer transition-colors flex items-center justify-center gap-2 ${isApplied(freight.id)
                            ? "bg-green-600 text-white !cursor-not-allowed"
                            : darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
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
            <div className={`text-center py-16 ${darkMode ? "" : "bg-white rounded-lg border border-gray-200"}`}>
              <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Nenhum frete encontrado
              </h3>
              <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Tente ajustar sua busca ou verifique novamente mais tarde.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >Mostrando {filteredFreights.length} de {freights.length} fretes
          </div>
          <div className="flex space-x-2">
            <button className={`px-3 py-1 rounded transition-colors ${darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className={`px-3 py-1 rounded transition-colors ${darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
      <Alert
        message={alert.message}
        type={alert.type}
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
      />
    </div>
  );
};

export default DriverFreights;