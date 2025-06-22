import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import { useAuth, useTheme } from "../../../contexts/AuthContext";
import {
  getVehiclesByUser,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../../services/vehicle";
import VehicleForm from "../../../components/forms/VehicleForm";
import VehicleDetails from "../../../components/ui/card/VehicleDetails";
import Confirmation from "../../../components/ui/modal/Confirmation"; // Importa o modal de confirmação
import { AnimatePresence, motion } from "framer-motion";

const ManageVehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode } = useTheme();
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);

  // Novos estados para o modal de confirmação de exclusão
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vehicleToDeleteId, setVehicleToDeleteId] = useState(null);

  const fetchVehicles = async () => {
    if (user?.id) {
      try {
        setError(null);
        setLoading(true);
        const data = await getVehiclesByUser(user.id);
        if (Array.isArray(data)) {
          setVehicles(data);
        } else {
          throw new Error(data.message || "Resposta inesperada da API");
        }
      } catch (err) {
        setError("Falha ao carregar os veículos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setVehicles([]);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const handleOpenForm = (vehicle = null) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingVehicle(null);
    setIsFormOpen(false);
  };

  const handleOpenDetails = (vehicle) => {
    setViewingVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setViewingVehicle(null);
    setIsDetailsOpen(false);
  };

  const handleSubmitForm = async (formData) => {
    try {
      const payload = { ...formData, user: { id: user.id } };
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, payload);
      } else {
        await createVehicle(payload);
      }
      await fetchVehicles();
      handleCloseForm();
    } catch (err) {
      console.error("Erro ao salvar veículo", err);
    }
  };

  // Abre o modal de confirmação
  const handleDeleteVehicle = (id) => {
    setVehicleToDeleteId(id);
    setIsConfirmOpen(true);
  };

  // Fecha o modal de confirmação
  const handleCloseConfirm = () => {
    setVehicleToDeleteId(null);
    setIsConfirmOpen(false);
  };

  // Executa a exclusão após a confirmação
  const handleConfirmDelete = async () => {
    if (vehicleToDeleteId) {
      try {
        await deleteVehicle(vehicleToDeleteId);
        setVehicles(
          vehicles.filter((vehicle) => vehicle.id !== vehicleToDeleteId)
        );
        handleCloseConfirm();
      } catch (err) {
        console.error("Erro ao excluir veículo", err);
        // Opcional: Adicionar um feedback de erro aqui
        handleCloseConfirm();
      }
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      (vehicle.licensePlate?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (vehicle.model?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (vehicle.brand?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const modalAnimation = {
    backdrop: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    panel: {
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: "circOut" },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2, ease: "circIn" },
      },
    },
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-6`}
    >
      <div className="max-w-7xl mx-auto">
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center p-4"
              onClick={handleCloseForm}
              variants={modalAnimation.backdrop}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                className="w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
                variants={modalAnimation.panel}
              >
                <VehicleForm
                  key={editingVehicle ? editingVehicle.id : "new"}
                  vehicle={editingVehicle}
                  onSubmit={handleSubmitForm}
                  onCancel={handleCloseForm}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isDetailsOpen && (
            <motion.div
              className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center p-4"
              onClick={handleCloseDetails}
              variants={modalAnimation.backdrop}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                className="w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
                variants={modalAnimation.panel}
              >
                <VehicleDetails
                  vehicle={viewingVehicle}
                  onClose={handleCloseDetails}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isConfirmOpen && (
            <motion.div
              className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center p-4"
              onClick={handleCloseConfirm}
              variants={modalAnimation.backdrop}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Confirmation
                isOpen={isConfirmOpen}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmDelete}
                title="Excluir Veículo"
                message="Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita."
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Gerenciar Meus Veículos
          </h1>
          <p
            className={`text-gray-400 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Visualize e gerencie todos os seus veículos cadastrados.
          </p>
        </div>

        {/* Filters and Search */}
        <div
          className={`rounded-lg p-6 mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full md:w-auto">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } w-4 h-4`}
              />
              <input
                type="text"
                placeholder="Buscar por placa, modelo ou marca..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleOpenForm()}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Novo Veículo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total de Veículos
            </h3>
            <p
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {vehicles.length}
            </p>
          </div>
        </div>

        {/* Vehicle Table */}
        <div
          className={`rounded-lg overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-xs font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } uppercase tracking-wider`}
                  >
                    Placa
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } uppercase tracking-wider`}
                  >
                    Veículo
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } uppercase tracking-wider`}
                  >
                    Categoria / Carroceria
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } uppercase tracking-wider`}
                  >
                    Dimensões (A x L x C)
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } uppercase tracking-wider`}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              {!loading && !error && (
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  {filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className={`${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`font-mono text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {vehicle.licensePlate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {vehicle.year} • {vehicle.color}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {vehicle.category} / {vehicle.bodyType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {vehicle.height}m x {vehicle.width}m x{" "}
                          {vehicle.length}m
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleOpenDetails(vehicle)}
                            className={`p-1 rounded-full transition-colors ${
                              darkMode
                                ? "hover:bg-gray-600 text-blue-400"
                                : "hover:bg-gray-200 text-blue-600"
                            }`}
                            title="Ver Detalhes"
                          >
                            <Eye className="w-4 h-4 cursor-pointer" />
                          </button>
                          <button
                            onClick={() => handleOpenForm(vehicle)}
                            className={`p-1 rounded-full transition-colors ${
                              darkMode
                                ? "hover:bg-gray-600 text-green-400"
                                : "hover:bg-gray-200 text-green-600"
                            }`}
                            title="Editar Veículo"
                          >
                            <Edit className="w-4 h-4 cursor-pointer" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className={`p-1 rounded-full transition-colors ${
                              darkMode
                                ? "hover:bg-gray-600 text-red-400"
                                : "hover:bg-gray-200 text-red-600"
                            }`}
                            title="Excluir Veículo"
                          >
                            <Trash2 className="w-4 h-4 cursor-pointer" />
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
          {loading && (
            <div className="text-center py-12">
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Carregando veículos...
              </p>
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {!loading && filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {vehicles.length > 0
                  ? "Nenhum veículo encontrado com os filtros atuais."
                  : "Você ainda não cadastrou nenhum veículo."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVehicles;
