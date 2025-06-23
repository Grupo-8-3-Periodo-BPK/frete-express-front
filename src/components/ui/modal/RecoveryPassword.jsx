import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  forgotPassword,
  resetPassword,
  validateToken,
} from "../../../services/forgotPassword";
import Alert from "./Alert";
import { CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "../../../contexts/AuthContext";

// --- Constantes e Estado Inicial (que não dependem do tema) ---
const ERROR_MESSAGES = {
  EMAIL_SEND_FAILED:
    "Falha ao enviar o email. Verifique o endereço e tente novamente.",
  INVALID_TOKEN:
    "Código inválido ou expirado. Verifique os dados e tente novamente.",
};
const initialPasswordValidation = {
  length: false,
  uppercase: false,
  number: false,
};
const initialAlertState = {
  isOpen: false,
  message: "",
  type: "info",
  navigateTo: null,
  onClose: null,
};

// --- Subcomponentes Ajustados ---
// AJUSTE: Os subcomponentes agora recebem 'darkMode' como prop para definir suas classes dinamicamente.

const FormInput = ({ id, label, baseInputClasses, darkMode, ...props }) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className={`block text-sm font-medium font-poppins ${
        darkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </label>
    {/* A classe do input é passada como prop pois depende do 'darkMode' do componente pai */}
    <input id={id} {...props} className={baseInputClasses} />
  </div>
);

const ValidationCriterion = ({ isValid, children, darkMode }) => (
  <p
    className={`flex items-center text-sm ${
      isValid
        ? darkMode
          ? "text-green-400"
          : "text-green-600"
        : darkMode
        ? "text-red-400"
        : "text-red-500"
    }`}
  >
    {isValid ? (
      <CheckCircle className="mr-2 h-4 w-4" />
    ) : (
      <XCircle className="mr-2 h-4 w-4" />
    )}
    {children}
  </p>
);

// --- Componente Principal ---

export default function RecoveryPassword({
  isOpen,
  onClose,
  onSuccess,
  step,
  setStep,
  email,
  setEmail,
}) {
  const { darkMode } = useTheme();

  // AJUSTE: As constantes de estilo que dependem do tema foram movidas para dentro do componente.
  const baseInputClasses = `mt-1 p-2 block w-full rounded-md focus:border-blue-500 focus:ring-blue-500 ${
    darkMode
      ? "border border-gray-700 bg-gray-700 text-white"
      : "border border-gray-300 bg-white text-gray-900"
  }`;

  const primaryButtonClasses =
    "w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors";

  const secondaryButtonClasses = `w-full p-2 rounded-md cursor-pointer transition-colors ${
    darkMode
      ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
  }`;

  // --- Hooks de Estado ---
  const [token, setToken] = useState("");
  const [debouncedToken, setDebouncedToken] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(
    initialPasswordValidation
  );
  const [loading, setLoading] = useState(false);
  const [isTokenValidating, setIsTokenValidating] = useState(false);
  const [alertState, setAlertState] = useState(initialAlertState);

  // --- Derivação de Estado ---
  const passwordsMatch =
    password && confirmPassword ? password === confirmPassword : true;
  const isPasswordValid =
    passwordValidation.length &&
    passwordValidation.uppercase &&
    passwordValidation.number;
  const isStep2SubmitDisabled =
    loading ||
    isTokenValidating ||
    !validToken ||
    !isPasswordValid ||
    !passwordsMatch ||
    !password;

  const tokenInputClasses = [
    baseInputClasses,
    debouncedToken
      ? validToken
        ? "border-green-500 focus:border-green-500 focus:ring-green-500"
        : "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "",
  ].join(" ");

  // --- Funções Auxiliares ---
  const showAlert = useCallback((config) => {
    setAlertState({ ...initialAlertState, ...config, isOpen: true });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState(initialAlertState);
  }, []);

  const resetComponentState = useCallback(() => {
    setToken("");
    setDebouncedToken("");
    setPassword("");
    setConfirmPassword("");
    setPasswordValidation(initialPasswordValidation);
    setLoading(false);
    closeAlert();
  }, [closeAlert]);

  // --- Handlers de Eventos ---
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
    } catch (err) {
      showAlert({ message: ERROR_MESSAGES.EMAIL_SEND_FAILED, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ token, password });
      showAlert({
        message: "Senha redefinida com sucesso! Você será redirecionado.",
        type: "success",
        navigateTo: "/login",
        onClose: () => onSuccess,
      });
      onClose();
    } catch (err) {
      showAlert({ message: ERROR_MESSAGES.INVALID_TOKEN, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- Efeitos Colaterais (useEffect) ---
  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetComponentState, 300);
    }
  }, [isOpen, resetComponentState]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedToken(token), 1000);
    return () => clearTimeout(timer);
  }, [token]);

  useEffect(() => {
    const validate = async () => {
      if (!debouncedToken) {
        setValidToken(false);
        return;
      }
      setIsTokenValidating(true);
      try {
        await validateToken(debouncedToken);
        setValidToken(true);
      } catch (error) {
        setValidToken(false);
      } finally {
        setIsTokenValidating(false);
      }
    };
    validate();
  }, [debouncedToken]);

  useEffect(() => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);
    setPasswordValidation({ length, uppercase, number });
  }, [password]);

  // --- Renderização ---
  return (
    <>
      <Alert
        isAlertOpen={alertState.isOpen}
        setIsAlertOpen={(isOpen) =>
          setAlertState((prev) => ({ ...prev, isOpen }))
        }
        message={alertState.message}
        type={alertState.type}
        navigateTo={alertState.navigateTo}
        onClose={alertState.onClose}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center z-40"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={`rounded-lg p-8 shadow-lg w-full max-w-md z-20 font-poppins ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" exit={{ opacity: 0 }}>
                    <h1
                      className={`text-2xl font-bold mb-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Insira o seu email
                    </h1>
                    <p
                      className={`text-sm mb-4 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Um email de verificação será enviado para você.
                    </p>
                    <form onSubmit={handleEmailSubmit}>
                      <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Digite seu email"
                        baseInputClasses={baseInputClasses}
                        darkMode={darkMode}
                      />
                      <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <button
                          type="button"
                          className={secondaryButtonClasses}
                          onClick={onClose}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className={primaryButtonClasses}
                          disabled={loading}
                        >
                          {loading ? "Enviando..." : "Enviar"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2">
                    <h1
                      className={`text-2xl font-bold mb-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Redefina sua Senha
                    </h1>
                    <p
                      className={`text-sm mb-4 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Verifique seu email{" "}
                      <span className="font-bold">{email}</span>, insira o
                      código e sua nova senha.
                    </p>
                    <form onSubmit={handleResetSubmit}>
                      <FormInput
                        id="token"
                        label="Código de Verificação"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        placeholder="Insira o código"
                        baseInputClasses={tokenInputClasses}
                        darkMode={darkMode}
                      />
                      {debouncedToken && !isTokenValidating && (
                        <div className="flex items-center text-sm -mt-2 mb-4 ml-1">
                          {validToken ? (
                            <p
                              className={`flex items-center ${
                                darkMode ? "text-green-400" : "text-green-600"
                              }`}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Código
                              válido.
                            </p>
                          ) : (
                            <p
                              className={`flex items-center ${
                                darkMode ? "text-red-400" : "text-red-500"
                              }`}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Código
                              inválido ou expirado.
                            </p>
                          )}
                        </div>
                      )}
                      {isTokenValidating && (
                        <p
                          className={`text-sm -mt-2 mb-4 ml-1 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Verificando código...
                        </p>
                      )}
                      <FormInput
                        id="password"
                        label="Nova Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Digite sua nova senha"
                        baseInputClasses={baseInputClasses}
                        darkMode={darkMode}
                      />
                      <FormInput
                        id="confirmPassword"
                        label="Confirmar Nova Senha"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirme sua nova senha"
                        baseInputClasses={baseInputClasses}
                        darkMode={darkMode}
                      />

                      {!passwordsMatch && confirmPassword && (
                        <p
                          className={`text-xs -mt-2 mb-4 ml-1 ${
                            darkMode ? "text-red-400" : "text-red-500"
                          }`}
                        >
                          As senhas não coincidem.
                        </p>
                      )}

                      {password && (
                        <div className="mb-4 text-xs space-y-1">
                          <ValidationCriterion
                            isValid={passwordValidation.length}
                            darkMode={darkMode}
                          >
                            Pelo menos 8 caracteres
                          </ValidationCriterion>
                          <ValidationCriterion
                            isValid={passwordValidation.uppercase}
                            darkMode={darkMode}
                          >
                            Pelo menos uma letra maiúscula
                          </ValidationCriterion>
                          <ValidationCriterion
                            isValid={passwordValidation.number}
                            darkMode={darkMode}
                          >
                            Pelo menos um número
                          </ValidationCriterion>
                        </div>
                      )}

                      <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <button
                          type="button"
                          className={secondaryButtonClasses}
                          onClick={onClose}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className={primaryButtonClasses}
                          disabled={isStep2SubmitDisabled}
                        >
                          {loading ? "Redefinindo..." : "Redefinir Senha"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
