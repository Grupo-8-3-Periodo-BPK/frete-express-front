import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/AuthContext";

const VehicleForm = ({ vehicle, onSubmit, onCancel }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    marca: "",
    ano: "",
    cor: "",
    categoria: "",
    status: "Ativo",
  });

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = `w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const labelStyle = `block text-sm font-medium mb-1 ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;

  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
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
            <label htmlFor="placa" className={labelStyle}>
              Placa
            </label>
            <input
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="marca" className={labelStyle}>
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="modelo" className={labelStyle}>
            Modelo
          </label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="ano" className={labelStyle}>
              Ano
            </label>
            <input
              type="number"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="cor" className={labelStyle}>
              Cor
            </label>
            <input
              type="text"
              name="cor"
              value={formData.cor}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="categoria" className={labelStyle}>
              Categoria
            </label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="status" className={labelStyle}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Manutenção">Manutenção</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {vehicle ? "Salvar Alterações" : "Adicionar Veículo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
