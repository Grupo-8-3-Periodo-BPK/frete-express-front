import { api } from "../contexts/AuthContext";

export const getRouteDirections = async (start, end) => {
  try {
    const response = await api.get("/api/directions", {
      params: { start, end },
    });
    return response;
  } catch (error) {
    console.error("Erro ao buscar direções:", error.response.data);
    throw error;
  }
};

export const getCoordinatesForAddress = async (address) => {
  try {
    const response = await api.get("/api/geocode", { params: { address } });
    return response.data; // Retorna "longitude,latitude"
  } catch (error) {
    console.error(
      `Erro ao buscar coordenadas para: ${address}`,
      error.response?.data || error.message
    );
    throw error;
  }
};
