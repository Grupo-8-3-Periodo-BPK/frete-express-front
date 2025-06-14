import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/AuthContext";
import { BackButton } from "../../components/ui/button/Back";
import { motion } from "framer-motion";
import { registerDriver } from "../../services/user";
import Alert from "../../components/ui/modal/Alert";
import Loading from "../../components/ui/modal/Loading";

function RegisterDriver() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [navigateTo, setNavigateTo] = useState(null);
  const [alert, setAlert] = useState({
    type: "success",
    message: "",
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    cpf_cnpj: "",
    cnh: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerDriver(formData);
      if (response.status === 201) {
        showAlert("Motorista cadastrado com sucesso", "success");
        navigate("/login");
      } else {
        showAlert(response.data.error || "Erro ao cadastrar motorista", "error");
        setLoading(false);
      }
    } catch (error) {
      showAlert("Erro ao cadastrar motorista", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setIsAlertOpen(true);
  };

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
            Cadastro de Motorista
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
            {/* Nome Completo */}
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Digite seu nome completo"
              />
            </div>

            {/* Nome de Usuário */}
            <div>
              <label
                htmlFor="username"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Nome de Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Digite um nome de usuário"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Digite seu email"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Digite sua senha"
              />
            </div>

            {/* CPF/CNPJ */}
            <div>
              <label
                htmlFor="cpf_cnpj"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                CPF/CNPJ
              </label>
              <input
                type="text"
                id="cpf_cnpj"
                name="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Digite seu CPF ou CNPJ"
              />
            </div>

            {/* CNH */}
            <div>
              <label
                htmlFor="cnh"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                CNH
              </label>
              <input
                type="text"
                id="cnh"
                name="cnh"
                value={formData.cnh}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Digite o número da sua CNH"
              />
            </div>

            {/* Botão de Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white cursor-pointer
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

        <Loading isOpen={loading} />

        <Alert
          message={alert.message}
          isAlertOpen={isAlertOpen}
          setIsAlertOpen={setIsAlertOpen}
          type={alert.type}
        />
      </div>
    </div>
  );
}

export default RegisterDriver;
