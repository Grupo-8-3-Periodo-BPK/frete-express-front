import React, { useState, useEffect } from "react";
import { useTheme, useAuth } from "../../../contexts/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../../components/ui/button/Back.jsx";
import { getFreightById } from "../../../services/freight.js";
import { getContractsByFreight } from "../../../services/contract.js";
import { getUserById } from "../../../services/user.js";
import { getVehiclesByUser } from "../../../services/vehicle.js";
import ContractCard from "../../../components/ui/card/Contract.jsx";
import Loading from "../../../components/ui/modal/Loading.jsx";
import Alert from "../../../components/ui/modal/Alert.jsx";

function AdminFreightDetails() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [freight, setFreight] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [approvedContract, setApprovedContract] = useState(null);

  const fetchFreightData = async () => {
    setLoading(true);
    setApprovedContract(null);
    try {
      const freightResponse = await getFreightById(id);
      setFreight(freightResponse);

      const contractsResponse = await getContractsByFreight(id);

      const enrichedContracts = await Promise.all(
        contractsResponse.map(async (contract) => {
          const driver = await getUserById(contract.driverId);
          const client = await getUserById(contract.clientId);
          const vehicles = await getVehiclesByUser(contract.driverId);
          return {
            ...contract,
            driverName: driver?.name || "Não informado",
            clientName: client?.name || "Não informado",
            vehicle: vehicles?.[0] || null,
            displayName: `Proposta de ${driver?.name || "Motorista"}`,
          };
        })
      );

      const approved = enrichedContracts.find((c) =>
        ["ACTIVE", "IN_PROGRESS", "COMPLETED"].includes(c.status)
      );

      if (approved) {
        setApprovedContract(approved);
        setCandidates([]);
      } else {
        setCandidates(
          enrichedContracts.filter(
            (c) => c.status === "PENDING_CLIENT_APPROVAL"
          )
        );
        setApprovedContract(null);
      }
    } catch (err) {
      setError(err.message || "Erro ao carregar dados do frete");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFreightData();
    }
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatWeight = (weight) => {
    return `${weight.toLocaleString("pt-BR")} kg`;
  };

  const formatDimensions = (height, width, length) => {
    return `${height}m × ${width}m × ${length}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Erro ao carregar frete
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => navigate("/admin/freights")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para Gerenciamento
          </button>
        </div>
      </div>
    );
  }

  if (!freight) return null;

  const isLocked = freight?.status === "CLOSED";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Alert
          isOpen={isAlertOpen}
          message={alertMessage}
          type={alertType}
          onClose={handleAlertClose}
        />

        <div className="flex items-center gap-4 mb-8">
          <BackButton message={"Voltar"} navigateTo={"/admin/freights"} />
          <div>
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Detalhes do Frete
            </h1>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Visualize todas as informações do frete.
            </p>
          </div>
        </div>

        <div
          className={`rounded-2xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200 shadow-sm"
          } p-8 mb-8`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Produto
              </label>
              <p
                className={`mt-1 font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {freight.name}
              </p>
            </div>
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Status
              </label>
              <p
                className={`mt-1 font-semibold capitalize ${
                  isLocked ? "text-red-500" : "text-green-500"
                }`}
              >
                {freight.status}
              </p>
            </div>
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Origem
              </label>
              <p
                className={`mt-1 font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >{`${freight.origin_city}, ${freight.origin_state}`}</p>
            </div>
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Destino
              </label>
              <p
                className={`mt-1 font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >{`${freight.destination_city}, ${freight.destination_state}`}</p>
            </div>
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Preço
              </label>
              <p
                className={`mt-1 font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {formatCurrency(freight.price)}
              </p>
            </div>
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Data de Coleta
              </label>
              <p
                className={`mt-1 font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {formatDate(freight.initial_date)}
              </p>
            </div>
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Peso
              </label>
              <p
                className={`mt-1 font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {formatWeight(freight.weight)}
              </p>
            </div>
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Dimensões (A × L × C)
              </label>
              <p
                className={`mt-1 font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {formatDimensions(
                  freight.height,
                  freight.width,
                  freight.length
                )}
              </p>
            </div>
          </div>
        </div>

        {isLocked && approvedContract && (
          <div className="mb-8">
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Proposta Aceita
            </h2>
            <ContractCard
              contract={approvedContract}
              userRole={user?.role}
              darkMode={darkMode}
            />
          </div>
        )}

        {!isLocked && (
          <div>
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Candidatos
            </h2>
            {candidates.length > 0 ? (
              <div className="space-y-4">
                {candidates.map((contract) => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    userRole={user?.role}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Nenhum motorista se candidatou a este frete ainda.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminFreightDetails;
