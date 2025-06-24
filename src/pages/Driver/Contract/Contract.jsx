import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../../contexts/AuthContext";
import {
  getContractsByDriver,
  cancelByDriver,
  completeContract,
  deleteContract,
  startContract,
} from "../../../services/contract";

import ContractCard from "../../../components/ui/card/Contract";
import Alert from "../../../components/ui/modal/Alert";
import ConfirmationModal from "../../../components/ui/modal/Confirmation";
import { Truck, AlertCircle, Loader } from "lucide-react";

function DriverContractsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    isAlertOpen: false,
    message: "",
    type: "success",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'delete' or 'cancel'
  const { darkMode } = useTheme();

  // Transforma a busca de dados em uma função reutilizável
  const fetchContracts = useCallback(async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const data = await getContractsByDriver(user.id);
        setContracts(data);
      } catch (err) {
        setError("Falha ao carregar os contratos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // --- Handlers para as ações do Motorista ---
  const handleCancelClick = (contractId) => {
    setSelectedContractId(contractId);
    setModalAction("cancel");
    setIsModalOpen(true);
  };

  const handleComplete = async (contractId) => {
    try {
      await completeContract(contractId);
      setAlert({
        isAlertOpen: true,
        message: "Contrato concluído com sucesso!",
        type: "success",
      });
      fetchContracts();
    } catch (err) {
      setAlert({
        isAlertOpen: true,
        message: "Erro ao concluir o contrato.",
        type: "error",
      });
    }
  };

  const handleStart = async (contractId) => {
    try {
      await startContract(contractId);
      setAlert({
        isAlertOpen: true,
        message: "Contrato iniciado! A página de rastreamento será aberta.",
        type: "success",
      });
      setTimeout(() => {
        navigate(`/driver/tracking/${contractId}`);
      }, 1500);
    } catch (err) {
      setAlert({
        isAlertOpen: true,
        message: "Erro ao iniciar o contrato.",
        type: "error",
      });
    }
  };

  const handleDeleteClick = (contractId) => {
    setSelectedContractId(contractId);
    setModalAction("delete");
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedContractId || !modalAction) return;

    try {
      if (modalAction === "delete") {
        await deleteContract(selectedContractId);
        setAlert({
          isAlertOpen: true,
          message: "Proposta retirada com sucesso.",
          type: "success",
        });
      } else if (modalAction === "cancel") {
        await cancelByDriver(selectedContractId);
        setAlert({
          isAlertOpen: true,
          message: "Contrato cancelado com sucesso.",
          type: "success",
        });
      }
      fetchContracts();
    } catch (err) {
      const message =
        modalAction === "delete"
          ? "Erro ao retirar a proposta."
          : "Erro ao cancelar o contrato.";
      setAlert({
        isAlertOpen: true,
        message: err.message || message,
        type: "error",
      });
    } finally {
      setIsModalOpen(false);
      setSelectedContractId(null);
      setModalAction(null);
    }
  };

  // --- Componentes de Estado ---
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <Loader className="h-12 w-12 animate-spin text-emerald-500" />
      <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
        Carregando seus fretes...
      </p>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="mt-4 text-lg text-red-500">{error}</p>
    </div>
  );
  
  const EmptyState = () => (
    <div className={`text-center py-16 px-6 rounded-lg border-dashed ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
      <Truck className={`mx-auto h-16 w-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      <h2 className={`mt-6 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Nenhuma proposta de frete
      </h2>
      <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Novas oportunidades e contratos aceitos serão listados aqui.
      </p>
    </div>
  );

  return (
    <div className={`w-full min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"}`}>
      <header className={`border-b shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
          <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
            Seus Fretes
          </h1>
          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Gerencie suas propostas e contratos ativos.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : contracts.length > 0 ? (
          <div className="space-y-5">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                // Adicionamos um fundo ao wrapper para garantir a visibilidade no modo escuro.
                // O próprio ContractCard deve ter um fundo transparente ou também ser ajustado.
                className={`rounded-lg border-l-4 border-emerald-500 overflow-hidden transition-all hover:-translate-y-1 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <ContractCard
                  contract={contract}
                  userRole="DRIVER"
                  onCancel={handleCancelClick}
                  onComplete={handleComplete}
                  onDelete={handleDeleteClick}
                  onStart={handleStart}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>

      <Alert
        isAlertOpen={alert.isAlertOpen}
        setIsAlertOpen={setAlert}
        message={alert.message}
        type={alert.type}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          modalAction === "cancel" ? "Cancelar Contrato" : "Retirar Proposta"
        }
        message={
          modalAction === "cancel"
            ? "Tem certeza que deseja cancelar este contrato? A outra parte será notificada."
            : "Você tem certeza que deseja retirar sua proposta para este frete? Esta ação não poderá ser desfeita."
        }
        confirmText={
          modalAction === "cancel" ? "Sim, Cancelar" : "Sim, Retirar"
        }
        type={modalAction === "cancel" ? "warning" : "info"}
      />
    </div>
  );
}

export default DriverContractsPage;