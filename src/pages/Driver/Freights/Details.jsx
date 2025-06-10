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
} from "lucide-react";
import { useParams } from "react-router-dom";
import { BackButton } from "../../../components/ui/button/Back";
import { getTrackingById } from "../../../services/tracking"; 
import { useTheme } from "../../../contexts/AuthContext";

// Função para formatar data (sem alterações)
const formatDate = (dateString) => {
  const date = new Date(dateString + "T00:00:00");
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return date.toLocaleDateString("pt-BR", options);
};

// Componente principal da página de detalhes
function FreightDetail() {
  const { id } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        const response = await getTrackingById(id);
        setTrackingData(response);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Não foi possível carregar os detalhes do rastreamento.";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrackingData();
    }
  }, [id]);

  // Os estados de Loading e Error foram adaptados para o tema também
  if (loading) {
    return (
      <div className={`min-h-screen p-8 flex justify-center items-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-8 flex flex-col justify-center items-center text-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className={`mt-4 text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Ocorreu um Erro</h3>
        <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{error}</p>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className={`min-h-screen p-8 flex justify-center items-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <p>Dados de rastreamento não encontrados.</p>
      </div>
    );
  }

  // CORREÇÃO: Removido o `.data`. Assumimos que a API retorna o objeto diretamente.
  const { freight, contract, currentLocation } = trackingData.data;
  const driverData = contract.driver || {};
  const vehicleData = contract.vehicle || {};
  const volume = (freight.height * freight.width * freight.length).toFixed(2);

  return (
    <div className={`min-h-screen w-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <BackButton message="Voltar" navigateTo="/driver/freights" />
          <h1 className={`text-4xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{freight.name}</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Acompanhe todos os detalhes da sua entrega.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal (Esquerda) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Card de Rota e Prazos */}
            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Rota, Prazos e Localização</h2>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                  <MapPin className="text-blue-500" size={32} />
                  <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Origem</p>
                    <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{`${freight.origin_city} - ${freight.origin_state}`}</p>
                  </div>
                </div>
                <div className={`flex-grow sm:mx-4 border-t-2 sm:border-t-0 sm:border-l-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} h-8 sm:h-auto sm:w-auto self-center`}></div>
                <div className="flex items-center gap-4">
                  <MapPin className="text-green-500" size={32} />
                  <div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Destino</p>
                    <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{`${freight.destination_city} - ${freight.destination_state}`}</p>
                  </div>
                </div>
              </div>
              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row justify-between text-center gap-6`}>
                <div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center justify-center gap-2`}><Calendar size={16} /> Data de Coleta</p>
                  <p className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDate(freight.initial_date)}</p>
                </div>
                <div className="text-center">
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center justify-center gap-2`}><Navigation size={16} /> Localização Atual</p>
                    <p className="font-semibold text-lg text-yellow-500">{currentLocation}</p>
                </div>
                <div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center justify-center gap-2`}><Calendar size={16} /> Previsão de Entrega</p>
                  <p className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDate(freight.final_date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Lateral (Direita) */}
          <div className="flex flex-col gap-8">
            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}><Package size={20} /> Detalhes da Carga</h2>
              <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex justify-between items-center"><span className="flex items-center gap-2"><Weight size={16} /> Peso Bruto</span><span className={`font-mono px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}>{`${freight.weight} kg`}</span></li>
                <li className="flex justify-between items-center"><span className="flex items-center gap-2"><Box size={16} /> Dimensões</span><span className={`font-mono px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}>{`${freight.length} x ${freight.width} x ${freight.height} m`}</span></li>
                <li className={`flex justify-between items-center pt-2 mt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}><span className="flex items-center gap-2 font-semibold"><Box size={16} /> Cubicagem</span><span className={`font-mono text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{`${volume} m³`}</span></li>
              </ul>
            </div>
            
            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}><Truck size={20} /> Transporte</h2>
              <div className="flex items-center gap-4">
                <img src={driverData.avatarUrl || `https://ui-avatars.com/api/?name=${driverData.name || 'N A'}&background=0D8ABC&color=fff`} alt="Foto do motorista" className="w-16 h-16 rounded-full" />
                <div>
                  <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{driverData.name || "Aguardando motorista"}</p>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{`${vehicleData.brand || ''} ${vehicleData.model || 'Veículo não atribuído'}`}</p>
                  {vehicleData.licensePlate && <p className={`font-mono text-sm px-2 py-1 rounded inline-block mt-1 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}>{vehicleData.licensePlate}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreightDetail;