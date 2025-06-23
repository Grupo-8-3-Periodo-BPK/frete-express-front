import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../contexts/AuthContext";
import {
  getAllContracts,
  cancelByClient as cancelContractByAdmin,
} from "../../../services/contract";
import { AnimatePresence, motion } from "framer-motion";
import Confirmation from "../../../components/ui/modal/Confirmation";
import ContractCard from "../../../components/ui/card/Contract";
import Alert from "../../../components/ui/modal/Alert";
import { FaFileContract } from "react-icons/fa";
import { Loader, AlertCircle, Filter } from "lucide-react";

function ManageContracts() {
  const { darkMode } = useTheme();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [alert, setAlert] = useState({
    isAlertOpen: false,
    message: "",
    type: "success",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [contractToCancelId, setContractToCancelId] = useState(null);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllContracts();
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setContracts(sortedData);
    } catch (err) {
      setError("Falha ao carregar os contratos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const filteredContracts = contracts.filter(contract => {
    if (filterStatus === "ALL") {
      return true;
    }
    if (filterStatus === "CANCELLED") {
      return ["CANCELLED_BY_CLIENT", "CANCELLED_BY_DRIVER", "REJECTED"].includes(contract.status);
    }
    return contract.status === filterStatus;
  });

  const getBorderColorForStatus = (status) => {
    switch (status) {
      case "COMPLETED":
        return "border-green-500";
      case "IN_PROGRESS":
        return "border-blue-500";
      case "ACTIVE":
        return "border-cyan-500";
      case "PENDING_CLIENT_APPROVAL":
        return "border-yellow-500";
      case "CANCELLED_BY_CLIENT":
      case "CANCELLED_BY_DRIVER":
      case "REJECTED":
        return "border-red-500";
      default:
        return "border-gray-400";
    }
  };

  const handleCancelRequest = (contractId) => {
    setContractToCancelId(contractId);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setContractToCancelId(null);
    setIsConfirmOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (contractToCancelId) {
      try {
        await cancelContractByAdmin(contractToCancelId);
        setAlert({
          isAlertOpen: true,
          message: "Contrato cancelado pelo administrador.",
          type: "success",
        });
        fetchContracts();
      } catch (err) {
        setAlert({
          isAlertOpen: true,
          message: "Erro ao cancelar o contrato.",
          type: "error",
        });
      } finally {
        handleCloseConfirm();
      }
    }
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <Loader className="h-12 w-12 animate-spin text-blue-500" />
      <p className="mt-4 text-lg">Carregando...</p>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="mt-4 text-lg text-red-500">{error}</p>
    </div>
  );

  const EmptyState = () => (
    <div className={`text-center py-16 px-6 rounded-lg border-2 border-dashed ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-300'}`}>
      <FaFileContract className="mx-auto text-6xl text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold">Nenhum contrato encontrado</h2>
      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
        Não há contratos {filterStatus !== 'ALL' ? `com o status selecionado` : 'registrados no sistema'}.
      </p>
    </div>
  );

  return (
    <div className={`w-full min-h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <AnimatePresence>
        {isConfirmOpen && (
          <Confirmation
            isOpen={isConfirmOpen}
            onClose={handleCloseConfirm}
            onConfirm={handleConfirmCancel}
            title="Confirmar Cancelamento"
            message="Você tem certeza que deseja cancelar este contrato? Esta ação não pode ser desfeita."
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      <header className={`border-b shadow-sm sticky top-0 z-10 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
          <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Gerenciamento de Contratos
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Visualize e gerencie todos os contratos do sistema.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className={`mb-6 p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-500" />
            <label htmlFor="status-filter" className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Filtrar por Status:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            >
              <option value="ALL">Todos os Status</option>
              <option value="PENDING_CLIENT_APPROVAL">Pendentes</option>
              <option value="ACTIVE">Ativos (Prontos)</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="COMPLETED">Concluídos</option>
              <option value="CANCELLED">Cancelados/Rejeitados</option>
            </select>
          </div>
          <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Exibindo {filteredContracts.length} de {contracts.length} contratos.
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : filteredContracts.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredContracts.map((contract) => (
                <motion.div
                  key={contract.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg border-l-4 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${getBorderColorForStatus(contract.status)}`}
                >
                  <ContractCard
                    contract={contract}
                    darkMode={darkMode}
                    userRole="ADMIN"
                    onCancelByAdmin={handleCancelRequest}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>

      <Alert
        isAlertOpen={alert.isAlertOpen}
        setIsAlertOpen={(isOpen) => setAlert(prev => ({ ...prev, isAlertOpen: isOpen }))}
        message={alert.message}
        type={alert.type}
        darkMode={darkMode}
      />
    </div>
  );
}

export default ManageContracts;