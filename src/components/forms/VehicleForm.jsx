import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/AuthContext";

const VehicleForm = ({ vehicle, onSubmit, onCancel }) => {
  const { darkMode } = useTheme();

  const initialFormData = {
    renavam: "",
    brand: "",
    year: "",
    model: "",
    licensePlate: "",
    color: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    axlesCount: "",
    hasCanvas: false,
    category: "TRUCK",
    bodyType: "BOX",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        renavam: vehicle.renavam || "",
        brand: vehicle.brand || "",
        year: vehicle.year || "",
        model: vehicle.model || "",
        licensePlate: vehicle.licensePlate || "",
        color: vehicle.color || "",
        weight: vehicle.weight || "",
        length: vehicle.length || "",
        width: vehicle.width || "",
        height: vehicle.height || "",
        axlesCount: vehicle.axlesCount || "",
        hasCanvas: vehicle.hasCanvas || false,
        category: vehicle.category || "TRUCK",
        bodyType: vehicle.bodyType || "BOX",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert string numbers to actual numbers before submitting
    const dataToSubmit = {
      ...formData,
      year: parseInt(formData.year, 10),
      weight: parseFloat(formData.weight),
      length: parseFloat(formData.length),
      width: parseFloat(formData.width),
      height: parseFloat(formData.height),
      axlesCount: parseInt(formData.axlesCount, 10),
      hasCanvas: formData.hasCanvas === "true" || formData.hasCanvas === true,
    };
    onSubmit(dataToSubmit);
  };

  const inputStyle = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900"
  }`;
  const labelStyle = `block text-sm font-medium mb-1 ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${
        darkMode ? "bg-gray-800" : "bg-white"
      } max-h-[90vh] overflow-y-auto`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {vehicle ? "Editar Veículo" : "Novo Veículo"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="licensePlate" className={labelStyle}>
              Placa (Mercosul)
            </label>
            <input
              type="text"
              name="licensePlate"
              id="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              className={inputStyle}
              placeholder="ABC1D23"
              required
            />
          </div>
          <div>
            <label htmlFor="renavam" className={labelStyle}>
              Renavam
            </label>
            <input
              type="text"
              name="renavam"
              id="renavam"
              value={formData.renavam}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="brand" className={labelStyle}>
              Marca
            </label>
            <input
              type="text"
              name="brand"
              id="brand"
              value={formData.brand}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="model" className={labelStyle}>
              Modelo
            </label>
            <input
              type="text"
              name="model"
              id="model"
              value={formData.model}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="year" className={labelStyle}>
              Ano
            </label>
            <input
              type="number"
              name="year"
              id="year"
              value={formData.year}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="color" className={labelStyle}>
              Cor
            </label>
            <input
              type="text"
              name="color"
              id="color"
              value={formData.color}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="axlesCount" className={labelStyle}>
              Nº de Eixos
            </label>
            <input
              type="number"
              name="axlesCount"
              id="axlesCount"
              value={formData.axlesCount}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="hasCanvas" className={labelStyle}>
              Possui Lona?
            </label>
            <select
              name="hasCanvas"
              id="hasCanvas"
              value={formData.hasCanvas.toString()}
              onChange={handleSelectChange}
              className={inputStyle}
              required
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelStyle}>
              Categoria
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleSelectChange}
              className={inputStyle}
              required
            >
              <option value="TRUCK">Caminhão</option>
              <option value="TRAILER">Carreta</option>
              <option value="VAN">Van</option>
              <option value="UTILITY">Utilitário</option>
            </select>
          </div>
          <div>
            <label htmlFor="bodyType" className={labelStyle}>
              Tipo de Carroceria
            </label>
            <select
              name="bodyType"
              id="bodyType"
              value={formData.bodyType}
              onChange={handleSelectChange}
              className={inputStyle}
              required
            >
              <option value="BOX">Baú</option>
              <option value="BULK_CARRIER">Graneleiro</option>
              <option value="SIDE_CURTAIN">Sider</option>
              <option value="PLATFORM">Plataforma</option>
              <option value="TANK">Tanque</option>
              <option value="CONTAINER_CARRIER">Porta-Container</option>
            </select>
          </div>
        </div>

        <fieldset className="border border-gray-600 p-4 rounded-lg">
          <legend className="text-lg font-medium px-2 text-gray-300">
            Dimensões e Peso
          </legend>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="weight" className={labelStyle}>
                Peso (kg)
              </label>
              <input
                type="number"
                name="weight"
                id="weight"
                value={formData.weight}
                onChange={handleChange}
                className={inputStyle}
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="height" className={labelStyle}>
                Altura (m)
              </label>
              <input
                type="number"
                name="height"
                id="height"
                value={formData.height}
                onChange={handleChange}
                className={inputStyle}
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="width" className={labelStyle}>
                Largura (m)
              </label>
              <input
                type="number"
                name="width"
                id="width"
                value={formData.width}
                onChange={handleChange}
                className={inputStyle}
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="length" className={labelStyle}>
                Comprimento (m)
              </label>
              <input
                type="number"
                name="length"
                id="length"
                value={formData.length}
                onChange={handleChange}
                className={inputStyle}
                step="0.01"
              />
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {vehicle ? "Salvar Alterações" : "Adicionar Veículo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
