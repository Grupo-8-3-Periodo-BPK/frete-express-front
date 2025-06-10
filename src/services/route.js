import { api } from "../contexts/AuthContext";

export const getRouteDirections = async (start, end) => {
    try {
      const response = await api.get("/api/directions", { params: { start, end } });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar direções:', error.response.data);
      throw error;
    }
  };