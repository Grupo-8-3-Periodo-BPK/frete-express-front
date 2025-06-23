import React, { useState, useEffect } from "react";
import { useTheme } from "../../../contexts/AuthContext.jsx";
import {
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
} from "../../../services/vehicle.js";
import { getAllDrivers } from "../../../services/user.js";
import Loading from "../../../components/ui/modal/Loading.jsx";
import { BackButton } from "../../../components/ui/button/Back.jsx";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import VehicleForm from "../../../components/forms/VehicleForm";
import VehicleDetails from "../../../components/ui/card/VehicleDetails";
import Confirmation from "../../../components/ui/modal/Confirmation";
import Alert from "../../../components/ui/modal/Alert";

function ManageAllVehicles() {
  const { darkMode } = useTheme();

  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vehicleToDeleteId, setVehicleToDeleteId] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [vehiclesData, driversData] = await Promise.all([
        getAllVehicles(),
        getAllDrivers(0, 1000),
      ]);
      console.log(vehiclesData);
      console.log(driversData);
      setVehicles(vehiclesData || []);
      setUsers(driversData.content || []);
    } catch (err) {
      const errorMessage = err.message || "Falha ao carregar dados.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await getAllVehicles();
      console.log(data);
      setVehicles(data || []);
    } catch (err) {
      console.error("Falha ao recarregar veículos:", err);
      setError(err.message || "Falha ao recarregar os veículos.");
    }
  };

  const handleOpenForm = (vehicle) => {
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

  const handleDeleteVehicle = (id) => {
    setVehicleToDeleteId(id);
    setIsConfirmOpen(true);
  };
  const handleCloseConfirm = () => {
    setVehicleToDeleteId(null);
    setIsConfirmOpen(false);
  };

  const handleSubmitForm = async (formData) => {
    if (!editingVehicle) return;
    try {
      const payload = { ...formData, user: { id: editingVehicle.user.id } };
      await updateVehicle(editingVehicle.id, payload);
      await fetchVehicles();
      handleCloseForm();
    } catch (err) {
      console.error("Erro ao atualizar veículo (admin)", err);
      setError("Falha ao atualizar o veículo. Tente novamente.");
    }
  };

  const handleConfirmDelete = async () => {
    if (vehicleToDeleteId) {
      try {
        await deleteVehicle(vehicleToDeleteId);
        await fetchVehicles();
        handleCloseConfirm();
      } catch (err) {
        console.error("Erro ao excluir veículo (admin)", err);
        setError("Falha ao excluir o veículo. Tente novamente.");
        handleCloseConfirm();
      }
    }
  };

  const userMap = new Map(users.map((user) => [user.id, user.name]));
  console.log(userMap);

  const filteredVehicles = vehicles.filter((vehicle) => {
    console.log(vehicle);
    const searchTermLower = search.toLowerCase();
    const driverName = userMap.get(vehicle.user?.id)?.toLowerCase() || "";

    const matchSearch =
      search === "" ||
      vehicle.licensePlate?.toLowerCase().includes(searchTermLower) ||
      vehicle.model?.toLowerCase().includes(searchTermLower) ||
      vehicle.brand?.toLowerCase().includes(searchTermLower) ||
      driverName.includes(searchTermLower);
    const matchCategory =
      categoryFilter === "ALL" || vehicle.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const modalAnimation = {
    backdrop: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
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

  if (loading) return <Loading />;

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert message={error} type="error" onClose={() => setError(null)} />
        )}

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
                  key={editingVehicle ? editingVehicle.id : "edit"}
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
                message="Tem certeza que deseja excluir este veículo? Esta ação é irreversível e afetará o usuário proprietário."
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Gerenciar Veículos
            </h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Visualize e gerencie todos os veículos da plataforma.
            </p>
          </div>
          <BackButton />
        </div>

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
                placeholder="Buscar por placa, modelo, marca ou motorista..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full md:w-auto">
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="ALL">Todas as Categorias</option>
                <option value="LEVE">Leve</option>
                <option value="MEDIO">Médio</option>
                <option value="PESADO">Pesado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        <div
          className={`rounded-lg overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="overflow-x-auto">
            <table
              className={`w-full text-sm text-left ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <tr>
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
                    Placa
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } uppercase tracking-wider`}
                  >
                    Motorista
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
              <tbody
                className={`divide-y ${
                  darkMode
                    ? "bg-gray-800 divide-gray-700"
                    : "bg-white divide-gray-200"
                }`}
              >
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className={`${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
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
                          {vehicle.year} - {vehicle.color}
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {vehicle.licensePlate}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {userMap.get(vehicle.user?.id) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleOpenDetails(vehicle)}
                            title="Ver Detalhes"
                            className={`p-1 rounded-full transition-colors ${
                              darkMode
                                ? "text-blue-400 hover:bg-gray-600"
                                : "text-blue-600 hover:bg-gray-200"
                            }`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenForm(vehicle)}
                            title="Editar Veículo"
                            className={`p-1 rounded-full transition-colors ${
                              darkMode
                                ? "text-green-400 hover:bg-gray-600"
                                : "text-green-600 hover:bg-gray-200"
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            title="Excluir Veículo"
                            className={`p-1 rounded-full transition-colors ${
                              darkMode
                                ? "text-red-400 hover:bg-gray-600"
                                : "text-red-600 hover:bg-gray-200"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center text-sm text-gray-500"
                    >
                      {vehicles.length > 0
                        ? "Nenhum veículo encontrado com os filtros atuais."
                        : "Nenhum veículo cadastrado na plataforma."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAllVehicles;
