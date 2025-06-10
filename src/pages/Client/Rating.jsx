import React, { useState, useEffect } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import { FaStar } from "react-icons/fa";
import Select from "react-select";
import { getUsersForRating, createReview } from "../../services/review";

function Rating() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estilos personalizados para o Select baseado no modo escuro/claro
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: darkMode ? "#374151" : "#f3f4f6",
      borderColor: darkMode ? "#4B5563" : "#d1d5dc",
      boxShadow: state.isFocused ? "0 0 0 2px #EAB308" : "none",
      "&:hover": {
        borderColor: darkMode ? "#6B7280" : "#9CA3AF",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? darkMode
          ? "#3B82F6"
          : "#EAB308"
        : state.isFocused
        ? darkMode
          ? "#374151"
          : "#F3F4F6"
        : "transparent",
      color: state.isSelected ? "#FFFFFF" : darkMode ? "#FFFFFF" : "#1F2937",
      "&:hover": {
        backgroundColor: darkMode ? "#374151" : "#F3F4F6",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: darkMode ? "#FFFFFF" : "#1F2937",
    }),
    input: (provided) => ({
      ...provided,
      color: darkMode ? "#FFFFFF" : "#1F2937",
    }),
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [user?.role]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const type = user?.role === "DRIVER" ? "client" : "driver";
      const users = await getUsersForRating(type);
      setUserOptions(users.map((u) => ({ value: u.id, label: u.name })));
    } catch (error) {
      setError("Erro ao carregar usuários. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const ratingData = {
        evaluatorId: user.id,
        evaluatedId: selectedUser.value,
        rating,
        description,
        evaluatorType: user.role,
      };
      await createReview(ratingData);
      setSuccess("Avaliação enviada com sucesso!");
      setRating(0);
      setDescription("");
      setSelectedUser(null);
    } catch (error) {
      setError("Erro ao enviar avaliação. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const isUserDriver = user?.role === "DRIVER";

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } py-8 px-4`}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className={`text-3xl sc-380:text-2xl font-bold mb-8 ${
            darkMode ? "text-white" : "text-gray-800"
          } text-center`}
        >
          Avaliação de {isUserDriver ? "Cliente" : "Motorista"}
        </h1>

        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white px-4 py-3 rounded mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className={`block mb-2 text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Selecione o {isUserDriver ? "Cliente" : "Motorista"}
            </label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              styles={customStyles}
              placeholder="Selecione..."
              className="w-full"
              isSearchable
              isLoading={loading}
              isDisabled={loading}
            />
          </div>

          <div>
            <label
              className={`block mb-2 text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Classificação
            </label>
            <div className="flex gap-1 sc-320:gap-0.5">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={ratingValue}
                    className={`text-3xl sc-380:text-2xl sc-320:text-xl transition-colors duration-200 ${
                      ratingValue <= (hover || rating)
                        ? "text-yellow-400"
                        : darkMode
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <FaStar />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              className={`block mb-2 text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all
                ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              rows="4"
              placeholder="Digite sua avaliação..."
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedUser || !rating}
            className={`w-full p-3 font-medium rounded-lg transition-all
              ${
                loading || !selectedUser || !rating
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }
              text-white`}
          >
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Rating;
