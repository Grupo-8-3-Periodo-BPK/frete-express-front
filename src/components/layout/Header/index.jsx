import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme, useAuth } from "../../../contexts/AuthContext";
import logo from "../../../assets/images/icone-frete-express.png";
import { Bell, Menu, X, DoorClosed } from "lucide-react";
import ThemeToggle from "../../ui/button/ThemeToggle";

export default function Header() {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- LÓGICA SIMPLIFICADA ---

  // 1. Listas de links diretas para cada perfil de usuário.
  //    O 'exact: true' garante que "Início" só fica ativo na página exata.
  const adminLinks = [
    { label: "Início", to: "/admin", exact: true },
    { label: "Usuários", to: "/admin/users" },
    { label: "Veículos", to: "/admin/vehicles" },
    { label: "Fretes", to: "/admin/freights" },
    { label: "Contratos", to: "/admin/contracts" },
  ];

  const clientLinks = [
    { label: "Início", to: "/client/freights", exact: true },
    { label: "Contratos", to: "/client/contracts" },
    { label: "Criar Frete", to: "/client/freight/create" },
    { label: "Suporte", to: "/client/support" },
    { label: "Avaliar Motorista", to: "/client/rating" },
  ];

  const driverLinks = [
    { label: "Início", to: "/driver/freights", exact: true },
    { label: "Veículos", to: "/driver/vehicles" },
    { label: "Contratos", to: "/driver/contracts" },
    { label: "Suporte", to: "/driver/support" },
    { label: "Avaliar Cliente", to: "/driver/rating" },
  ];

  // 2. Escolhe a lista correta de links com um 'if/else' simples.
  let navLinks = [];
  if (user?.role === "ADMIN") {
    navLinks = adminLinks;
  } else if (user?.role === "CLIENT") {
    navLinks = clientLinks;
  } else if (user?.role === "DRIVER") {
    navLinks = driverLinks;
  }

  // Função para verificar se o link está ativo - lógica aprimorada
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    
    // Para links não-exact, precisamos tratar casos especiais
    // Se existe um link "Início" que aponta para o mesmo path com exact: true,
    // então este link só deve ficar ativo em sub-rotas
    const hasExactSibling = navLinks.some(link => 
      link.to === path && link.exact === true
    );
    
    if (hasExactSibling) {
      // Se há um link exact para o mesmo path, só ativa em sub-rotas
      return location.pathname.startsWith(path + '/');
    } else {
      // Comportamento normal para outros links
      return location.pathname.startsWith(path);
    }
  };

  // Componente para o Link, para não repetir classes CSS.
  const NavLink = ({ to, label, exact, isMobile = false }) => {
    const active = isActive(to, exact);
    const classes = `
      transition-colors font-medium
      ${isMobile 
        ? "text-xl sm:text-2xl py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-center" 
        : "text-sm xl:text-base px-2 xl:px-3 py-1"
      }
      ${active
        ? `text-blue-600 dark:text-blue-400 font-semibold ${
            !isMobile 
              ? "border-b-2 border-blue-600" 
              : "bg-blue-50 dark:bg-blue-900/30"
          }`
        : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
      }
    `;
    return (
      <Link to={to} className={classes} onClick={() => setIsMobileMenuOpen(false)}>
        {label}
      </Link>
    );
  };
  
  // O logo leva para uma página inicial diferente dependendo do perfil.
  const homePath = {
    ADMIN: "/admin",
    CLIENT: "/client/profile",
    DRIVER: "/driver/profile",
  }[user?.role] || "/";

  return (
    <>
      <header className={`w-full fixed top-0 left-0 z-30 shadow-sm transition-colors duration-200 ${
        darkMode ? "bg-gray-950 border-b border-gray-800" : "bg-white border-b border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 xl:px-6">
          
          <Link to={homePath} className="flex items-center flex-shrink-0">
            <img src={logo} alt="Fretes Express" className="h-8 sm:h-10" />
            <span className={`text-lg sm:text-xl font-medium ${
              darkMode ? "text-gray-200" : "text-gray-800"
            } ml-2 hidden xs:inline sm:inline`}>
              Fretes<span className="!text-blue-500 dark:!text-blue-400">Express</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 flex-1 justify-center max-w-2xl">
            {navLinks.map((link) => <NavLink key={link.label} {...link} />)}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
            
            <div className="hidden xs:block">
              <ThemeToggle />
            </div>
            
            <button className="relative p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="text-blue-700 dark:text-blue-400" size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                3
              </span>
            </button>
            
            <button className="rounded-full bg-blue-100 dark:bg-blue-900 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
              <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </button>
            
            <button 
              className="group rounded-full p-1 sm:p-1.5 transition-colors bg-gray-100 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-500/20" 
              onClick={logout} 
              title="Sair"
            >
              <DoorClosed className="text-gray-700 transition-colors group-hover:text-red-500 dark:text-gray-300 dark:group-hover:text-red-400" size={16} />
            </button>
            
            <button 
              className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} className={darkMode ? "text-gray-200" : "text-gray-800"} />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="md:hidden flex fixed inset-y-0 right-0 z-50 w-full xs:w-80 sm:w-96 flex-col bg-white dark:bg-gray-950 shadow-2xl transform transition-transform duration-300">
            
            <div className={`flex justify-between items-center h-14 sm:h-16 px-4 border-b ${
              darkMode ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <img src={logo} alt="Fretes Express" className="h-8" />
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Menu
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={24} className={darkMode ? "text-gray-200" : "text-gray-800"} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 p-4 overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink key={link.label} {...link} isMobile />
              ))}
              
              <div className="xs:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />
              </div>
            </nav>
            
            <div className={`mt-auto p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-10 h-10 flex items-center justify-center">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
                  <p className="text-xs capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}