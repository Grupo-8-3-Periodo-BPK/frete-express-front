import React, { useState } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import { sendSupportEmail } from "../../services/support";
import Select from "react-select";
import {
  FaRegLifeRing,
  FaEnvelope,
  FaComments,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";

const customSelectStyles = (darkMode) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: darkMode ? "#374151" : "#F9FAFB",
    borderColor: darkMode ? "#4B5563" : "#D1D5DB",
    minHeight: '48px',
    boxShadow: state.isFocused ? (darkMode ? "0 0 0 1px #3B82F6" : "0 0 0 1px #FBBF24") : "none",
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
    backgroundColor: state.isSelected ? (darkMode ? '#3B82F6' : '#FBBF24') : state.isFocused ? (darkMode ? '#374151' : '#FEF3C7') : 'transparent',
    color: state.isSelected || darkMode ? '#FFFFFF' : '#1F2937',
  }),
});


// Opções para o campo de Assunto (sem alteração)
const subjectOptions = [
  { value: "Dúvida sobre Contrato", label: "Dúvida sobre Contrato" },
  { value: "Problema com Pagamento", label: "Problema com Pagamento" },
  { value: "Reportar um Bug no Sistema", label: "Reportar um Bug no Sistema" },
  { value: "Sugestão de Melhoria", label: "Sugestão de Melhoria" },
  { value: "Outro Assunto", label: "Outro Assunto" },
];


function SupportPage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [subject, setSubject] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !subject) {
      setError("Por favor, preencha o assunto e a descrição.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const emailData = {
        to: "marcosfelipedomborovski@gmail.com",
        subject: `[Suporte Fretes] - ${subject.label} (${user.name})`,
        content: `Usuário: ${user.name} (${user.email})\n\nAssunto: ${subject.label}\n\nMensagem:\n${description}`,
      };
      await sendSupportEmail(emailData);
      setSuccess(true);
      setDescription("");
      setSubject(null);
    } catch (err) {
      setError("Houve um erro ao enviar sua solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setSuccess(false);
    setError("");
  };

  const selectStyles = customSelectStyles(darkMode);

  return (
    <div className={`fixed top-0 left-0 w-full h-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"} p-4 sm:p-8 flex items-center justify-center`}>
      <div className="w-full max-w-5xl mx-auto">
        <div className={`rounded-xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"} overflow-hidden md:flex`}>
          
          <div className={`p-8 md:w-1/3 ${darkMode ? "bg-gray-900" : "bg-yellow-50"}`}>
            <FaRegLifeRing className={`text-5xl mb-4 ${darkMode ? "text-blue-400" : "text-yellow-500"}`} />
            <h2 className="text-2xl font-bold mb-2">Precisa de Ajuda?</h2>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Preencha o formulário ao lado e nossa equipe responderá o mais rápido possível.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <FaComments className={`${darkMode ? "text-blue-400" : "text-yellow-500"}`} />
                <span className="text-sm">Consulte nosso FAQ</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className={`${darkMode ? "text-blue-400" : "text-yellow-500"}`} />
                <span className="text-sm">contato@fretes.com</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:w-2/3">
            {success ? (
              <div className="text-center flex flex-col items-center justify-center h-full">
                <FaCheckCircle className="text-6xl text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Solicitação Enviada!</h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                    Obrigado por entrar em contato. Responderemos no seu email em breve.
                </p>
                <button 
                  onClick={handleNewRequest}
                  className={`px-6 py-2 font-semibold rounded-lg transition-all ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-yellow-500 hover:bg-yellow-600"} text-white`}
                >
                  Enviar Nova Solicitação
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">Fale Conosco</h2>
                <p className={`mb-6 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Enviando como: {user.name} ({user.email})
                </p>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Assunto</label>
                    
                    <Select
                      options={subjectOptions}
                      value={subject}
                      onChange={setSubject}
                      styles={selectStyles}
                      placeholder="Selecione o motivo do contato..."
                      isDisabled={loading}
                      isSearchable={false}
                    />

                  </div>
                  <div>
                    <label htmlFor="description" className={`block mb-2 text-sm font-medium`}>
                      Como podemos ajudar?
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-base ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500"
                          : "bg-gray-50 border-gray-300 placeholder-gray-500 focus:ring-yellow-500"
                      }`}
                      rows="6"
                      placeholder="Descreva seu problema ou dúvida em detalhes..."
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !description || !subject}
                    className={`w-full p-3 font-bold rounded-lg text-lg text-white transition-all duration-300 flex items-center justify-center gap-2
                      ${loading || !description || !subject
                        ? "bg-gray-400 dark:bg-gray-500 cursor-not-allowed"
                        : darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    <FaPaperPlane />
                    {loading ? "Enviando..." : "Enviar Solicitação"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;