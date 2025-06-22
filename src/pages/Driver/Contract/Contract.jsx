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
import { Truck, AlertCircle, Loader } from "lucide-react";

function DriverContractsPage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    isAlertOpen: false,
    message: "",
    type: "success",
  });

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
  const handleCancel = async (contractId) => {
    if (window.confirm("Tem certeza que deseja cancelar este contrato?")) {
      try {
        await cancelByDriver(contractId);
        setAlert({
          isAlertOpen: true,
          message: "Contrato cancelado.",
          type: "success",
        });
        fetchContracts();
      } catch (err) {
        setAlert({
          isAlertOpen: true,
          message: "Erro ao cancelar o contrato.",
          type: "error",
        });
      }
    }
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

  const handleDelete = async (contractId) => {
    if (window.confirm("Tem certeza que deseja retirar sua proposta?")) {
      try {
        // A "retirada" é uma exclusão do pré-contrato
        await deleteContract(contractId);
        setAlert({
          isAlertOpen: true,
          message: "Proposta retirada.",
          type: "success",
        });
        fetchContracts();
      } catch (err) {
        setAlert({
          isAlertOpen: true,
          message: "Erro ao retirar a proposta.",
          type: "error",
        });
      }
    }
  };

  // --- Componentes de Estado ---
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <Loader className="h-12 w-12 animate-spin text-emerald-500" />
      <p className="mt-4 text-lg">Carregando seus fretes...</p>
    </div>
  );
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="mt-4 text-lg text-red-500">{error}</p>
    </div>
  );
  const EmptyState = () => (
    <div className="text-center py-16 px-6 rounded-lg bg-white dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-700">
      <Truck className="mx-auto h-16 w-16 text-gray-400" />
      <h2 className="mt-6 text-xl font-semibold">Nenhuma proposta de frete</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Novas oportunidades e contratos aceitos serão listados aqui.
      </p>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      <header className="bg-white dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Seus Fretes
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
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
                className="rounded-lg border-l-4 border-emerald-500 overflow-hidden transition-all hover:-translate-y-1"
              >
                <ContractCard
                  contract={contract}
                  darkMode={darkMode}
                  userRole="DRIVER"
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
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
    </div>
  );
}

export default DriverContractsPage;
