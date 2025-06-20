import React from "react";
import {
  FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle,
  FaTruck, FaUserCircle, FaExclamationTriangle, FaBan, FaStar, FaTrash,
} from "react-icons/fa";

// Funções utilitárias
const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });


// --- COMPONENTE CORRIGIDO ---
const ContractCard = ({
  contract,
  darkMode,
  userRole,
  // Funções de callback para todas as ações
  onApprove,
  onCancel,
  onComplete,
  onDelete
}) => {
  // 1. O objeto de configuração de status é definido PRIMEIRO.
  const statusConfig = {
    // 2. A lógica para o texto dinâmico é feita aqui, de forma simples e direta.
    PENDING_CLIENT_APPROVAL: {
      text: userRole === "CLIENT"
        ? "Aguardando Sua Aprovação"
        : "Aguardando Resposta do Cliente",
      Icon: FaClock,
      color: "text-yellow-400"
    },
    ACTIVE: { text: "Ativo", Icon: FaCheckCircle, color: "text-green-400" },
    REJECTED: { text: "Rejeitado", Icon: FaTimesCircle, color: "text-red-400" },
    CANCELLED_BY_DRIVER: { text: "Cancelado pelo Motorista", Icon: FaBan, color: "text-red-500" },
    CANCELLED_BY_CLIENT: { text: "Cancelado pelo Cliente", Icon: FaBan, color: "text-red-500" },
    COMPLETED: { text: "Concluído", Icon: FaStar, color: "text-blue-400" },
    DEFAULT: { text: "Status Desconhecido", Icon: FaExclamationTriangle, color: "text-gray-400" },
  };

  // 3. A variável statusInfo agora usa a configuração correta.
  const statusInfo = statusConfig[contract.status] || statusConfig.DEFAULT;

  // Handlers que chamam as props recebidas
  const handleApprove = () => onApprove && onApprove(contract.id);
  const handleCancel = () => onCancel && onCancel(contract.id);
  const handleComplete = () => onComplete && onComplete(contract.id);
  const handleDelete = () => onDelete && onDelete(contract.id);

  return (
    <div
      className={`rounded-lg shadow-md border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } p-6 transition-all hover:shadow-lg flex flex-col`}
    >
      {/* Cabeçalho e Detalhes */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-blue-500 dark:text-blue-400">{contract.displayName}</h2>
            <div className="flex items-center mt-2">
              <statusInfo.Icon className={`mr-2 ${statusInfo.color}`} />
              <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold dark:text-white">{formatCurrency(contract.agreedValue)}</p>
          </div>
        </div>

        <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm`}>
          <div className="flex items-center">
            <FaUserCircle className="mr-3 text-gray-400" size={20} />
            <div>
              <strong>{userRole === "CLIENT" ? "Motorista:" : "Cliente:"}</strong>
              {userRole === "CLIENT" ? contract.driverName : contract.clientName}
            </div>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-3 text-gray-400" size={20} />
            <div><strong>Coleta:</strong> {formatDate(contract.pickupDate)}</div>
          </div>
          <div className="flex items-center">
            <FaTruck className="mr-3 text-gray-400" size={20} />
            <div><strong>Entrega:</strong> {formatDate(contract.deliveryDate)}</div>
          </div>
        </div>
      </div>

      {/* Seção de Ações Dinâmicas */}
      <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} mt-6 pt-4 flex flex-wrap justify-end gap-3`}>

        {/* Ação: Cliente aprovar proposta */}
        {userRole === "CLIENT" && contract.status === "PENDING_CLIENT_APPROVAL" && (
          <button onClick={handleApprove} className="px-4 py-2 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center">
            <FaCheckCircle className="mr-2" /> Aceitar Proposta
          </button>
        )}

        {/* Ação: Motorista retirar proposta */}
        {userRole === "DRIVER" && contract.status === "PENDING_CLIENT_APPROVAL" && (
          <button onClick={handleDelete} className="px-4 py-2 rounded-md font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center">
            <FaTrash className="mr-2" /> Retirar Proposta
          </button>
        )}

        {/* Ações para Contratos ATIVOS */}
        {contract.status === "ACTIVE" && (
          <>
            <button onClick={handleComplete} className="px-4 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center">
              <FaStar className="mr-2" /> Marcar como Concluído
            </button>
            <button onClick={handleCancel} className="px-4 py-2 rounded-md font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-colors flex items-center">
              <FaBan className="mr-2" /> Cancelar Contrato
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContractCard;