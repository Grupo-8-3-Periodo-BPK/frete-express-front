import React from 'react';
import { useTheme } from '../../../contexts/AuthContext';
import { MapPin, Calendar, DollarSign, ArrowRight, Clock, CheckCircle, XCircle, ThumbsUp } from 'lucide-react';

// --- STYLES FOR DARK MODE ---
const statusStylesDark = {
  PENDING: {
    text: 'Pendente de Aceite',
    bg: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    icon: <Clock size={14} />
  },
  ACCEPTED: {
    text: 'Aceito - Agendado',
    bg: 'bg-green-500/20',
    textColor: 'text-green-400',
    icon: <CheckCircle size={14} />
  },
  IN_PROGRESS: {
    text: 'Em Andamento',
    bg: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    icon: <ArrowRight size={14} className="animate-pulse" />
  },
  COMPLETED: {
    text: 'Concluído',
    bg: 'bg-gray-600/20',
    textColor: 'text-gray-400',
    icon: <CheckCircle size={14} />
  }
};

// --- STYLES FOR LIGHT MODE ---
const statusStylesLight = {
  PENDING: {
    text: 'Pendente de Aceite',
    bg: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: <Clock size={14} />
  },
  ACCEPTED: {
    text: 'Aceito - Agendado',
    bg: 'bg-green-100',
    textColor: 'text-green-800',
    icon: <CheckCircle size={14} />
  },
  IN_PROGRESS: {
    text: 'Em Andamento',
    bg: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: <ArrowRight size={14} className="animate-pulse" />
  },
  COMPLETED: {
    text: 'Concluído',
    bg: 'bg-gray-200',
    textColor: 'text-gray-700',
    icon: <CheckCircle size={14} />
  }
};

// Helper functions remain the same
const formatDate = (dateString) => new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function ContractCard({ contract }) {
  const { darkMode } = useTheme();

  // Choose the correct style object based on the theme
  const C = darkMode ? statusStylesDark : statusStylesLight;
  const style = C[contract.status] || C.COMPLETED;

  // Handler functions for actions (to be implemented)
  const handleAccept = () => console.log(`Accepted contract ${contract.id}`);
  const handleReject = () => console.log(`Rejected contract ${contract.id}`);

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] duration-300 ${
      darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
    }`}>
      <div className="p-5">
        {/* Card Header with Route and Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500">
              <MapPin size={14}/> <span>{contract.freight.origin.city} - {contract.freight.origin.state}</span>
              <ArrowRight size={14}/> <span>{contract.freight.destination.city} - {contract.freight.destination.state}</span>
            </div>
            <h3 className={`text-xl font-bold mt-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>{contract.freight.name}</h3>
          </div>
          <div className={`flex items-center gap-2 py-1 px-3 rounded-full text-xs font-semibold whitespace-nowrap ${style.bg} ${style.textColor}`}>
            {style.icon}
            <span>{style.text}</span>
          </div>
        </div>

        {/* Main Information */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 my-4 py-4 border-y ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-gray-500"/>
              <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Período da Viagem</span>
            </div>
            <p className={`ml-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {`${formatDate(contract.pickup_date)} a ${formatDate(contract.delivery_date)}`}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-gray-500"/>
              <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Valor Acordado</span>
            </div>
            <p className={`ml-8 font-bold text-lg ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                {formatCurrency(contract.agreed_value)}
            </p>
          </div>
        </div>

        {/* Client and Actions */}
        <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm text-gray-500">Cliente</p>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{contract.client.name}</p>
            </div>
            <div className="flex gap-3">
              {contract.status === 'PENDING' ? (
                <>
                  <button onClick={handleReject} className={`flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-md transition-colors ${
                      darkMode ? 'bg-red-800/80 hover:bg-red-700 text-white' : 'bg-red-200 hover:bg-red-300 text-red-800'
                  }`}>
                    <XCircle size={16} /> Recusar
                  </button>
                  <button onClick={handleAccept} className={`flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-md transition-colors ${
                      darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}>
                    <ThumbsUp size={16} /> Aceitar
                  </button>
                </>
              ) : (
                <button className={`text-sm font-semibold py-2 px-4 rounded-md transition-colors ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
                  Ver Detalhes
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}