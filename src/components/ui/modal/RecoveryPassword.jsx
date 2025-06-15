import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { forgotPassword, resetPassword, validateToken } from "../../../services/forgotPassword";
import Alert from "./Alert";

const initialPasswordValidation = {
  length: false,
  uppercase: false,
  number: false,
};

export default function RecoveryPassword({ isOpen, onClose, onSuccess, step, setStep, email, setEmail }) {
  const [token, setToken] = useState("");
  const [debouncedToken, setDebouncedToken] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(initialPasswordValidation);
  const [loading, setLoading] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [alertNavigateTo, setAlertNavigateTo] = useState(null);
  const [alertOnClose, setAlertOnClose] = useState(null);

  const validatePassword = (pass) => {
    const length = pass.length >= 8;
    const uppercase = /[A-Z]/.test(pass);
    const number = /[0-9]/.test(pass);
    
    setPasswordValidation({ length, uppercase, number });
    return length && uppercase && number;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      if (!response) {
        throw new Error("Falha ao enviar o email.");
      }
      setStep(2);
    } catch (err) {
      setAlertMessage("Falha ao enviar o email. Verifique o endereço e tente novamente.");
      setAlertType("error");
      setIsAlertOpen(true);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await resetPassword({ token, password });
      if(response.status === 200){
        setAlertMessage("Senha redefinida com sucesso! Você será redirecionado para a página de login.");
        setAlertType("success");
        setAlertNavigateTo("/login");
        setAlertOnClose(() => onSuccess); 
        setIsAlertOpen(true);
      } else {
        setAlertMessage("Código inválido ou expirado. Verifique os dados e tente novamente.");
        setAlertType("error");
        setAlertOnClose(null);
        setIsAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage("Código inválido ou expirado. Verifique os dados e tente novamente.");
      setAlertType("error");
      setAlertNavigateTo(null);
      setAlertOnClose(null);
      setIsAlertOpen(true);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setToken("");
        setDebouncedToken("");
        setPassword("");
        setConfirmPassword("");
        setValidPassword(false);
        setPasswordsMatch(false);
        setPasswordValidation(initialPasswordValidation);
        setLoading(false);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedToken(token);
    }, 1000);
    return () => clearTimeout(timer);
  }, [token]);

  useEffect(() => {
    const validate = async () => {
      if (debouncedToken) {
        try {
          const response = await validateToken(debouncedToken);
          setValidToken(response.status === 200);
        } catch (error) {
          setValidToken(false);
        }
      } else {
        setValidToken(false);
      }
    };
    validate();
  }, [debouncedToken]);

  useEffect(() => {
    setValidPassword(validatePassword(password));
  }, [password]);

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  return (
    <>
      <Alert
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        message={alertMessage}
        type={alertType}
        navigateTo={alertNavigateTo}
        onClose={alertOnClose}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center z-40"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-md z-20"
                >
                  <h1 className="text-2xl font-bold mb-4 font-poppins">Insira o seu email</h1>
                  <p className="text-sm text-gray-500 font-poppins mb-4">Um email de verificação será enviado para você.</p>
                  <form className="font-poppins" onSubmit={handleEmailSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium font-poppins text-gray-700 dark:text-gray-300">Email</label>
                      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500" placeholder="Digite seu email" />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 cursor-pointer" onClick={handleClose}>Cancelar</button>
                      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-md z-20"
                >
                  <h1 className="text-2xl font-bold mb-4 font-poppins">Redefina sua Senha</h1>
                  <p className="text-sm text-gray-500 font-poppins mb-4">Verifique seu email <span className="font-bold">{email}</span>, insira o código recebido e sua nova senha.</p>
                  <form className="font-poppins" onSubmit={handleResetSubmit}>
                    <div className="mb-4">
                      <label htmlFor="token" className="block text-sm font-medium font-poppins text-gray-700 dark:text-gray-300">Código de Verificação</label>
                      <input type="text" id="token" value={token} onChange={(e) => setToken(e.target.value)} required className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white" placeholder="Insira o código" />
                      {token && (validToken ? 
                        <p className="text-xs mt-1 ml-1 !text-green-400 font-poppins">Código válido</p> :
                        <p className="text-xs mt-1 ml-1 !text-red-400 font-poppins">Código inválido</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="password" className="block text-sm font-medium font-poppins text-gray-700 dark:text-gray-300">Nova Senha</label>
                      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white" placeholder="Digite sua nova senha" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium font-poppins text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
                      <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white" placeholder="Confirme sua nova senha" />
                      {confirmPassword && !passwordsMatch && (
                          <p className="text-xs mt-1 ml-1 !text-red-400 font-poppins">As senhas não coincidem</p>
                      )}
                    </div>

                    {password && (
                      <div className="mb-4 text-xs font-poppins">
                        <p className={passwordValidation.length ? '!text-green-400' : '!text-red-400'}>- Pelo menos 8 caracteres</p>
                        <p className={passwordValidation.uppercase ? '!text-green-400' : '!text-red-400'}>- Pelo menos uma letra maiúscula</p>
                        <p className={passwordValidation.number ? '!text-green-400' : '!text-red-400'}>- Pelo menos um número</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button type="button" className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 cursor-pointer" onClick={handleClose}>Cancelar</button>
                      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed" disabled={loading || !validToken || !validPassword || !passwordsMatch}>
                        {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}