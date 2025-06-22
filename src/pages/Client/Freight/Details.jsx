import React, { useState, useEffect } from "react";
import { useTheme, useAuth } from "../../../contexts/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../../components/ui/button/Back.jsx";
import { getFreightById, deleteFreight } from "../../../services/freight.js";
import {
  getContractsByFreight,
  approveContract,
} from "../../../services/contract.js";
import ContractCard from "../../../components/ui/card/Contract.jsx";
import Loading from "../../../components/ui/modal/Loading.jsx";
import Alert from "../../../components/ui/modal/Alert.jsx";
import Confirmation from "../../../components/ui/modal/Confirmation.jsx";

function FreightDetails() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [freight, setFreight] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [approvedContract, setApprovedContract] = useState(null);

  const fetchFreightData = async () => {
    setLoading(true);
    setApprovedContract(null);
    try {
      const freightResponse = await getFreightById(id);
      setFreight(freightResponse);

      const contractsResponse = await getContractsByFreight(id);

      if (freightResponse.status === "AVAILABLE") {
        setCandidates(contractsResponse);
      } else if (freightResponse.status === "CLOSED") {
        const activeContract = contractsResponse.find(
          (c) =>
            c.status === "ACTIVE" ||
            c.status === "IN_PROGRESS" ||
            c.status === "COMPLETED"
        );
        if (activeContract) {
          setApprovedContract(activeContract);
        }
        setCandidates([]);
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

  const handleApproveContract = async (contractId) => {
    setLoading(true);
    try {
      await approveContract(contractId);
      setAlertMessage(
        "Motorista aprovado com sucesso! O frete foi fechado para novas propostas."
      );
      setAlertType("success");
      setIsAlertOpen(true);
      // Recarrega os dados para refletir as mudanças
      fetchFreightData();
    } catch (err) {
      setAlertMessage(err.message || "Erro ao aprovar a proposta.");
      setAlertType("error");
      setIsAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "em_andamento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "concluido":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const handleDeleteFreight = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsConfirmOpen(false);
    setIsDeleting(true);
    try {
      await deleteFreight(id);
      setAlertMessage("Frete removido com sucesso!");
      setAlertType("success");
    } catch (err) {
      // Extrai a mensagem de erro específica da resposta da API
      const errorMessage = err.data || "Ocorreu um erro ao remover o frete.";
      setAlertMessage(errorMessage);
      setAlertType("error");
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(true); // Abre o alerta para sucesso ou erro
    }
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false); // Fecha o alerta
    if (alertType === "success") {
      navigate("/client/freights"); // Redireciona apenas em caso de sucesso
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="w-48 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>

            {/* Card Skeleton */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse">
              <div className="p-8 space-y-6">
                <div className="w-64 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Erro ao carregar frete
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => navigate("/client/freights")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para fretes
          </button>
        </div>
      </div>
    );
  }

  if (!freight) {
    return null;
  }

  const isLocked = freight?.status === "CLOSED";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton message={"Voltar"} navigateTo={"/client/freights"} />
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
              Visualize todas as informações do seu frete
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div
          className={`rounded-2xl border backdrop-blur-sm ${
            darkMode
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-gray-200 shadow-lg"
          }`}
        >
          {/* Header do Card */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {freight.name || freight.produto}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  ID: #{freight.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    freight.status
                  )}`}
                >
                  {freight.status || "Pendente"}
                </span>
                {freight.status === "AVAILABLE" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/client/freight/${freight.id}/edit`)
                      }
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
                      title="Editar frete"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conteúdo do Card */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Detalhes do Frete */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Origem
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {freight.origin_city}, {freight.origin_state}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Destino
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {freight.destination_city}, {freight.destination_state}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Data de Coleta
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatDate(freight.initial_date)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Data de Entrega
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatDate(freight.final_date)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Valor
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatCurrency(freight.price)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Peso
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatWeight(freight.weight)}
                </p>
              </div>
              <div className="space-y-1 col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Dimensões (Altura x Largura x Comprimento)
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatDimensions(
                    freight.height,
                    freight.width,
                    freight.length
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Candidaturas */}
        {freight.status === "AVAILABLE" && candidates.length > 0 && (
          <div className="mt-8">
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Propostas de Motoristas
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {candidates.map((candidate) => (
                <ContractCard
                  key={candidate.id}
                  contract={candidate}
                  darkMode={darkMode}
                  userRole={user.role}
                  onApprove={handleApproveContract}
                />
              ))}
            </div>
          </div>
        )}

        {freight.status === "AVAILABLE" &&
          candidates.length === 0 &&
          !loading && (
            <div className="mt-8 text-center py-8 px-4 border-2 border-dashed rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum motorista se candidatou a este frete ainda.
              </p>
            </div>
          )}

        {/* Footer do Card */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={() => navigate("/client/freights")}
              className={`px-6 py-2 rounded-lg border transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Voltar para Lista
            </button>
            {freight.status === "AVAILABLE" && (
              <>
                <button
                  onClick={() => navigate(`/client/freight/${id}/edit`)}
                  disabled={isLocked}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer ${
                    isLocked ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Editar Frete
                </button>
                <button
                  onClick={handleDeleteFreight}
                  disabled={isDeleting || isLocked}
                  className={`px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer ${
                    isDeleting || isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isDeleting ? "Removendo..." : "Remover Frete"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Confirmation
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja remover este frete? Esta ação não pode ser desfeita e irá cancelar quaisquer propostas existentes."
        darkMode={darkMode}
      />

      <Alert
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        onClose={handleAlertClose}
        message={alertMessage}
        type={alertType}
      />

      <Loading isOpen={loading || isDeleting} />
    </div>
  );
}

export default FreightDetails;
