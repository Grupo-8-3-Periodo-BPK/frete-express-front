import React, { useState, useEffect, useCallback } from "react";
import { useAuth, useTheme } from "../../../contexts/AuthContext";
import {
  getContractsByClient,
  approveContract,
  cancelByClient,
  completeContract,
} from "../../../services/contract";

import ContractCard from "../../../components/ui/card/Contract";
import Alert from "../../../components/ui/modal/Alert";
import ConfirmationModal from "../../../components/ui/modal/Confirmation";
import { FaFileContract } from "react-icons/fa";
import { Loader, AlertCircle } from "lucide-react";

function ContractPage() {
  const { user } = useAuth();
  const { darkMode } = useTheme(); // Este booleano controlará tudo
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
  const [modalAction, setModalAction] = useState(null);

  const fetchContracts = useCallback(async () => {
    // ... (lógica de busca de dados permanece a mesma)
    if (user?.id) {
      try {
        setLoading(true);
        const data = await getContractsByClient(user.id);
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

  // --- Handlers para as ações (permanecem os mesmos) ---
  const handleApproveClick = (contractId) => {
    setSelectedContractId(contractId);
    setModalAction("approve");
    setIsModalOpen(true);
  };

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
  
  const handleConfirmAction = async () => {
    // ... (lógica de confirmação permanece a mesma)
    if (!selectedContractId || !modalAction) return;

    try {
      if (modalAction === "approve") {
        await approveContract(selectedContractId);
        setAlert({
          isAlertOpen: true,
          message: "Proposta aceita com sucesso! O contrato está ativo.",
          type: "success",
        });
      } else if (modalAction === "cancel") {
        await cancelByClient(selectedContractId);
        setAlert({
          isAlertOpen: true,
          message: "Contrato cancelado com sucesso.",
          type: "success",
        });
      }
      fetchContracts();
    } catch (err) {
      const message =
        modalAction === "approve"
          ? "Erro ao aprovar a proposta."
          : "Erro ao cancelar o contrato.";
      setAlert({ isAlertOpen: true, message, type: "error" });
    } finally {
      setIsModalOpen(false);
      setSelectedContractId(null);
      setModalAction(null);
    }
  };

  // --- Componentes de Estado ---
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <Loader className="h-12 w-12 animate-spin text-blue-500" />
      {/* O texto herda a cor do container principal */}
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
    // AJUSTE: Classes dinâmicas para o container do estado vazio
    <div
      className={`
        text-center py-16 px-6 rounded-lg border-dashed 
        ${darkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white border-gray-300"
        }
      `}
    >
      <FaFileContract className="mx-auto text-6xl text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold">Nenhum contrato encontrado</h2>
      {/* AJUSTE: Classe dinâmica para o parágrafo */}
      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
        Suas propostas e contratos aparecerão aqui.
      </p>
    </div>
  );

  return (
    // AJUSTE: Classes dinâmicas para o container principal da página
    <div
      className={`
        w-full min-h-screen 
        ${darkMode
          ? "bg-gray-900 text-gray-200"
          : "bg-gray-50 text-gray-800"
        }
      `}
    >
      {/* AJUSTE: Classes dinâmicas para o header */}
      <header
        className={`
          shadow-sm border-b 
          ${darkMode
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white border-gray-200"
          }
        `}
      >
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
          {/* AJUSTE: Classes dinâmicas para o título h1 */}
          <h1
            className={`
              text-3xl font-bold tracking-tight 
              ${darkMode ? "text-white" : "text-gray-900"}
            `}
          >
            Meus Contratos
          </h1>
          {/* AJUSTE: Classes dinâmicas para o parágrafo */}
          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Gerencie os fretes que você publicou e as propostas recebidas.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : contracts.length > 0 ? (
          <div className="space-y-6">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                // Esta borda azul funciona bem em ambos os modos, não precisa de ajuste.
                className="rounded-lg border-l-4 border-blue-500 overflow-hidden transition-all hover:-translate-y-1"
              >
                <ContractCard
                  contract={contract}
                  darkMode={darkMode} // Prop já estava sendo passada corretamente
                  userRole="CLIENT"
                  onApprove={handleApproveClick}
                  onCancel={handleCancelClick}
                  onComplete={handleComplete}
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
          modalAction === "approve" ? "Aprovar Proposta" : "Cancelar Contrato"
        }
        message={
          modalAction === "approve"
            ? "Tem certeza que deseja aprovar esta proposta? O contrato será iniciado."
            : "Tem certeza que deseja cancelar este contrato? A outra parte será notificada."
        }
        confirmText={
          modalAction === "approve" ? "Sim, Aprovar" : "Sim, Cancelar"
        }
        type={modalAction === "approve" ? "info" : "warning"}
      />
    </div>
  );
}

export default ContractPage;