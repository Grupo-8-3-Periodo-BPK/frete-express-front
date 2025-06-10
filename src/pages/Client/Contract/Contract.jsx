import React, { useState, useEffect } from "react";
import { useAuth, useTheme } from "../../../contexts/AuthContext";
import { getContractsByClient } from "../../../services/contract";
import { FaFileContract } from "react-icons/fa";

function ContractPage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      const fetchContracts = async () => {
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
      };
      fetchContracts();
    }
  }, [user]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("pt-BR");

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } py-12 px-6`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Meus Contratos</h1>

        {loading && <p className="text-center">Carregando contratos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading &&
          !error &&
          (contracts.length > 0 ? (
            <div className="space-y-6">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-lg shadow-md border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-blue-400">
                        Contrato #{contract.id}
                      </h2>
                      <p className="text-sm opacity-70 mt-1">
                        Status:{" "}
                        <span className="font-medium">{contract.status}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-70">
                        Início: {formatDate(contract.startDate)}
                      </p>
                      <p className="text-sm opacity-70">
                        Fim: {formatDate(contract.endDate)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-4 pt-4 border-t ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{contract.terms}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FaFileContract className="mx-auto text-5xl text-gray-400 mb-4" />
              <p className="text-lg">Nenhum contrato encontrado.</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ContractPage;
