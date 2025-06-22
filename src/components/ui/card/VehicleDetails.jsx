import React from "react";
import { useTheme } from "../../../contexts/AuthContext";
import { X } from "lucide-react";

const VehicleDetails = ({ vehicle, onClose }) => {
  const { darkMode } = useTheme();

  if (!vehicle) return null;

  const detailItemStyle = `py-2 px-3 rounded-md ${
    darkMode ? "bg-gray-700" : "bg-gray-100"
  }`;
  const labelStyle = `text-xs font-medium ${
    darkMode ? "text-gray-400" : "text-gray-500"
  }`;
  const valueStyle = `text-sm font-semibold ${
    darkMode ? "text-white" : "text-gray-900"
  }`;

  const formatBoolean = (value) => (value ? "Sim" : "Não");

  const categoryMap = {
    TRUCK: "Caminhão",
    TRAILER: "Carreta",
    VAN: "Van",
    UTILITY: "Utilitário",
  };

  const bodyTypeMap = {
    BOX: "Baú",
    BULK_CARRIER: "Graneleiro",
    SIDE_CURTAIN: "Sider",
    PLATFORM: "Plataforma",
    TANK: "Tanque",
    CONTAINER_CARRIER: "Porta-Container",
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white"
      } max-h-[90vh] w-full max-w-3xl mx-auto overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Detalhes do Veículo
        </h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={detailItemStyle}>
            <p className={labelStyle}>Placa</p>
            <p className={valueStyle}>{vehicle.licensePlate}</p>
          </div>
          <div className={detailItemStyle}>
            <p className={labelStyle}>Renavam</p>
            <p className={valueStyle}>{vehicle.renavam}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={detailItemStyle}>
            <p className={labelStyle}>Marca</p>
            <p className={valueStyle}>{vehicle.brand}</p>
          </div>
          <div className={detailItemStyle}>
            <p className={labelStyle}>Modelo</p>
            <p className={valueStyle}>{vehicle.model}</p>
          </div>
          <div className={detailItemStyle}>
            <p className={labelStyle}>Ano</p>
            <p className={valueStyle}>{vehicle.year}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={detailItemStyle}>
            <p className={labelStyle}>Cor</p>
            <p className={valueStyle}>{vehicle.color}</p>
          </div>
          <div className={detailItemStyle}>
            <p className={labelStyle}>Nº de Eixos</p>
            <p className={valueStyle}>{vehicle.axlesCount}</p>
          </div>
          <div className={detailItemStyle}>
            <p className={labelStyle}>Possui Lona?</p>
            <p className={valueStyle}>{formatBoolean(vehicle.hasCanvas)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={detailItemStyle}>
            <p className={labelStyle}>Categoria</p>
            <p className={valueStyle}>
              {categoryMap[vehicle.category] || vehicle.category}
            </p>
          </div>
          <div className={detailItemStyle}>
            <p className={labelStyle}>Tipo de Carroceria</p>
            <p className={valueStyle}>
              {bodyTypeMap[vehicle.bodyType] || vehicle.bodyType}
            </p>
          </div>
        </div>

        <fieldset
          className={`border p-4 rounded-lg ${
            darkMode ? "border-gray-600" : "border-gray-300"
          }`}
        >
          <legend
            className={`text-lg font-medium px-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Dimensões e Peso
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            <div className={detailItemStyle}>
              <p className={labelStyle}>Peso</p>
              <p className={valueStyle}>{vehicle.weight} kg</p>
            </div>
            <div className={detailItemStyle}>
              <p className={labelStyle}>Altura</p>
              <p className={valueStyle}>{vehicle.height} m</p>
            </div>
            <div className={detailItemStyle}>
              <p className={labelStyle}>Largura</p>
              <p className={valueStyle}>{vehicle.width} m</p>
            </div>
            <div className={detailItemStyle}>
              <p className={labelStyle}>Comprimento</p>
              <p className={valueStyle}>{vehicle.length} m</p>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            darkMode
              ? "bg-gray-600 hover:bg-gray-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default VehicleDetails;
