import React, { useState, useMemo, useEffect } from 'react';
import ContractCard from '../../../components/ui/card/Contract'; // Adjust path if necessary
import { getContractsByDriver } from '../../../services/contract'; // Import the service
import { useAuth } from '../../../contexts/AuthContext'; // Assuming you have an AuthContext to get the user
import { useTheme } from '../../../contexts/AuthContext'; // Assuming path to ThemeContext

// Helper function to determine contract status remains the same
const getContractStatus = (contract) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); 
  const pickupDate = new Date(contract.pickupDate);
  const deliveryDate = new Date(contract.deliveryDate);

  if (!contract.driverAccepted && contract.clientAccepted) {
    return 'PENDING';
  }

  if (contract.driverAccepted && contract.clientAccepted) {
    if (now > deliveryDate) {
      return 'COMPLETED';
    }
    if (now >= pickupDate && now <= deliveryDate) {
      return 'IN_PROGRESS';
    }
    if (now < pickupDate) {
      return 'ACCEPTED';
    }
  }

  return 'UNKNOWN';
};

export default function DriverContractsPage() {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const tabs = [
    { id: 'PENDING', label: 'Pendentes' },
    { id: 'ACCEPTED', label: 'Aceitos' },
    { id: 'IN_PROGRESS', label: 'Em Andamento' },
    { id: 'COMPLETED', label: 'Concluídos' },
  ];

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await getContractsByDriver(user.user_id);
        setContracts(data || []);
        setError(null);
      } catch (e) {
        setError(e.message || 'Falha ao buscar os contratos. Tente novamente mais tarde.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user?.user_id]);

  const filteredContracts = useMemo(() => {
    return contracts
      .map(contract => {
        const status = getContractStatus(contract);
        return {
          id: contract.id,
          status: status,
          agreed_value: contract.agreedValue,
          pickup_date: contract.pickupDate,
          delivery_date: contract.deliveryDate,
          freight: {
            name: contract.freight.name,
            origin: { city: contract.freight.origin_city, state: contract.freight.origin_state },
            destination: { city: contract.freight.destination_city, state: contract.freight.destination_state },
          },
          client: { name: contract.client.name }
        };
      })
      .filter(c => c.status === activeTab);
  }, [contracts, activeTab]);

  return (
    <div className={`min-h-screen w-full ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    } py-8 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold">Meus Contratos</h1>
        <p className={`${
          darkMode ? "text-gray-400" : "text-gray-600"
        } mt-2`}>Visualize e gerencie suas propostas e viagens agendadas.</p>

        {/* Navigation Tabs */}
        <div className={`mt-8 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md transition-colors duration-200 focus:outline-none ${
                  activeTab === tab.id
                    ? (darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600')
                    : (darkMode 
                      ? 'border-transparent text-gray-400 hover:text-white hover:border-gray-500' 
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300')
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-16">
              <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Carregando contratos...</p>
            </div>
          ) : error ? (
            <div className={`text-center py-16 px-6 rounded-lg ${
                darkMode ? "bg-red-900/20 text-red-400" : "bg-red-100 text-red-700"
            }`}>
               <h3 className="text-xl font-semibold">Ocorreu um Erro</h3>
               <p className="mt-2">{error}</p>
            </div>
          ) : filteredContracts.length > 0 ? (
            <div className="space-y-6">
              {/* The ContractCard component is now responsible for its own theme */}
              {filteredContracts.map(contract => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 px-6 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}>
              <h3 className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>Nenhum contrato encontrado</h3>
              <p className={`mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>Não há nenhum contrato com o status "{tabs.find(t => t.id === activeTab)?.label}" no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}