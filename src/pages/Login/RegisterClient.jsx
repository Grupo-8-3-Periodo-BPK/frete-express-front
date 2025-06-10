import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/AuthContext";
import { BackButton } from "../../components/ui/button/Back";
import { motion } from "framer-motion";

function RegisterClient() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    cpf_cnpj: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const inputStyle = `w-full px-4 py-2 rounded-lg border ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`;

  const labelStyle = `block text-sm font-medium mb-1 ${
    darkMode ? "text-gray-200" : "text-gray-700"
  }`;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-200`}
    >
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <BackButton navigateTo="/register" />
          <h1
            className={`text-2xl font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Cadastro de Cliente
          </h1>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className={`p-6 rounded-xl shadow-sm ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            {/* Campos do formulário */}
            {[
              {
                id: "name",
                label: "Nome Completo",
                type: "text",
                placeholder: "Digite seu nome completo",
              },
              {
                id: "username",
                label: "Nome de Usuário",
                type: "text",
                placeholder: "Digite um nome de usuário",
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                placeholder: "Digite seu email",
              },
              {
                id: "password",
                label: "Senha",
                type: "password",
                placeholder: "Digite sua senha",
              },
              {
                id: "cpf_cnpj",
                label: "CPF/CNPJ",
                type: "text",
                placeholder: "Digite seu CPF ou CNPJ",
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className={labelStyle}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {/* Botão de Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white
                ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }
                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  darkMode
                    ? "focus:ring-offset-gray-800"
                    : "focus:ring-offset-white"
                }`}
            >
              Cadastrar
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default RegisterClient;
