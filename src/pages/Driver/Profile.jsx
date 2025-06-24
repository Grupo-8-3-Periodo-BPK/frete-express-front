import React, { useState, useEffect } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import { getUserById } from "../../services/user";
import {
  getReviewsMadeByUser,
  getReviewsReceivedByUser,
} from "../../services/review";
import ReviewCard from "../../components/ui/card/ReviewCard";
import {
  User,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  Loader,
  Star,
  MessageSquare,
  Edit,
  Car,
  BookUser,
  Inbox,
  Send,
} from "lucide-react";
import EditProfile from "../../components/ui/modal/EditProfile";

// --- Subcomponentes Refinados ---

const InfoRow = ({ icon: Icon, label, value }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`flex items-center space-x-4 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-0`}>
      <Icon
        className={`h-6 w-6 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
        aria-hidden="true"
      />
      <div className="flex-1">
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </p>
        <p className={`text-base break-words font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {value || "Não informado"}
        </p>
      </div>
    </div>
  );
};

const UserAvatar = ({ name }) => {
  const { darkMode } = useTheme();
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "?";
  return (
    <div
      className={`flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg border-4 ${
        darkMode ? "border-gray-800" : "border-white"
      }`}
    >
      <span className="text-4xl font-bold">{initials}</span>
    </div>
  );
};

// --- Componente Principal do Perfil do Motorista (Com Formatação) ---
function DriverProfile() {
  const { darkMode } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [madeReviews, setMadeReviews] = useState([]);
  const [receivedReviews, setReceivedReviews] = useState([]);
  
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.id) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [profileData, madeData, receivedData] = await Promise.all([
          getUserById(user.id),
          getReviewsMadeByUser(user.id),
          getReviewsReceivedByUser(user.id),
        ]);
        setUserProfile(profileData);
        setMadeReviews(madeData);
        setReceivedReviews(receivedData);
      } catch (err) {
        setError("Falha ao carregar o perfil. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [user]);

  const handleUserUpdated = (updatedUser) => {
    setUserProfile(updatedUser);
    setUser(updatedUser);
  };

  // Função para formatar CPF ou CNPJ
  const formatCpfCnpj = (value) => {
    if (!value) return "Não informado";
    const cleanedValue = String(value).replace(/\D/g, "");

    if (cleanedValue.length === 11) {
      return cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    if (cleanedValue.length === 14) {
      return cleanedValue.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }

    return value;
  };

  // Função para formatar CNH (apenas remove caracteres não numéricos)
  const formatCnh = (value) => {
    if (!value) return "Não informada";
    const cleanedValue = String(value).replace(/\D/g, "");
    
    // Retorna o valor limpo se tiver o comprimento esperado, caso contrário, o original
    return cleanedValue.length === 11 ? cleanedValue : value;
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Loader className="h-16 w-16 mx-auto animate-spin text-blue-500" />
      <p className={`mt-6 text-xl font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        Carregando perfil...
      </p>
    </div>
  );

  const ErrorState = () => (
    <div className={`flex flex-col items-center justify-center rounded-2xl p-10 text-center shadow-xl ${darkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600"}`}>
      <AlertTriangle className="h-16 w-16" />
      <p className="mt-5 text-lg font-semibold">{error}</p>
    </div>
  );
  
  const TabButton = ({ label, tabName, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex-1 flex items-center justify-center gap-2 p-4 text-sm font-semibold transition-all duration-300 border-b-4 ${
        activeTab === tabName
          ? 'text-blue-500 border-blue-500'
          : `border-transparent ${darkMode ? 'text-gray-400 hover:bg-gray-700/50' : 'text-gray-500 hover:bg-gray-100'}`
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 font-sans ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="absolute top-0 left-0 w-full h-52 bg-gradient-to-r from-cyan-400 to-blue-600" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <main className="w-full max-w-4xl pt-24 pb-12">
          {loading ? (
            <div className={`flex items-center justify-center h-[50vh] rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}><LoadingState /></div>
          ) : error ? (
            <ErrorState />
          ) : (
            userProfile && (
              <>
                <div className={`relative rounded-2xl shadow-xl overflow-visible transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  {/* --- Seção do Cabeçalho do Perfil --- */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                    <UserAvatar name={userProfile.name} />
                  </div>
                  <div className="pt-20 pb-6 px-6 text-center">
                    <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{userProfile.name}</h1>
                    <p className="text-md font-semibold text-blue-500 capitalize mt-1">{userProfile.role?.toLowerCase()}</p>
                  </div>

                  {/* --- Abas de Navegação --- */}
                  <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <TabButton label="Detalhes" tabName="details" icon={BookUser} />
                    <TabButton label={`Recebidas (${receivedReviews.length})`} tabName="received" icon={Inbox} />
                    <TabButton label={`Feitas (${madeReviews.length})`} tabName="made" icon={Send} />
                  </div>

                  {/* --- Conteúdo das Abas --- */}
                  <div className="p-6 min-h-[400px]">
                    {activeTab === 'details' && (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                          <div className={`p-4 rounded-lg flex items-center gap-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <Star className="h-7 w-7 text-blue-500" />
                            <div>
                              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.totalReviewsReceived}</p>
                              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avaliações Recebidas</p>
                            </div>
                          </div>
                          <div className={`p-4 rounded-lg flex items-center gap-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <MessageSquare className="h-7 w-7 text-blue-500" />
                            <div>
                              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.totalReviewsMade}</p>
                              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avaliações Feitas</p>
                            </div>
                          </div>
                        </div>
                        <InfoRow icon={User} label="Nome de Usuário" value={userProfile.username} />
                        <InfoRow icon={Mail} label="Email" value={userProfile.email} />
                        <InfoRow icon={Phone} label="Telefone" value={userProfile.phone} />
                        <InfoRow
                          icon={FileText}
                          label="CPF/CNPJ"
                          value={formatCpfCnpj(userProfile.cpf_cnpj)}
                        />
                        <InfoRow
                          icon={Car}
                          label="CNH"
                          value={formatCnh(userProfile.cnh)}
                        />
                      </div>
                    )}

                    {activeTab === 'received' && (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {receivedReviews.length > 0 ? receivedReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} viewType="received" perspective="DRIVER" />
                        )) : <p className="text-center text-gray-500 py-10">Nenhuma avaliação recebida ainda.</p>}
                      </div>
                    )}
                    
                    {activeTab === 'made' && (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {madeReviews.length > 0 ? madeReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} viewType="made" perspective="DRIVER" />
                        )) : <p className="text-center text-gray-500 py-10">Nenhuma avaliação feita ainda.</p>}
                      </div>
                    )}
                  </div>

                  {/* --- Botão de Edição --- */}
                  <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button onClick={() => setEditModalOpen(true)} className={`w-full flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transform hover:-translate-y-1`}>
                      <Edit size={20} className="mr-2" />
                      Editar Perfil
                    </button>
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
    </div>
  );
}

export default DriverProfile;