import React from "react";
import { Link } from "react-router-dom";

// Removidas importações do Material-UI e Icons

// Removido iconMapping e ícones dos menuItems
const menuItems = [
  { name: "Fretes", path: "/driver/freights" },
  { name: "Veículos", path: "/driver/vehicles" },
  { name: "Avaliação", path: "/driver/rating" },
  { name: "Rastreamento", path: "/driver/tracking" },
  { name: "Suporte", path: "/driver/support" },
  { name: "Contato", path: "/driver/contact" },
  { name: "Perfil", path: "/driver/profile" },
];

// Estilos CSS embutidos para simplicidade
// Removidos estilos inline, serão substituídos por classes Tailwind

function DriverHomePage() {
  // Lógica para aplicar estilos responsivos pode ser adicionada aqui se necessário,
  // ou usar media queries CSS diretamente se os estilos fossem em um arquivo .css
  return (
    <div className="container mx-auto max-w-4xl p-5 font-sans">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-10">
        Painel do Motorista
      </h1>
      <div className="flex flex-wrap gap-5 justify-center">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            className="no-underline text-inherit block w-full sm:w-[calc(50%-1.25rem)] md:w-[calc(33.333%-1.25rem)] min-w-[250px] group"
          >
            <div className="p-6 flex flex-col items-center justify-center min-h-[150px] bg-gray-50 rounded-lg shadow-md transition-transform duration-200 ease-in-out cursor-pointer group-hover:scale-105 group-hover:shadow-lg">
              {/* Ícones foram removidos para simplificar, conforme solicitado */}
              <h2 className="mt-4 text-gray-600 font-medium text-lg">
                {item.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DriverHomePage;
