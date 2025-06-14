import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const AuthContext = createContext();
const ThemeContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const useTheme = () => useContext(ThemeContext);

// Função para normalizar os dados do usuário e garantir que tanto id quanto user_id estejam disponíveis
const normalizeUserData = (userData) => {
  if (!userData) return null;
  return {
    ...userData,
    id: userData.id || userData.user_id,
    user_id: userData.user_id || userData.id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const role = user?.role;
  const token = user?.token;

  // Função atualizada para setar o usuário com dados normalizados
  const updateUser = (userData) => {
    setUser(normalizeUserData(userData));
  };

  // Configurar interceptor de REQUISIÇÃO para adicionar token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Configurar interceptor de RESPOSTA para lidar com 401
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          setAuthenticated(false);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Verificar autenticação apenas uma vez ao iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (
          location.pathname.startsWith("/api/users/register/client") ||
          location.pathname.startsWith("/api/users/register/driver")
        ) {
          setLoading(false);
          return;
        }
        if (
          location.pathname === "/login" ||
          location.pathname.startsWith("/register")
        ) {
          setLoading(false);
          return;
        }
        const response = await api.post("/api/auth/validate-token");
        if (response.data.valid) {
          updateUser(response.data);
          setAuthenticated(true);
        }
      } catch (error) {
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Efeito para carregar o tema salvo no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersColorScheme)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    setTimeout(() => {
      document.documentElement.classList.add("transition-colors");
      document.documentElement.style.setProperty(
        "transition",
        "background-color 0.3s ease, color 0.3s ease"
      );
    }, 100);
  }, []);

  // Efeito para sincronizar o estado do tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const login = async (loginData, password) => {
    try {
      const response = await api.post("/api/auth/login", {
        login: loginData,
        password: password,
      });

      if (response.status === 200) {
        updateUser(response.data);
        setAuthenticated(true);
      }
      return { success: true, data: response.data };
    } catch (err) {
      setUser(null);
      setAuthenticated(false);
      return { success: false, data: err.response.data };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      setAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  function toggleTheme() {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");

      if (newMode) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark-mode");
        document.body.dataset.theme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark-mode");
        document.body.dataset.theme = "light";
      }

      document.body.style.backgroundColor = newMode ? "#111827" : "white";
      document.body.style.color = newMode ? "white" : "#1f2937";

      return newMode;
    });
  }

  const value = {
    user,
    authenticated,
    loading,
    logout,
    login,
    role,
  };

  const themeValue = { darkMode, toggleTheme };

  return (
    <AuthContext.Provider value={value}>
      <ThemeContext.Provider value={themeValue}>
        {!loading && children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};
