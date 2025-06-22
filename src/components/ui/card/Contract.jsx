import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaTruck,
  FaUserCircle,
  FaExclamationTriangle,
  FaBan,
  FaStar,
  FaTrash,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Map from "../Map";
import { getLatestTrackingForContract } from "../../../services/tracking";
import {
  getRouteDirections,
  getCoordinatesForAddress,
} from "../../../services/route";

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
  onApprove,
  onCancel,
  onComplete,
  onDelete,
  onStart,
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const navigate = useNavigate();

  // 1. O objeto de configuração de status é definido PRIMEIRO.
  const statusConfig = {
    // 2. A lógica para o texto dinâmico é feita aqui, de forma simples e direta.
    PENDING_CLIENT_APPROVAL: {
      text:
        userRole === "CLIENT"
          ? "Aguardando Sua Aprovação"
          : "Aguardando Resposta do Cliente",
      Icon: FaClock,
      color: "text-yellow-400",
    },
    ACTIVE: {
      text: "Pronto para Iniciar",
      Icon: FaCheckCircle,
      color: "text-green-400",
    },
    IN_PROGRESS: {
      text: "Em Andamento",
      Icon: FaTruck,
      color: "text-blue-400",
    },
    REJECTED: { text: "Rejeitado", Icon: FaTimesCircle, color: "text-red-400" },
    CANCELLED_BY_DRIVER: {
      text: "Cancelado pelo Motorista",
      Icon: FaBan,
      color: "text-red-500",
    },
    CANCELLED_BY_CLIENT: {
      text: "Cancelado pelo Cliente",
      Icon: FaBan,
      color: "text-red-500",
    },
    COMPLETED: { text: "Concluído", Icon: FaStar, color: "text-blue-400" },
    DEFAULT: {
      text: "Status Desconhecido",
      Icon: FaExclamationTriangle,
      color: "text-gray-400",
    },
  };

  // Efeito para buscar a localização em tempo real
  useEffect(() => {
    // Só executa se o contrato tiver um status que permita rastreamento
    const shouldTrack = ["ACTIVE", "IN_PROGRESS", "COMPLETED"].includes(
      contract.status
    );

    if (shouldTrack) {
      const fetchLocationAndRoute = async () => {
        try {
          const response = await getLatestTrackingForContract(contract.id);
          if (response && response.data) {
            const {
              currentLatitude,
              currentLongitude,
              originLatitude,
              originLongitude,
              destinationLatitude,
              destinationLongitude,
            } = response.data;

            // PADRONIZADO: Todos os dados de localização são objetos.
            setCurrentLocation({ coords: [currentLatitude, currentLongitude] });
            setOrigin({ coords: [originLatitude, originLongitude] });
            setDestination({
              coords: [destinationLatitude, destinationLongitude],
            });

            // Busca a rota apenas uma vez para não sobrecarregar
            if (route.length === 0) {
              const routeResponse = await getRouteDirections(
                `${originLongitude},${originLatitude}`,
                `${destinationLongitude},${destinationLatitude}`
              );
              // Acessa diretamente a lista de coordenadas
              if (routeResponse.data && routeResponse.data.coordinates) {
                setRoute(routeResponse.data.coordinates);
              }
            }
          }
        } catch (error) {
          console.error("Erro ao buscar a localização ou rota:", error);
        }
      };

      if (userRole === "CLIENT") {
        fetchLocationAndRoute(); // Busca a primeira vez imediatamente
        if (contract.status === "IN_PROGRESS") {
          const intervalId = setInterval(fetchLocationAndRoute, 15000); // E depois a cada 15 segundos
          return () => clearInterval(intervalId); // Limpa o intervalo
        }
      }
    }
  }, [contract.id, contract.status, userRole, route.length]);

  // 3. A variável statusInfo agora usa a configuração correta.
  const statusInfo = statusConfig[contract.status] || statusConfig.DEFAULT;

  // Handlers que chamam as props recebidas
  const handleApprove = () => onApprove && onApprove(contract.id);
  const handleCancel = () => onCancel && onCancel(contract.id);
  const handleComplete = () => onComplete && onComplete(contract.id);
  const handleDelete = () => onDelete && onDelete(contract.id);
  const handleStartTracking = () => {
    // Se for o motorista, ele inicia o contrato (muda o status) e depois navega
    if (userRole === "DRIVER" && onStart) {
      onStart(contract.id);
    }
    navigate(`/driver/tracking/${contract.id}`);
  };
  const handleGoToTracking = () => {
    navigate(`/driver/tracking/${contract.id}`);
  };

  return (
    <div
      className={`rounded-lg shadow-md border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } p-6 transition-all hover:shadow-lg flex flex-col`}
    >
      {/* Cabeçalho e Detalhes */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-blue-500 dark:text-blue-400">
              {contract.displayName}
            </h2>
            <div className="flex items-center mt-2">
              <statusInfo.Icon className={`mr-2 ${statusInfo.color}`} />
              <span className={`font-semibold ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold dark:text-white">
              {formatCurrency(contract.agreedValue)}
            </p>
          </div>
        </div>

        <div
          className={`border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm`}
        >
          <div className="flex items-center">
            <FaUserCircle className="mr-3 text-gray-400" size={20} />
            <div>
              <strong>
                {userRole === "CLIENT" ? "Motorista:" : "Cliente:"}
              </strong>
              {userRole === "CLIENT"
                ? contract.driverName
                : contract.clientName}
            </div>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-3 text-gray-400" size={20} />
            <div>
              <strong>Coleta:</strong> {formatDate(contract.pickupDate)}
            </div>
          </div>
          <div className="flex items-center">
            <FaTruck className="mr-3 text-gray-400" size={20} />
            <div>
              <strong>Entrega:</strong> {formatDate(contract.deliveryDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Mapa de Rastreamento (só aparece se o contrato estiver em andamento, ativo ou concluído) */}
      {userRole === "CLIENT" &&
        ["ACTIVE", "IN_PROGRESS", "COMPLETED"].includes(contract.status) && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">
              Rastreamento em Tempo Real
            </h3>
            <div className="rounded-lg overflow-hidden border dark:border-gray-700">
              {origin ? (
                <Map
                  origin={origin}
                  destination={destination}
                  position={currentLocation}
                  route={route}
                />
              ) : (
                <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <p className="text-gray-500">
                    Carregando dados de rastreamento...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Seção de Ações Dinâmicas */}
      <div
        className={`border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } mt-6 pt-4 flex flex-wrap justify-end gap-3`}
      >
        {/* Ação: Cliente aprovar proposta */}
        {userRole === "CLIENT" &&
          contract.status === "PENDING_CLIENT_APPROVAL" && (
            <button
              onClick={handleApprove}
              className="px-4 py-2 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center"
            >
              <FaCheckCircle className="mr-2" /> Aceitar Proposta
            </button>
          )}

        {/* Ações para Contratos ATIVOS (Prontos para iniciar) */}
        {userRole === "DRIVER" && contract.status === "ACTIVE" && (
          <button
            onClick={handleStartTracking}
            className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center"
          >
            <FaMapMarkedAlt className="mr-2" /> Iniciar Entrega
          </button>
        )}

        {/* Ações para Contratos EM ANDAMENTO */}
        {contract.status === "IN_PROGRESS" && (
          <>
            {/* Botão para o motorista ir para a tela de rastreamento */}
            {userRole === "DRIVER" && (
              <button
                onClick={handleGoToTracking}
                className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center"
              >
                <FaMapMarkedAlt className="mr-2" /> Visualizar Rota
              </button>
            )}

            {/* Ações de Cancelar e Concluir movidas para cá */}
            {userRole === "CLIENT" && (
              <button
                onClick={handleComplete}
                className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center"
              >
                <FaStar className="mr-2" /> Marcar como Concluído
              </button>
            )}

            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-gray-500 hover:bg-gray-600 transition-colors flex items-center"
            >
              <FaBan className="mr-2" /> Cancelar Contrato
            </button>
          </>
        )}

        {/* Ação: Motorista retirar proposta */}
        {userRole === "DRIVER" &&
          contract.status === "PENDING_CLIENT_APPROVAL" && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center"
            >
              <FaTrash className="mr-2" /> Retirar Proposta
            </button>
          )}
      </div>
    </div>
  );
};

export default ContractCard;
