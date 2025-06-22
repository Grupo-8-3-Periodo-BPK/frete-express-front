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
  Send,
  Loader,
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
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [freights, setFreights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [applying, setApplying] = useState(null);
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [freightsData, contractsData, vehiclesData] = await Promise.all([
        getFreights("AVAILABLE"),
        user.user_id ? getContractsByDriver(user.user_id) : Promise.resolve([]),
        user.user_id ? getVehiclesByUser(user.user_id) : Promise.resolve([]),
      ]);
      setFreights(freightsData || []);
      setContracts(contractsData || []);
      setVehicles(vehiclesData || []);
    } catch (err) {
      setError(
        "Não foi possível carregar os dados. Tente novamente mais tarde."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const getApplicationStatus = (freightId) => {
    const contract = contracts.find((c) => c.freightId === freightId);
    return contract ? contract.status : null;
  };

  const handleApply = async (freight) => {
    if (getApplicationStatus(freight.id)) {
      return; // Já se candidatou
    }
    setApplying(freight.id);

    if (vehicles.length === 0) {
      showAlert(
        "Você precisa ter um veículo cadastrado para se candidatar.",
        "error"
      );
      setApplying(null);
      return;
    }

    const contractData = {
      freight_id: freight.id,
      driver_id: user.user_id,
      client_id: freight.userId,
      vehicle_id: vehicles[0].id,
      agreed_value: freight.price,
      pickup_date: freight.initial_date,
      delivery_date: freight.final_date,
    };

    try {
      await createContract(contractData);
      showAlert("Candidatura enviada com sucesso!", "success");
      // Atualiza os contratos para refletir a nova candidatura
      const updatedContracts = await getContractsByDriver(user.user_id);
      setContracts(updatedContracts || []);
    } catch (error) {
      showAlert("Erro ao enviar candidatura. Tente novamente.", "error");
    } finally {
      setApplying(null);
    }
  };

  const filteredFreights = freights.filter((freight) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      freight.name.toLowerCase().includes(searchTermLower) ||
      freight.origin_city.toLowerCase().includes(searchTermLower) ||
      freight.destination_city.toLowerCase().includes(searchTermLower)
    );
  });

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setIsAlertOpen(true);
  };

  const renderApplicationButton = (freight) => {
    const status = getApplicationStatus(freight.id);
    const isApplying = applying === freight.id;

    if (isApplying) {
      return (
        <button
          disabled
          className="w-full flex items-center justify-center bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Loader className="animate-spin w-5 h-5 mr-2" />
          Enviando...
        </button>
      );
    }

    if (status) {
      const statusText =
        {
          PENDING_CLIENT_APPROVAL: "Candidatura Enviada",
          REJECTED: "Proposta Rejeitada",
        }[status] || "Ver Contrato";

      const statusColor = status === "REJECTED" ? "bg-red-600" : "bg-gray-500";

      return (
        <button
          onClick={() => {if(statusText === "Candidatura Enviada") return; navigate("/driver/contracts")}}
          className={`w-full ${statusColor} cursor-pointer hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-colors`}
        >
          {statusText}
        </button>
      );
    }

    return (
      <button
        onClick={() => handleApply(freight)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        <Send className="w-4 h-4 mr-2" />
        Candidatar-se
      </button>
    );
  };

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
      className={`min-h-screen w-full p-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
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
          className={`rounded-lg p-6 mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 md:w-auto w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome do frete, origem, destino..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Fretes Disponíveis
            </h3>
            <p
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {freights.length}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Candidaturas Enviadas
            </h3>
            <p
              className={`text-2xl font-bold ${
                darkMode ? "text-blue-400" : "text-blue-600"
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
                className={`rounded-lg shadow-md flex flex-col justify-between transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700 hover:border-blue-500"
                    : "bg-white border border-gray-200 hover:shadow-xl"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2
                      className={`text-lg font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {freight.name}
                    </h2>
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      #{freight.id}
                    </div>
                  </div>

                  <p
                    className={`text-sm mb-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    De{" "}
                    <span className="font-semibold">
                      {freight.origin_city}, {freight.origin_state}
                    </span>{" "}
                    para{" "}
                    <span className="font-semibold">
                      {freight.destination_city}, {freight.destination_state}
                    </span>
                  </p>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                      <span>
                        {formatDate(freight.initial_date)} -{" "}
                        {formatDate(freight.final_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Truck className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Peso: {freight.weight} kg</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg flex flex-col gap-4">
                  <div className="text-center">
                    <span
                      className={`block text-2xl font-bold ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {formatCurrency(freight.price)}
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Valor estimado
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {renderApplicationButton(freight)}
                    <button
                      onClick={() => navigate(`/driver/freights/${freight.id}`)}
                      className={`w-full flex cursor-pointer items-center justify-center p-2 rounded-lg transition-colors ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      title="Ver detalhes"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`text-center py-16 ${
                darkMode ? "" : "bg-white rounded-lg border border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Nenhum frete encontrado
              </h3>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Tente ajustar sua busca ou verifique novamente mais tarde.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Mostrando {filteredFreights.length} de {freights.length} fretes
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded transition-colors ${
                darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button
              className={`px-3 py-1 rounded transition-colors ${
                darkMode
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
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
};

export default DriverFreights;
