import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme, useAuth } from "../../../contexts/AuthContext";
import logo from "../../../assets/images/icone-frete-express.png";
import { FaBell } from "react-icons/fa";
import ThemeToggle from "../../ui/button/ThemeToggle";
import { GiExitDoor } from "react-icons/gi";


export default function Header() {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getPathForRole = (basePaths) => {
    if (!user || !user.role) return basePaths.public || "/";
    switch (user.role) {
      case "ADMIN":
        return basePaths.admin || basePaths.public || "/";
      case "CLIENT":
        return basePaths.client || basePaths.public || "/";
      case "DRIVER":
        return basePaths.driver || basePaths.public || "/";
      default:
        return basePaths.public || "/";
    }
  };

  const navLinks = [
    {
      label: "Início",
      paths: {
        admin: "/admin",
        client: "/client/freights",
        driver: "/driver/freights",
      },
      adminOnly: false,
      clientOnly: false,
      driverOnly: false,
    },
    {
      label: "Usuários",
      paths: { admin: "/admin/users" },
      adminOnly: true,
    },
    {
      label: "Veículos",
      paths: { admin: "/admin/vehicles", driver: "/driver/vehicles" },
      adminOnly: false,
      clientOnly: false,
      driverOnly: false,
    },
    {
      label: "Fretes",
      paths: {
        admin: "/admin/freights",
        client: "/client/freights",
        driver: "/driver/freights",
      },
      admnOnly: false,
      clientOnly: false,
      driverOnly: false,
    },
    {
      label: "Contratos",
      paths: {
        admin: "/admin/contracts",
        client: "/client/contracts",
        driver: "/driver/contracts",
      },
      adminOnly: false,
      clientOnly: false,
      driverOnly: false,
    },
    {
      label: "Criar Frete",
      paths: { client: "/client/freight/create" },
      clientOnly: true,
    },
    {
      label: "Suporte",
      paths: {
        client: "/client/support",
        driver: "/driver/support",
      },
      adminOnly: false,
      clientOnly: false,
      driverOnly: false,
    },
    {
      label:
        user?.role === "CLIENT" ? "Avaliar Motorista" : "Avaliar Cliente",
      paths: { client: "/client/rating", driver: "/driver/rating" },
      adminOnly: false,
      clientOnly: false,
      driverOnly: false,
    },
  ];

  return (
    <header
      className={`w-full fixed top-0 left-0 z-30 shadow-sm ${darkMode
          ? "bg-gray-950 border-b border-gray-800"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo e nome */}
        <Link
          to={getPathForRole({
            public: "/",
            client: "/client/profile",
            driver: "/driver/profile",
            admin: "/admin/",
          })}
          className="flex items-center"
        >
          <img src={logo} alt="Fretes Express" className="h-10 " />
          <span className={`text-xl font-medium ${darkMode ? "text-gray-200" : "text-gray-800"} ml-2`}>
            Fretes
          <span className="!text-blue-500 dark:!text-blue-400">Express</span>
          </span>
        </Link>

        {/* Navegação - Links agora usando Link do React Router */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const path = getPathForRole(link.paths);
            if (link.adminOnly && (!user || user.role !== "ADMIN")) return null;
            if (link.clientOnly && (!user || user.role !== "CLIENT"))
              return null;
            if (link.driverOnly && (!user || user.role !== "DRIVER"))
              return null;
            if (
              path === "/" &&
              !link.paths.public &&
              (!user ||
                (user.role === "CLIENT" && !link.paths.client) ||
                (user.role === "DRIVER" && !link.paths.driver) ||
                (user.role === "ADMIN" && !link.paths.admin))
            )
              return null;

            return (
              <Link
                key={link.label}
                to={path}
                className={`transition-colors font-medium ${
                  isActive(path)
                    ? "text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 dark:border-blue-400"
                    : darkMode
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Botão menu para mobile */}
        <button className="md:hidden">
          <span className="material-icons">menu</span>
        </button>

        {/* Ícones */}
        <div className="flex items-center gap-8">
          <ThemeToggle />
          <button className="relative">
            <FaBell className="text-blue-700 dark:text-blue-300 text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
              3
            </span>
          </button>
          <button className="rounded-full bg-blue-100 dark:bg-blue-900 w-8 h-8 flex items-center justify-center">
            <span className="material-icons text-blue-700 dark:text-blue-300">
              {user?.name?.charAt(0)}
            </span>
          </button>
          <button className="rounded-full cursor-pointer hover:text-red-400 bg-gray-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center"
            onClick={() => {logout()}}
          >
            <span><GiExitDoor className="text-gray-700 dark:text-gray-300 hover:text-red-400" /></span>
          </button>
        </div>
      </div>
    </header>
  );
}
