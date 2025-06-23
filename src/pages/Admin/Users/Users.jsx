import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../../contexts/AuthContext.jsx";
import {
  getAllUsers,
  getAllClients,
  getAllDrivers,
  deleteUser,
} from "../../../services/user.js";
import AddUser from "../../../components/ui/modal/AddUser.jsx";
import EditUser from "../../../components/ui/modal/EditUser.jsx";
import Confirmation from "../../../components/ui/modal/Confirmation.jsx";
import { Edit, Trash2 } from "lucide-react";

const UserPlusIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM14 13a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.293 9.293a1 1 0 011.414 0L8 10.586l1.293-1.293a1 1 0 111.414 1.414L9.414 12l1.293 1.293a1 1 0 01-1.414 1.414L8 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L6.586 12 5.293 10.707a1 1 0 010-1.414zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" />
  </svg>
);
const UsersIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);
const ShieldCheckIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-7a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
const EllipsisVerticalIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
  </svg>
);
const MagnifyingGlassIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
  </svg>
);

function Users() {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const menuRef = useRef(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const { page, size } = pagination;

      switch (filterRole) {
        case "DRIVER":
          response = await getAllDrivers(page, size);
          break;
        case "CLIENT":
          response = await getAllClients(page, size);
          break;
        case "All":
        case "ADMIN":
        default:
          response = await getAllUsers(page, size);
          break;
      }

      if (response && response.content) {
        setUsers(response.content);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          page: response.number,
        }));
        setError(null);
      } else {
        setUsers([]);
        setPagination((prev) => ({ ...prev, totalPages: 1, totalElements: 0 }));
      }
    } catch (err) {
      setError(err.message || "Erro ao buscar usuários");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filterRole, pagination.page, pagination.size]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete);
        fetchUsers();
      } catch (err) {
        setError(err.message || "Erro ao excluir usuário");
        alert("Erro ao excluir usuário.");
      } finally {
        setIsConfirmDeleteOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setIsEditUserModalOpen(true);
  };

  const filteredUsers = users
    .filter((user) => {
      if (filterRole === "ADMIN") return user.role === "ADMIN";
      return true;
    })
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const roleMapping = {
    ADMIN: "Administrador",
    CLIENT: "Cliente",
    DRIVER: "Motorista",
  };

  const StatCard = ({ icon, title, value, colorClass }) => (
    <div
      className={`p-5 rounded-xl shadow-md flex items-center gap-4 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
      }`}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* --- CABEÇALHO --- */}
        <header className="flex items-center justify-between">
          <div>
            <h1
              className={`text-3xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Gestão de Usuários
            </h1>
            <p className="mt-1 text-sm">
              Adicione, edite e gerencie os usuários do sistema.
            </p>
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-2 bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-sky-700 transition-colors"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>Adicionar Usuário</span>
          </button>
        </header>

        {/* --- CARTÕES DE ESTATÍSTICAS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            icon={<UsersIcon className="w-6 h-6 text-white" />}
            title="Total de Usuários"
            value={pagination.totalElements}
            colorClass="bg-blue-500"
          />
          <StatCard
            icon={<ShieldCheckIcon className="w-6 h-6 text-white" />}
            title="Administradores na Página"
            value={users.filter((u) => u.role === "ADMIN").length}
            colorClass="bg-green-500"
          />
          <StatCard
            icon={<UsersIcon className="w-6 h-6 text-white" />}
            title="Clientes na Página"
            value={users.filter((u) => u.role === "CLIENT").length}
            colorClass="bg-yellow-500"
          />
        </div>

        {/* --- BARRA DE FERRAMENTAS --- */}
        <div
          className={`p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <div className="relative w-full md:w-1/2">
            <MagnifyingGlassIcon
              className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-sky-500 transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300"
              }`}
            />
          </div>
          <div className="w-full md:w-auto">
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPagination((prev) => ({ ...prev, page: 0 }));
              }}
              className={`w-full md:w-48 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-sky-500 transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <option value="All">Todas as Funções</option>
              <option value="ADMIN">Administradores</option>
              <option value="CLIENT">Clientes</option>
              <option value="DRIVER">Motoristas</option>
            </select>
          </div>
        </div>

        {/* --- TABELA DE DADOS --- */}
        <div
          className={`overflow-hidden rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead
                className={`text-xs uppercase ${
                  darkMode
                    ? "bg-gray-700/50 text-gray-400"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 font-medium tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-medium tracking-wider"
                  >
                    Função
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-medium tracking-wider text-right"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-16">
                      Carregando...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="3" className="text-center py-16 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-16">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`border-b transition-colors duration-200 ${
                        darkMode
                          ? "border-gray-700 hover:bg-gray-700/50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium whitespace-nowrap">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {roleMapping[user.role] || user.role}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div
            className={`flex justify-between items-center p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <span className="text-sm text-gray-500">
              Página {pagination.page + 1} de {pagination.totalPages} (
              {pagination.totalElements} usuários)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
                disabled={pagination.page === 0 || loading}
                className={`px-3 py-1 rounded-md  transition-colors ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50"
                    : "bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
                disabled={
                  pagination.page >= pagination.totalPages - 1 || loading
                }
                className={`px-3 py-1 rounded-md transition-colors ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50"
                    : "bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                }`}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddUser
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={() => {
          fetchUsers();
        }}
      />
      <EditUser
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
        onUserUpdated={() => {
          fetchUsers();
          setIsEditUserModalOpen(false);
          setSelectedUserId(null);
        }}
      />
      <Confirmation
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja remover este usuário? A ação não pode ser desfeita."
      />
    </div>
  );
}

export default Users;
