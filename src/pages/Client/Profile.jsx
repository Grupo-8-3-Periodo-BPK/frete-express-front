import React, { useState, useEffect } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import { getUserById } from "../../services/user";
import { 
  User, Mail, Phone, FileText, Sun, Moon, AlertTriangle, Loader, 
  Star, MessageSquare, Edit, Car // Novos ícones importados
} from "lucide-react";

// Componente para exibir uma linha de informação
// (Sem alterações)
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <Icon className="h-5 w-5 flex-shrink-0 text-blue-500 mt-1" aria-hidden="true" />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-base text-gray-800 dark:text-gray-200 break-words">
        {value || "Não informada"}
      </p>
    </div>
  </div>
);

// Componente para o avatar do usuário
// (Sem alterações)
const UserAvatar = ({ name }) => {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : "?";
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg border-4 border-white dark:border-gray-800">
      <span className="text-3xl font-bold">{initials}</span>
    </div>
  );
};

// NOVO: Componente para exibir estatísticas em um card
const StatCard = ({ icon: Icon, value, label }) => (
  <div className="bg-gray-100 dark:bg-gray-700/60 p-4 rounded-lg flex items-center space-x-3 transition-colors">
    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
      <Icon className="h-6 w-6 text-blue-500" />
    </div>
    <div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);


// --- Componente Principal do Perfil do Cliente (Refatorado) ---
function ClientProfile() {
  const { darkMode, toggleTheme } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Usando o JSON fornecido diretamente para demonstração
        // Em um caso real, a chamada da API estaria aqui: await getUserById(user.id);
        const profileData = {
          "id": 3, "username": "cliente", "name": "Cliente Teste", "email": "cliente@freteexpress.com",
          "role": "CLIENT", "cnh": null, "phone": "(11) 77777-7777", "totalReviewsReceived": 2,
          "totalReviewsMade": 0, "cpf_cnpj": "456.789.123-01"
        };
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

  const LoadingState = () => (
    <div className="text-center p-8"><Loader className="h-12 w-12 mx-auto animate-spin text-blue-500" /><p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Carregando perfil...</p></div>
  );

  const ErrorState = () => (
     <div className="flex flex-col items-center justify-center rounded-lg bg-white/80 p-8 text-center text-red-500 shadow-lg backdrop-blur-lg dark:bg-gray-800/80"><AlertTriangle className="h-12 w-12" /><p className="mt-4 font-semibold">{error}</p></div>
  );

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <button onClick={toggleTheme} className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-gray-600 shadow-md backdrop-blur-sm transition-all hover:bg-white dark:bg-gray-800/70 dark:text-gray-300 dark:hover:bg-gray-700" aria-label="Alternar tema">
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <main className="w-full max-w-md z-10">
        {loading ? <LoadingState /> : error ? <ErrorState /> : userProfile && (
          <div className="relative rounded-xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden transition-colors duration-300">
            <div className="h-28 bg-gradient-to-r from-cyan-500 to-blue-500" />
            
            <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <UserAvatar name={userProfile.name} />
            </div>

            <div className="p-6">
              <div className="text-center mt-12">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h1>
                <p className="text-sm font-medium text-blue-500 capitalize">{userProfile.role.toLowerCase()}</p>
              </div>

              {/* Seção de Estatísticas */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <StatCard icon={Star} value={userProfile.totalReviewsReceived} label="Avaliações Recebidas"/>
                <StatCard icon={MessageSquare} value={userProfile.totalReviewsMade} label="Avaliações Feitas"/>
              </div>

              {/* Seção de Detalhes Pessoais */}
              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                  Detalhes Pessoais
                </h3>
                <div className="mt-4 space-y-5 border-t border-gray-200 dark:border-gray-700 pt-5">
                  <InfoRow icon={User} label="Nome de Usuário" value={userProfile.username} />
                  <InfoRow icon={Mail} label="Email" value={userProfile.email} />
                  <InfoRow icon={Phone} label="Telefone" value={userProfile.phone} />
                  <InfoRow icon={FileText} label="CPF/CNPJ" value={userProfile.cpf_cnpj} />
                  <InfoRow icon={Car} label="CNH" value={userProfile.cnh} />
                </div>
              </div>

              {/* Seção de Ações */}
              <div className="mt-8">
                 <button className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                    <Edit size={16} className="mr-2" />
                    Editar Perfil
                 </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClientProfile;