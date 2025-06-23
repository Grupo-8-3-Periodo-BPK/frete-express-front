import React, { useState, useEffect } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import { getUserById } from "../../services/user";
import {
  User,
  Mail,
  Phone,
  FileText,
  Sun,
  Moon,
  AlertTriangle,
  Loader,
  Star,
  MessageSquare,
  Edit,
} from "lucide-react";
import EditProfile from "../../components/ui/modal/EditProfile";

// Componente para exibir uma linha de informação
const InfoRow = ({ icon: Icon, label, value }) => {
  const { darkMode } = useTheme();
  return (
    <div className="flex items-start space-x-4">
      <Icon
        className="h-5 w-5 flex-shrink-0 text-blue-500 mt-1"
        aria-hidden="true"
      />
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-base break-words ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {value || "Não informada"}
        </p>
      </div>
    </div>
  );
};

// Componente para o avatar do usuário
const UserAvatar = ({ name }) => {
  const { darkMode } = useTheme();
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";
  return (
    <div
      className={`flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg border-4 ${
        darkMode ? "border-gray-800" : "border-white"
      }`}
    >
      <span className="text-3xl font-bold">{initials}</span>
    </div>
  );
};

// Componente para exibir estatísticas em um card
const StatCard = ({ icon: Icon, value, label }) => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`p-4 rounded-lg flex items-center space-x-3 transition-colors ${
        darkMode ? "bg-gray-700/60" : "bg-gray-100"
      }`}
    >
      <div
        className={`flex-shrink-0 p-2 rounded-full ${
          darkMode ? "bg-blue-900/40" : "bg-blue-100"
        }`}
      >
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <div>
        <p
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </p>
        <p
          className={`text-xs font-medium ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

// --- Componente Principal do Perfil do Administrador ---
function AdminProfile() {
  const { darkMode, toggleTheme } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // O useEffect que adicionava a classe 'dark' ao HTML foi removido,
  // pois agora os estilos são aplicados diretamente via JS.

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const profileData = await getUserById(user.id);
        setUserProfile(profileData);
      } catch (err) {
        setError("Falha ao carregar o perfil. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUserUpdated = (updatedUser) => {
    setUserProfile(updatedUser);
    setUser(updatedUser); // Atualiza o usuário no contexto de autenticação
  };

  const LoadingState = () => (
    <div className="text-center p-8">
      <Loader className="h-12 w-12 mx-auto animate-spin text-blue-500" />
      <p
        className={`mt-4 text-lg font-semibold ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Carregando perfil...
      </p>
    </div>
  );

  const ErrorState = () => (
    <div
      className={`flex flex-col items-center justify-center rounded-lg p-8 text-center text-red-500 shadow-lg backdrop-blur-lg ${
        darkMode ? "bg-gray-800/80" : "bg-white/80"
      }`}
    >
      <AlertTriangle className="h-12 w-12" />
      <p className="mt-4 font-semibold">{error}</p>
    </div>
  );

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >

      <main className="w-full max-w-md z-10">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : (
          userProfile && (
            <>
              <div
                className={`relative rounded-xl shadow-xl overflow-hidden transition-colors duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="h-28 bg-gradient-to-r from-cyan-500 to-blue-500" />

                <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <UserAvatar name={userProfile.name} />
                </div>

                <div className="p-6">
                  <div className="text-center mt-12">
                    <h1
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {userProfile.name}
                    </h1>
                    <p className="text-sm font-medium text-blue-500 capitalize">
                      {userProfile.role && userProfile.role.toLowerCase()}
                    </p>
                  </div>

                  {/* Seção de Estatísticas */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <StatCard
                      icon={Star}
                      value={userProfile.totalReviewsReceived}
                      label="Avaliações Recebidas"
                    />
                    <StatCard
                      icon={MessageSquare}
                      value={userProfile.totalReviewsMade}
                      label="Avaliações Feitas"
                    />
                  </div>

                  {/* Seção de Detalhes Pessoais */}
                  <div className="mt-8">
                    <h3
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Detalhes Pessoais
                    </h3>
                    <div
                      className={`mt-4 space-y-5 border-t pt-5 ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <InfoRow
                        icon={User}
                        label="Nome de Usuário"
                        value={userProfile.username}
                      />
                      <InfoRow
                        icon={Mail}
                        label="Email"
                        value={userProfile.email}
                      />
                      <InfoRow
                        icon={Phone}
                        label="Telefone"
                        value={userProfile.phone}
                      />
                      <InfoRow
                        icon={FileText}
                        label="CPF/CNPJ"
                        value={userProfile.cpf_cnpj}
                      />
                    </div>
                  </div>

                  {/* Seção de Ações */}
                  <div className="mt-8">
                    <button
                      onClick={() => setEditModalOpen(true)}
                      className={`w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        darkMode
                          ? "focus:ring-offset-gray-800"
                          : "focus:ring-offset-white"
                      }`}
                    >
                      <Edit size={16} className="mr-2" />
                      Editar Perfil
                    </button>
                  </div>
                </div>
              </div>
              <EditProfile
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                user={userProfile}
                onUserUpdated={handleUserUpdated}
              />
            </>
          )
        )}
      </main>
    </div>
  );
}

export default AdminProfile;