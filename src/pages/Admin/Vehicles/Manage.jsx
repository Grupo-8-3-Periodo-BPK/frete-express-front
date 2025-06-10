import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { getAllVehicles } from '../../../services/vehicle';
import { useAuth, useTheme } from '../../../contexts/AuthContext';

const ManageAllVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // A variável darkMode continua útil para alternar entre os temas
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Simulação de dados para visualização rápida (remova se já tiver o serviço)
        const data = await getAllVehicles(); 
        setVehicles(data);
      } catch (error) {
        console.error("Falha ao buscar veículos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchLower) ||
                          vehicle.model.toLowerCase().includes(searchLower) ||
                          vehicle.brand.toLowerCase().includes(searchLower) ||
                          vehicle.renavam.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || vehicle.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Função de status adaptada para ambos os modos
  const getStatusColor = (status) => {
    if (darkMode) {
        switch (status) {
            case 'Ativo': return 'bg-green-700 bg-opacity-20 text-green-300';
            case 'Inativo': return 'bg-red-700 bg-opacity-20 text-red-300';
            case 'Manutenção': return 'bg-yellow-700 bg-opacity-20 text-yellow-300';
            default: return 'bg-gray-700 bg-opacity-20 text-gray-300';
        }
    }
    // Cores suaves para o modo claro
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Inativo': return 'bg-red-100 text-red-800';
      case 'Manutenção': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 flex justify-center items-center ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-800'}`}>
        <p className="text-2xl">Carregando veículos...</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-800'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Gerenciar Todos os Veículos</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Visualize e gerencie todos os veículos cadastrados no sistema</p>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="flex gap-4 w-full md:w-auto flex-grow">
              <div className="relative flex-grow md:flex-grow-0 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por placa, modelo, marca..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  className={`pl-10 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${darkMode ? 'bg-slate-700 border border-slate-600 text-white' : 'bg-white border border-slate-300 text-slate-900'}`}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="manutenção">Manutenção</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 items-center w-full md:w-auto">
                <div className="text-right">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total de Veículos</h3>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{vehicles.length}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center">
                  <Plus className="w-5 h-5" />
                  Novo Veículo
                </button>
            </div>
          </div>
        </div>

        {/* Vehicle Table */}
        <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>Placa</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>Veículo</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>Especificações</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>Carroceria</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>Ações</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className={`font-mono text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{vehicle.licensePlate}</div>
                        <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>RENAVAM: {vehicle.renavam}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{vehicle.brand} {vehicle.model}</div>
                        <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{vehicle.year} • {vehicle.color}</div>
                        <div className="text-xs text-blue-600">{vehicle.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <div>Peso: {vehicle.weight.toLocaleString()}kg</div>
                        <div>Dim: {vehicle.length}×{vehicle.width}×{vehicle.height}m</div>
                        <div>Eixos: {vehicle.axlesCount}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{vehicle.bodyType}</div>
                        <div className={`${vehicle.hasCanvas ? 'text-green-600' : 'text-slate-400'}`}>
                          {vehicle.hasCanvas ? '✓ Com Lona' : '✗ Sem Lona'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className={`p-1 rounded-full transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-slate-600' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'}`}>
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className={`p-1 rounded-full transition-colors ${darkMode ? 'text-green-400 hover:text-green-300 hover:bg-slate-600' : 'text-slate-500 hover:text-green-600 hover:bg-slate-100'}`}>
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className={`p-1 rounded-full transition-colors ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-slate-600' : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'}`}>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-16">
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Nenhum veículo encontrado.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Mostrando {filteredVehicles.length} de {vehicles.length} veículos
          </div>
          <div className="flex space-x-2">
            <button className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:hover:bg-slate-700' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:hover:bg-white'}`} disabled>
              Anterior
            </button>
            <button className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`} disabled>
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAllVehicles;