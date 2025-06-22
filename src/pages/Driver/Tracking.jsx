import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map from "../../components/ui/Map";
import { createTracking } from "../../services/tracking";
import {
  getRouteDirections,
  getCoordinatesForAddress,
} from "../../services/route";
import { BackButton } from "../../components/ui/button/Back";
import Loading from "../../components/ui/modal/Loading";
import Alert from "../../components/ui/modal/Alert";
import { getContractById } from "../../services/contract";
import { getFreightById } from "../../services/freight";
import { getStateFullName } from "../../utils/stateUtils";

const TrackingPage = () => {
  const { id: contractId } = useParams();
  const navigate = useNavigate();
  const [freightDetails, setFreightDetails] = useState(null);
  const [contractDetails, setContractDetails] = useState(null);

  // Estados para o mapa, alinhados com Details.jsx
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);

  const [currentPosition, setCurrentPosition] = useState(null); // {lat, lng}
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // Efeito 1: Lidar com a validação inicial e buscar o contrato
  useEffect(() => {
    if (!contractId) {
      setAlert({
        show: true,
        message: "ID do contrato não encontrado. Redirecionando...",
        type: "error",
      });
      setTimeout(() => navigate("/driver/freights"), 3000);
      return;
    }

    const fetchContractDetails = async () => {
      setLoading(true);
      try {
        const contractData = await getContractById(contractId);
        console.log(contractData);
        if (contractData) {
          setContractDetails(contractData);
        } else {
          throw new Error("Contrato não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do contrato:", error);
        setAlert({
          show: true,
          message: "Falha ao carregar os detalhes do contrato.",
          type: "error",
        });
        setTimeout(() => navigate("/driver/freights"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [contractId, navigate]);

  // Efeito 2: Buscar detalhes do frete QUANDO o contrato for carregado
  useEffect(() => {
    if (contractDetails && contractDetails.freightId) {
      const fetchFreightDetails = async () => {
        try {
          const response = await getFreightById(contractDetails.freightId);
          console.log(response);
          setFreightDetails(response);
        } catch (error) {
          console.error("Erro ao buscar detalhes do frete:", error);
          setAlert({
            show: true,
            message: "Não foi possível carregar os detalhes do frete.",
            type: "error",
          });
        }
      };
      fetchFreightDetails();
    }
  }, [contractDetails]);

  // Efeito 3: Lógica unificada para buscar coordenadas e rota, igual ao Details.jsx
  useEffect(() => {
    const fetchRouteData = async () => {
      if (!freightDetails) return;

      setLoading(true);
      try {
        const originState = getStateFullName(freightDetails.origin_state);
        const destinationState = getStateFullName(
          freightDetails.destination_state
        );

        const originAddress = `${freightDetails.origin_city}, ${originState}, Brasil`;
        const destinationAddress = `${freightDetails.destination_city}, ${destinationState}, Brasil`;

        const [originCoordString, destinationCoordString] = await Promise.all([
          getCoordinatesForAddress(originAddress),
          getCoordinatesForAddress(destinationAddress),
        ]);

        if (!originCoordString || !destinationCoordString) {
          throw new Error(
            "Não foi possível obter as coordenadas para um dos endereços."
          );
        }

        const originCoords = originCoordString.split(",").map(Number).reverse();
        setOrigin({
          coords: originCoords,
          label: `${freightDetails.origin_city} - ${freightDetails.origin_state}`,
        });

        const destinationCoords = destinationCoordString
          .split(",")
          .map(Number)
          .reverse();
        setDestination({
          coords: destinationCoords,
          label: `${freightDetails.destination_city} - ${freightDetails.destination_state}`,
        });

        const response = await getRouteDirections(
          originCoordString,
          destinationCoordString
        );
        setRoute(response.data.coordinates || []);
      } catch (error) {
        console.error("Erro ao carregar dados do mapa:", error);
        setAlert({
          show: true,
          message: "Não foi possível carregar os dados completos da rota.",
          type: "error",
        });
        setRoute([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [freightDetails]);

  const handleSendLocation = () => {
    setLoading(true);
    setAlert({ show: false, message: "" });

    const options = {
      enableHighAccuracy: true,
      timeout: 20000, // Aumentado para 20 segundos
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        if (!origin || !destination) {
          setAlert({
            show: true,
            message: "A rota de origem e destino ainda não foi carregada.",
            type: "error",
          });
          setLoading(false);
          return;
        }

        const trackingData = {
          currentLatitude: latitude,
          currentLongitude: longitude,
          contractId: parseInt(contractId, 10),
          originLatitude: origin.coords[0], // coords é [lat, lon]
          originLongitude: origin.coords[1],
          destinationLatitude: destination.coords[0],
          destinationLongitude: destination.coords[1],
        };

        try {
          const response = await createTracking(trackingData);
          if (response.status === 201) {
            setAlert({
              show: true,
              message: "Localização enviada com sucesso!",
              type: "success",
            });
            setCurrentPosition({ lat: latitude, lng: longitude });
          } else {
            const errorMessage =
              response.data?.message || "Falha ao enviar a localização.";
            setAlert({ show: true, message: errorMessage, type: "error" });
          }
        } catch (error) {
          setAlert({
            show: true,
            message: "Erro de comunicação com o servidor.",
            type: "error",
          });
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Erro ao obter geolocalização", error);
        let message = "Não foi possível obter sua localização.";
        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Você precisa permitir o acesso à localização no seu navegador.";
        } else if (error.code === error.TIMEOUT) {
          message =
            "A busca pela localização demorou demais. Tente novamente em um local com melhor sinal.";
        }
        setAlert({ show: true, message, type: "error" });
        setLoading(false);
      },
      options
    );
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      {loading && <Loading />}
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "" })}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Acompanhamento de Frete</h1>
      <p className="mb-4 text-sm text-gray-600">Contrato ID: {contractId}</p>

      <div className="w-full max-w-4xl h-96 mb-4 rounded-lg shadow-lg overflow-hidden">
        <Map
          origin={origin}
          destination={destination}
          route={route}
          currentPosition={
            currentPosition
              ? {
                  coords: [currentPosition.lat, currentPosition.lng],
                  label: "Sua Posição",
                }
              : null
          }
        />
      </div>
      <div className="flex space-x-4">
        <BackButton navigateTo="/driver/contracts" />
      </div>
    </div>
  );
};

export default TrackingPage;
