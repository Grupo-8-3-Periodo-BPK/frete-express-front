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
import { getFreightById } from "../../../services/freight";
import {
  getRouteDirections,
  getCoordinatesForAddress,
} from "../../../services/route";
import { getStateFullName } from "../../../utils/stateUtils";
import { getDistanceFromLatLonInKm } from "../../../utils/mapUtils";
import { useTheme } from "../../../contexts/AuthContext";

// Funções utilitárias (sem alterações)
const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });

const ContractCard = ({
  contract,
  userRole,
  onApprove,
  onCancel,
  onComplete,
  onDelete,
  onStart,
  onCancelByAdmin,
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Objeto de configuração de status agora usa a prop darkMode
  const statusConfig = {
    PENDING_CLIENT_APPROVAL: {
      text:
        userRole === "CLIENT"
          ? "Aguardando Sua Aprovação"
          : "Aguardando Resposta do Cliente",
      Icon: FaClock,
      color: darkMode ? "text-yellow-400" : "text-yellow-500",
    },
    ACTIVE: {
      text: "Pronto para Iniciar",
      Icon: FaCheckCircle,
      color: darkMode ? "text-green-400" : "text-green-600",
    },
    IN_PROGRESS: {
      text: "Em Andamento",
      Icon: FaTruck,
      color: darkMode ? "text-blue-400" : "text-blue-500",
    },
    REJECTED: {
      text: "Rejeitado",
      Icon: FaTimesCircle,
      color: darkMode ? "text-red-400" : "text-red-500",
    },
    CANCELLED_BY_DRIVER: {
      text: "Cancelado pelo Motorista",
      Icon: FaBan,
      color: "text-red-500", // Vermelho-500 tem bom contraste em ambos os modos
    },
    CANCELLED_BY_CLIENT: {
      text: "Cancelado pelo Cliente",
      Icon: FaBan,
      color: "text-red-500",
    },
    COMPLETED: {
      text: "Concluído",
      Icon: FaStar,
      color: darkMode ? "text-blue-400" : "text-blue-500",
    },
    DEFAULT: {
      text: "Status Desconhecido",
      Icon: FaExclamationTriangle,
      color: darkMode ? "text-gray-400" : "text-gray-500",
    },
  };

    // Lógica de busca de localização permanece inalterada
    useEffect(() => {
        const shouldTrack = ["ACTIVE", "IN_PROGRESS"].includes(contract.status);
        if (shouldTrack && (userRole === "CLIENT" || userRole === "ADMIN")) {
            const fetchLocationAndRoute = async () => {
                try {
                    const freight = await getFreightById(contract.freightId);
                    if (!freight) return;

                    const originState = getStateFullName(freight.origin_state);
                    const destinationState = getStateFullName(freight.destination_state);
                    const originAddress = `${freight.origin_city}, ${originState}, Brasil`;
                    const destinationAddress = `${freight.destination_city}, ${destinationState}, Brasil`;

                    const [originCoordString, destinationCoordString] = await Promise.all([
                        getCoordinatesForAddress(originAddress),
                        getCoordinatesForAddress(destinationAddress),
                    ]);

                    const originCoords = originCoordString.split(",").map(Number).reverse();
                    const destinationCoords = destinationCoordString.split(",").map(Number).reverse();

                    setOrigin({ coords: originCoords });
                    setDestination({ coords: destinationCoords });

                    if (route.length === 0) {
                        const routeResponse = await getRouteDirections(originCoordString, destinationCoordString);
                        if (routeResponse.data && routeResponse.data.coordinates) {
                            setRoute(routeResponse.data.coordinates);
                        }
                    }

                    const trackingResponse = await getLatestTrackingForContract(contract.id);
                    if (trackingResponse && trackingResponse.data) {
                        const driverCoords = [
                            trackingResponse.data.originLatitude,
                            trackingResponse.data.originLongitude,
                        ];

                        const routeDistance = getDistanceFromLatLonInKm(originCoords, destinationCoords);
                        const driverDistance = getDistanceFromLatLonInKm(originCoords, driverCoords);

                        if (driverDistance < routeDistance * 1.5 + 50) {
                            setCurrentLocation({ coords: driverCoords });
                        } else {
                            setCurrentLocation(null);
                            console.warn("Localização do motorista descartada por ser inconsistente com a rota.");
                        }
                    }
                } catch (error) {
                    console.error("Erro ao buscar a localização ou rota:", error);
                }
            };
            fetchLocationAndRoute();
        }
    }, [contract.id, contract.freightId, contract.status, userRole, route.length]);


  const statusInfo = statusConfig[contract.status] || statusConfig.DEFAULT;

  // Handlers (sem alterações)
  const handleApprove = () => onApprove && onApprove(contract.id);
  const handleCancel = () => onCancel && onCancel(contract.id);
  const handleComplete = () => onComplete && onComplete(contract.id);
  const handleDelete = () => onDelete && onDelete(contract.id);
  const handleCancelByAdmin = () => onCancelByAdmin && onCancelByAdmin(contract.id);
  const handleStartTracking = () => {
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
            <h2 className={`text-xl font-bold ${darkMode ? "text-blue-400" : "text-blue-500"}`}>
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
            <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {formatCurrency(contract.agreedValue)}
            </p>
          </div>
        </div>

        <div
          className={`border-t ${
            darkMode
              ? "border-gray-700 text-gray-300"
              : "border-gray-200 text-gray-600"
          } pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm`}
        >
          {userRole === "ADMIN" ? (
            <>
              <div className="flex items-center">
                <FaUserCircle
                  className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-700"}`}
                  size={20}
                />
                <div>
                  <strong>Cliente:</strong> {contract.clientName}
                </div>
              </div>
              <div className="flex items-center">
                <FaUserCircle
                  className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-700"}`}
                  size={20}
                />
                <div>
                  <strong>Motorista:</strong> {contract.driverName}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center">
              <FaUserCircle
                className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-700"}`}
                size={20}
              />
              <div>
                <strong>
                  {userRole === "CLIENT" ? "Motorista:" : "Cliente:"}
                </strong>
                {userRole === "CLIENT"
                  ? contract.driverName
                  : contract.clientName}
              </div>
            </div>
          )}
          <div className="flex items-center">
            <FaCalendarAlt
              className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-700"}`}
              size={20}
            />
            <div>
              <strong>Coleta:</strong> {formatDate(contract.pickupDate)}
            </div>
          </div>
          <div className="flex items-center">
            <FaTruck
              className={`mr-3 ${darkMode ? "text-gray-400" : "text-gray-700"}`}
              size={20}
            />
            <div>
              <strong>Entrega:</strong> {formatDate(contract.deliveryDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Mapa de Rastreamento */}
      {(userRole === "CLIENT" || userRole === "ADMIN") &&
        ["ACTIVE", "IN_PROGRESS"].includes(contract.status) && (
          <div className="mt-4">
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Rota do Frete
            </h3>
            <div className={`rounded-lg overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              {origin ? (
                <Map
                  origin={origin}
                  destination={destination}
                  position={currentLocation}
                  route={route}
                />
              ) : (
                <div className={`h-48 flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
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
        {/* A lógica dos botões permanece a mesma, pois as classes de botões
            (bg-green-500, etc.) geralmente têm bom contraste em ambos os temas.
            Caso contrário, eles também poderiam ser ajustados. */}
        {userRole === "CLIENT" &&
          contract.status === "PENDING_CLIENT_APPROVAL" && (
            <button
              onClick={handleApprove}
              className="px-4 py-2 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center"
            >
              <FaCheckCircle className="mr-2" /> Aceitar Proposta
            </button>
          )}

        {userRole === "DRIVER" && contract.status === "ACTIVE" && (
          <button
            onClick={handleStartTracking}
            className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center"
          >
            <FaMapMarkedAlt className="mr-2" /> Iniciar Entrega
          </button>
        )}

        {contract.status === "IN_PROGRESS" && (
          <>
            {userRole === "DRIVER" && (
              <button
                onClick={handleGoToTracking}
                className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center"
              >
                <FaMapMarkedAlt className="mr-2" /> Visualizar Rota
              </button>
            )}

            {userRole === "CLIENT" && (
              <button
                onClick={handleComplete}
                className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center"
              >
                <FaStar className="mr-2" /> Marcar como Concluído
              </button>
            )}

            {userRole !== "ADMIN" && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-gray-500 hover:bg-gray-600 transition-colors flex items-center"
              >
                <FaBan className="mr-2" /> Cancelar Contrato
              </button>
            )}
          </>
        )}

        {userRole === "DRIVER" &&
          contract.status === "PENDING_CLIENT_APPROVAL" && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center"
            >
              <FaTrash className="mr-2" /> Retirar Proposta
            </button>
          )}

        {userRole === "ADMIN" &&
          ["PENDING_CLIENT_APPROVAL", "ACTIVE", "IN_PROGRESS"].includes(
            contract.status
          ) && (
            <button
              onClick={handleCancelByAdmin}
              className="px-4 py-2 rounded-md font-semibold cursor-pointer text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center"
            >
              <FaBan className="mr-2" /> Cancelar Contrato (Admin)
            </button>
          )}
      </div>
    </div>
  );
};

export default ContractCard;