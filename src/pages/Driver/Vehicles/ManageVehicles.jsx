import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, Eye, Plus, Filter } from "lucide-react";
import { useAuth, useTheme } from "../../../contexts/AuthContext";
import {
  getVehiclesByUser,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../../services/vehicle";
import VehicleForm from "../../../components/forms/VehicleForm";

const ManageVehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // O filtro de status foi removido pois o campo 'status' não existe no seu modelo de dados da API
  // const [filterStatus, setFilterStatus] = useState("all");
  const { darkMode } = useTheme();
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Função para buscar os veículos do usuário logado
  const fetchVehicles = async () => {
    // Garante que temos um ID de usuário antes de fazer a chamada
    if (user?.user_id) {
      try {
        setError(null); // Limpa erros anteriores
        setLoading(true);
        const data = await getVehiclesByUser(user.user_id);
        if (Array.isArray(data)) {
          setVehicles(data);
        } else {
            // Se a API retornar um erro com uma mensagem (como nos seus exemplos de serviço)
            throw new Error(data.message || 'Resposta inesperada da API');
        }
      } catch (err) {
        setError("Falha ao carregar os veículos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
        setLoading(false);
        setVehicles([]); // Limpa os veículos se não houver usuário
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]); // A dependência do 'user' garante que a função será chamada quando o usuário logar

  // Funções para controlar o formulário (modal)
  const handleOpenForm = (vehicle = null) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingVehicle(null);
    setIsFormOpen(false);
  };

  // Função para submeter o formulário (criar ou atualizar)
  const handleSubmitForm = async (formData) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData);
      } else {
        // Alinhado com o padrão de associação de usuário
        // O backend precisa saber qual usuário está criando o veículo
        await createVehicle({ ...formData, userId: user.user_id });
      }
      await fetchVehicles(); // Recarrega a lista para mostrar as mudanças
      handleCloseForm();
    } catch (err) {
      console.error("Erro ao salvar veículo", err);
      // Você pode adicionar um state para exibir o erro no formulário
    }
  };

  // Função para deletar um veículo
  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este veículo?")) {
      try {
        await deleteVehicle(id);
        // Em vez de recarregar tudo, podemos apenas remover o item do estado para uma UI mais rápida
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
      } catch (err) {
        console.error("Erro ao excluir veículo", err);
        // Adicionar feedback de erro para o usuário aqui
      }
    }
  };

  // Lógica de filtro baseada nos campos corretos da API
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Modal/Overlay para o Formulário */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="w-full max-w-2xl">
              <VehicleForm
                // O `key` garante que o formulário seja resetado ao alternar entre criar e editar
                key={editingVehicle ? editingVehicle.id : "new"}
                vehicle={editingVehicle}
                onSubmit={handleSubmitForm}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Gerenciar Meus Veículos
          </h1>
          <p className={`text-gray-400 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Visualize e gerencie todos os seus veículos cadastrados.
          </p>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-lg p-6 mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"} w-4 h-4`}/>
              <input
                type="text"
                placeholder="Buscar por placa, modelo ou marca..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleOpenForm()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Novo Veículo
            </button>
          </div>
        </div>

        {/* Stats - Simplificado para mostrar apenas o total */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Total de Veículos
                </h3>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{vehicles.length}</p>
            </div>
        </div>

        {/* Vehicle Table */}
        <div className={`rounded-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>Placa</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>Veículo</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>Categoria / Carroceria</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>Dimensões (A x L x C)</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>Ações</th>
                </tr>
              </thead>
              {!loading && !error && (
                <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`font-mono text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {vehicle.licensePlate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {vehicle.year} • {vehicle.color}
                          </div>
                        </div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{vehicle.category} / {vehicle.bodyType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {vehicle.height}m x {vehicle.width}m x {vehicle.length}m
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                           {/* O botão de "Ver" pode levar a uma página de detalhes do veículo */}
                          <button className={`p-1 rounded-full transition-colors ${darkMode ? "hover:bg-gray-600 text-blue-400" : "hover:bg-gray-200 text-blue-600"}`} title="Ver Detalhes">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenForm(vehicle)} className={`p-1 rounded-full transition-colors ${darkMode ? "hover:bg-gray-600 text-green-400" : "hover:bg-gray-200 text-green-600"}`} title="Editar Veículo">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteVehicle(vehicle.id)} className={`p-1 rounded-full transition-colors ${darkMode ? "hover:bg-gray-600 text-red-400" : "hover:bg-gray-200 text-red-600"}`} title="Excluir Veículo">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Indicadores de Estado */}
          {loading && (<div className="text-center py-12"><p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Carregando veículos...</p></div>)}
          {error && (<div className="text-center py-12"><p className="text-red-500">{error}</p></div>)}
          {!loading && filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {vehicles.length > 0 ? "Nenhum veículo encontrado com os filtros atuais." : "Você ainda não cadastrou nenhum veículo."}
              </p>
            </div>
          )}
        </div>

        {/* A paginação foi removida pois a lógica não estava implementada */}
      </div>
    </div>
  );
};

export default ManageVehicles;