import React, { useState, useEffect } from "react";
import { useTheme } from "../../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { updateUser } from "../../../services/user";
import Loading from "./Loading";

const XMarkIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

function EditProfile({ isOpen, onClose, user, onUserUpdated }) {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    cpf_cnpj: "",
    phone: "",
    cnh: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        cpf_cnpj: formatCpfCnpj(user.cpf_cnpj || ""),
        phone: formatPhone(user.phone || ""),
        cnh: user.cnh || "",
        password: "",
      });
    }
  }, [user]);

  const formatCpfCnpj = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 14);
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return cleaned
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return cleaned
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cpf_cnpj") value = formatCpfCnpj(value);
    if (name === "phone") value = formatPhone(value);

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nome é obrigatório.";
    if (!formData.username)
      newErrors.username = "Nome de usuário é obrigatório.";
    if (!formData.email) newErrors.email = "Email é obrigatório.";
    if (user.role === "DRIVER" && !formData.cnh)
      newErrors.cnh = "CNH é obrigatória para motoristas.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const dataToSend = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone.replace(/\D/g, ""),
    };

    if (formData.password) {
      dataToSend.password = formData.password;
    }

    if (user.role !== "DRIVER") {
      delete dataToSend.cnh;
    }

    try {
      const response = await updateUser(user.id, dataToSend);
      if (response) {
        onUserUpdated(response);
        onClose();
      } else {
        const errorData =
          response.data?.error || "Ocorreu um erro desconhecido.";
        setApiError(errorData);
      }
    } catch (error) {
      console.log(error);
      setApiError(
        error.response?.data?.error || "Erro ao conectar com o servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-gray-700 text-white border-gray-600"
      : "bg-gray-100 text-gray-900 border-gray-300"
  }`;
  const labelClasses = `block mb-2 text-sm font-medium ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;
  const errorTextClasses = "text-red-500 text-sm mt-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden ${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white"
            }`}
          >
            <header
              className={`flex items-center justify-between p-6 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h2 className="text-xl font-bold">Editar Perfil</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-500/20 cursor-pointer"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {apiError && (
                  <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg">
                    {apiError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Nome Completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                    {errors.name && (
                      <p className={errorTextClasses}>{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>Nome de Usuário</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`${inputClasses} bg-gray-200 dark:bg-gray-700/50 cursor-not-allowed`}
                      disabled
                    />
                    {errors.username && (
                      <p className={errorTextClasses}>{errors.username}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                    {errors.email && (
                      <p className={errorTextClasses}>{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>Telefone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>CPF/CNPJ</label>
                    <input
                      type="text"
                      name="cpf_cnpj"
                      value={formData.cpf_cnpj}
                      onChange={handleChange}
                      className={`${inputClasses} bg-gray-200 dark:bg-gray-700/50 cursor-not-allowed`}
                      disabled
                    />
                    {errors.cpf_cnpj && (
                      <p className={errorTextClasses}>{errors.cpf_cnpj}</p>
                    )}
                  </div>
                  {user.role === "DRIVER" && (
                    <div>
                      <label className={labelClasses}>CNH</label>
                      <input
                        type="text"
                        name="cnh"
                        value={formData.cnh}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                      {errors.cnh && (
                        <p className={errorTextClasses}>{errors.cnh}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <footer
                className={`flex justify-end p-6 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-2.5 rounded-lg mr-4 ${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
                >
                  {loading && <Loading isOpen={loading} />}
                  Salvar Alterações
                </button>
              </footer>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default EditProfile;
