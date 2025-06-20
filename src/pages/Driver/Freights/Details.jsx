// src/components/FreightDetailView.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Package,
  Truck,
  Weight,
  Box,
  AlertCircle,
  Navigation,
  ArrowLeft,
  DollarSign,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { BackButton } from "../../../components/ui/button/Back.jsx";
import { getFreightById } from "../../../services/freight.js";
import { useTheme } from "../../../contexts/AuthContext";

const formatCurrency = (value) =>
  value
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)
    : "N/A";
const formatDate = (dateString) =>
  dateString
    ? new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR")
    : "N/A";
const formatWeight = (value) => (value ? `${value} kg` : "N/A");

// Componente principal da página de detalhes
function DriverFreightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [freight, setFreight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchFreightDetails = async () => {
      try {
        setLoading(true);
        const data = await getFreightById(id);
        setFreight(data);
      } catch (err) {
        setError(
          err.message || "Não foi possível carregar os detalhes do frete."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFreightDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        className={`min-h-screen p-8 flex justify-center items-center ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>
          Carregando detalhes do frete...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-8 flex flex-col justify-center items-center text-center ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3
          className={`mt-4 text-lg font-medium ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Ocorreu um Erro
        </h3>
        <p
          className={`mt-2 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </p>
        <BackButton
          message="Voltar para Fretes"
          navigateTo="/driver/freights"
        />
      </div>
    );
  }

  if (!freight) {
    return null;
  }

  const volume = (freight.height * freight.width * freight.length).toFixed(2);

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } py-8 px-4`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <BackButton message="Voltar" navigateTo="/driver/freights" />
          <h1
            className={`text-4xl font-bold mt-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {freight.name}
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Visualize os detalhes do frete e candidate-se se for do seu
            interesse.
          </p>
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} /> Rota e Prazos
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Origem
                  </p>
                  <p className="font-semibold">
                    {freight.origin_city} - {freight.origin_state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Destino
                  </p>
                  <p className="font-semibold">
                    {freight.destination_city} - {freight.destination_state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Data de Coleta
                  </p>
                  <p className="font-semibold">
                    {formatDate(freight.initial_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Data de Entrega
                  </p>
                  <p className="font-semibold">
                    {formatDate(freight.final_date)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package size={20} /> Detalhes da Carga
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Peso Bruto
                  </p>
                  <p className="font-semibold">
                    {formatWeight(freight.weight)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dimensões (A x L x C)
                  </p>
                  <p className="font-semibold">{`${freight.height}m x ${freight.width}m x ${freight.length}m`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Volume
                  </p>
                  <p className="font-semibold">{volume} m³</p>
                </div>
                <div
                  className={`pt-4 mt-4 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Valor Oferecido
                  </p>
                  <p className="text-2xl font-bold text-green-500">
                    {formatCurrency(freight.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverFreightDetails;
