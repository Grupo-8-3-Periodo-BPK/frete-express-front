import React, { useState, useEffect } from "react";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import IconeFreteExpress from "../../assets/images/icone-frete-express.png";

export default function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const { login, authenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "CLIENT") {
        navigate("/client/freights");
      } else if (role === "DRIVER") {
        navigate("/driver/freights");
      }
    }
  }, [authenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(loginInput, password);
      if (response.success) {
        const userRole = response.data.role;
        if (userRole === "ADMIN") {
          navigate("/admin");
        } else if (userRole === "CLIENT") {
          navigate("/client/freights");
        } else if (userRole === "DRIVER") {
          navigate("/driver/freights");
        }
      } else {
        setError("Login ou senha incorretos. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Erro ao processar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const style = {
    input: {
      backgroundColor: darkMode ? "#374151" : "#f3f4f6",
      color: darkMode ? "white" : "#1f2937",
      borderColor: darkMode ? "#4B5563" : "#d1d5dc",
    },
    label: { color: darkMode ? "white" : "#4B5563" },
  };

  return (
    <div
      className={`flex min-h-screen w-full ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } font-sans relative p-4`}
    >
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-md px-4 sc-380:px-2">
          <div className="flex flex-col items-center">
            <img
              src={IconeFreteExpress}
              alt="Fretes Express Logo"
              className="w-full max-w-[200px] h-auto object-contain drop-shadow-lg mb-6 sc-380:mb-4"
            />
            <div className="text-center mb-6 sc-380:mb-4">
              <h1
                className={`text-4xl sc-380:text-3xl sc-320:text-2xl font-bold font-poppins ${
                  darkMode ? "text-white" : "text-gray-800"
                } tracking-tight`}
              >
                Frete<span className="!text-blue-500">Express</span>
              </h1>
            </div>
            <h1
              className={`text-3xl sc-380:text-2xl sc-320:text-xl font-bold font-poppins ${
                darkMode ? "text-white" : "text-gray-800"
              } mb-2 tracking-tight text-center`}
            >
              Seja Bem-vindo(a)
            </h1>
            <p
              className={`${
                darkMode ? "text-yellow-100" : "text-gray-600"
              } mb-6 font-light text-center text-sm sc-380:text-xs`}
            >
              Insira seu login e senha cadastrado
            </p>

            {error && (
              <div className="bg-red-500 text-white px-4 py-3 rounded mb-4 border border-red-700 text-sm w-full">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label
                  htmlFor="login"
                  className={`${
                    darkMode ? "text-yellow-100" : "text-gray-700"
                  } text-sm font-medium mb-1 block`}
                >
                  Login
                </label>
                <input
                  id="login"
                  type="text"
                  placeholder="Email, CPF/CNPJ ou nome de usuário"
                  className={`w-full p-3 sc-320:p-2 rounded-lg border focus:outline-none focus:ring-2 
                    focus:ring-yellow-500 focus:border-transparent transition-all text-sm
                    ${
                      darkMode ? "placeholder-gray-300" : "placeholder-gray-500"
                    }`}
                  style={style.input}
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className={`${
                    darkMode ? "text-yellow-100" : "text-gray-700"
                  } text-sm font-medium mb-1 block`}
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className={`w-full p-3 sc-320:p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm
                    ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-300"
                        : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
                    }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className={`w-full p-3 sc-320:p-2 font-bold rounded-lg transition-all text-base sc-380:text-sm cursor-pointer
                  ${
                    darkMode
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-yellow-500 text-gray-800 hover:bg-yellow-400"
                  }`}
                type="submit"
                disabled={loading}
                id="login-button"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className={`w-full p-3 sc-320:p-2 font-medium rounded-lg border transition-all text-base sc-380:text-sm cursor-pointer
                  ${
                    darkMode
                      ? "bg-transparent border-white text-white hover:bg-gray-700"
                      : "bg-transparent border-gray-300 text-gray-800 hover:bg-gray-200"
                  }`}
              >
                Criar Conta
              </button>
              <div className="text-center mt-4">
                <a
                  href="#"
                  className={`text-sm sc-380:text-xs underline transition-colors 
                ${
                  darkMode
                    ? "text-yellow-300 hover:text-yellow-200"
                    : "text-blue-600 hover:text-blue-800"
                }`}
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
