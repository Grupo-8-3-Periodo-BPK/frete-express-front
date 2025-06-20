import React, { useState, useEffect } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import Select from "react-select";
import { getUsersForRating, createReview } from "../../services/review";
import StarRating from "../../components/ui/card/StarRating";
import { FaRegPaperPlane } from "react-icons/fa";

const customSelectStyles = (darkMode) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
    borderColor: darkMode ? "#4B5563" : "#D1D5DB",
    minHeight: '48px',
    boxShadow: state.isFocused ? (darkMode ? "0 0 0 1px #3B82F6" : "0 0 0 1px #ffc107") : "none",
    "&:hover": { borderColor: darkMode ? "#6B7280" : "#9CA3AF" },
    padding: '0 2px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 6px',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0px',
    padding: '0px',
  }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  }),
  singleValue: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    color: darkMode ? "#FFFFFF" : "#1F2937",
  }),
  menu: (provided) => ({ ...provided, backgroundColor: darkMode ? "#1F2937" : "#FFFFFF" }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? (darkMode ? '#3B82F6' : '#ffc107') : state.isFocused ? (darkMode ? '#374151' : '#fdecc5') : 'transparent',
    color: state.isSelected || darkMode ? '#FFFFFF' : '#1F2937',
  }),
});


const mapRatingToEnum = (numericRating) => {
  if (numericRating <= 2) return "BAD";
  if (numericRating === 3) return "NEUTRAL";
  return "GOOD"; // Para 4 e 5 estrelas
};


function Rating() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.role) return;
      try {
        setLoading(true);
        const userTypeToFetch = user.role === "DRIVER" ? "client" : "driver";
        const users = await getUsersForRating(userTypeToFetch);
        const typeOfUsersFetched = user.role === "DRIVER" ? "CLIENT" : "DRIVER";
        setUserOptions(users.map((u) => ({ value: u.id, label: u.name, role: typeOfUsersFetched })));
      } catch (err) {
        setError("Erro ao carregar usuários. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !rating) {
      setError("Por favor, selecione um usuário e uma nota.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const ratingData = {
      rating: mapRatingToEnum(rating),
      type: selectedUser.role,
      comment: comment,
      driver_id: user.role === "DRIVER" ? user.id : selectedUser.value,
      client_id: user.role === "CLIENT" ? user.id : selectedUser.value,
    };

    try {
      await createReview(ratingData);
      setSuccess("Avaliação enviada com sucesso! Obrigado pelo feedback.");
      setRating(0);
      setComment("");
      setSelectedUser(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao enviar avaliação. Por favor, tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isUserDriver = user?.role === "DRIVER";
  const selectStyles = customSelectStyles(darkMode);

  return (
    <div className={`min-h-screen w-full ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-4 sm:p-8 flex items-center justify-center`}>
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"} p-6 sm:p-10`}>
        <div className="text-center mb-8">
          <FaRegPaperPlane className={`mx-auto text-4xl mb-3 ${darkMode ? "text-blue-400" : "text-yellow-500"}`} />
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Deixe sua Avaliação</h1>
          <p className={`mt-2 text-md ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Sua opinião é muito importante para a comunidade.
          </p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Quem você gostaria de avaliar?
            </label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              styles={selectStyles}
              placeholder={`Selecione um ${isUserDriver ? "Cliente" : "Motorista"}...`}
              isLoading={loading}
              isDisabled={loading}
              aria-label="Selecionar usuário para avaliação"
              isSearchable={false}
            />
          </div>

          <div>
            <label className={`block mb-3 text-center text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Qual a sua nota para o serviço?
            </label>
            <StarRating rating={rating} setRating={setRating} darkMode={darkMode} />
          </div>

          <div>
            <label htmlFor="comment" className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Comentário (Opcional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-base ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-yellow-500"
              }`}
              rows="4"
              placeholder="Descreva sua experiência..."
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedUser || rating === 0}
            className={`w-full p-4 font-bold rounded-lg text-lg text-white transition-all duration-300 flex items-center justify-center gap-2
              ${loading || !selectedUser || rating === 0
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : darkMode
                ? "bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1"
                : "bg-yellow-500 hover:bg-yellow-600 transform hover:-translate-y-1"
            }`}
          >
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Rating;