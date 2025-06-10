import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Plus, Calendar, DollarSign, Truck, User } from 'lucide-react';

const ManageContracts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // MODO CLADO E DADOS DE VERDADE, REDESIGN DO COMPONENTE

  const contracts = [
    {
      id: 1,
      client_name: 'Transportadora ABC Ltda',
      driver_name: 'João Silva',
      freight_name: 'Transporte SP-RJ Urgente',
      vehicle_plate: 'ABC-1234',
      agreed_value: 2500.00,
      pickup_date: '2025-05-15',
      delivery_date: '2025-05-20',
      status: 'Ativo',
      progress: 'Em Andamento'
    },
    {
      id: 2,
      client_name: 'Logística Prime',
      driver_name: 'Maria Santos',
      freight_name: 'Carga Eletrônicos BH-SP',
      vehicle_plate: 'DEF-5678',
      agreed_value: 1800.50,
      pickup_date: '2025-05-12',
      delivery_date: '2025-05-16',
      status: 'Concluído',
      progress: 'Entregue'
    },
    {
      id: 3,
      client_name: 'Distribuidora Sul',
      driver_name: 'Pedro Oliveira',
      freight_name: 'Mercadorias RS-SC',
      vehicle_plate: 'GHI-9012',
      agreed_value: 3200.00,
      pickup_date: '2025-05-18',
      delivery_date: '2025-05-22',
      status: 'Pendente',
      progress: 'Aguardando Coleta'
    },
    {
      id: 4,
      client_name: 'Express Cargas',
      driver_name: 'Ana Costa',
      freight_name: 'Encomendas RJ-ES',
      vehicle_plate: 'JKL-3456',
      agreed_value: 1450.75,
      pickup_date: '2025-05-10',
      delivery_date: '2025-05-14',
      status: 'Concluído',
      progress: 'Entregue'
    },
    {
      id: 5,
      client_name: 'Mega Transportes',
      driver_name: 'Carlos Lima',
      freight_name: 'Carga Pesada MG-GO',
      vehicle_plate: 'MNO-7890',
      agreed_value: 4500.00,
      pickup_date: '2025-05-20',
      delivery_date: '2025-05-25',
      status: 'Cancelado',
      progress: 'Cancelado'
    },
    {
      id: 6,
      client_name: 'FastLog Brasil',
      driver_name: 'Roberto Silva',
      freight_name: 'Documentos SP-DF',
      vehicle_plate: 'PQR-1357',
      agreed_value: 950.00,
      pickup_date: '2025-05-14',
      delivery_date: '2025-05-17',
      status: 'Ativo',
      progress: 'Em Trânsito'
    }
  ];

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.freight_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.vehicle_plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contract.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-blue-700 text-blue-800';
      case 'Concluído': return 'bg-green-700 text-green-800';
      case 'Pendente': return 'bg-yellow-500 text-yellow-800';
      case 'Cancelado': return 'bg-red-700 text-red-800';
      default: return 'bg-gray-700 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    switch (progress) {
      case 'Em Andamento':
      case 'Em Trânsito': return 'text-blue-400';
      case 'Entregue': return 'text-green-400';
      case 'Aguardando Coleta': return 'text-yellow-400';
      case 'Cancelado': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Todos os Contratos</h1>
          <p className="text-slate-400">Visualize e gerencie todos os contratos de frete do sistema</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por frete, cliente, motorista ou placa..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="ativo">Ativo</option>
                  <option value="concluído">Concluído</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-slate-400 text-sm">Total de Contratos</h3>
            <p className="text-2xl font-bold text-white">{contracts.length}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-slate-400 text-sm">Ativos</h3>
            <p className="text-2xl font-bold text-blue-400">{contracts.filter(c => c.status === 'Ativo').length}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-slate-400 text-sm">Concluídos</h3>
            <p className="text-2xl font-bold text-green-400">{contracts.filter(c => c.status === 'Concluído').length}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-slate-400 text-sm">Pendentes</h3>
            <p className="text-2xl font-bold text-yellow-400">{contracts.filter(c => c.status === 'Pendente').length}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-slate-400 text-sm">Valor Total</h3>
            <p className="text-xl font-bold text-green-400">
              {formatCurrency(contracts.filter(c => c.status !== 'Cancelado').reduce((sum, c) => sum + c.agreed_value, 0))}
            </p>
          </div>
        </div>

        {/* Contract Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Frete</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Motorista</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Veículo</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Datas</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{contract.freight_name}</div>
                        <div className={`text-sm ${getProgressColor(contract.progress)}`}>
                          <Truck className="inline w-3 h-3 mr-1" />
                          {contract.progress}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-slate-400 mr-2" />
                        <div className="text-sm font-medium text-white">{contract.client_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{contract.driver_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm font-medium text-blue-400">{contract.vehicle_plate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-green-400 font-semibold">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatCurrency(contract.agreed_value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center text-slate-300">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="text-xs">Coleta:</span>
                        </div>
                        <div className="text-white text-xs">{formatDate(contract.pickup_date)}</div>
                        <div className="flex items-center text-slate-300 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="text-xs">Entrega:</span>
                        </div>
                        <div className="text-white text-xs">{formatDate(contract.delivery_date)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-400 hover:text-green-300 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhum contrato encontrado</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-slate-400">
            Mostrando {filteredContracts.length} de {contracts.length} contratos
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors">
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContracts;