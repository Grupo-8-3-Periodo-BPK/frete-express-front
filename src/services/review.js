import { api } from "../contexts/AuthContext";

export const getUsersForRating = async (type) => {
  try {
    let endpoint = "/api/users/";
    if (type.toLowerCase() === "client") {
      endpoint += "clients";
    } else if (type.toLowerCase() === "driver") {
      endpoint += "drivers";
    }
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários para avaliação:", error);
    return error.response;
  }
};

export const createReview = async (data) => {
  try {
    const response = await api.post("/api/reviews", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    return error.response;
  }
};


export const getReviewsByDriver = async (driverId) => {
  try {
    const response = await api.get(`/api/reviews/driver/${driverId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações do motorista:", error);
    return error.response;
  }
};

export const getReviewsByClient = async (clientId) => {
  try {
    const response = await api.get(`/api/reviews/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações do cliente:", error);
    return error.response;
  }
};

export const getReviewsMadeByUser = async (userId) => {
  try {
    const response = await api.get(`/api/reviews/made/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações feitas pelo usuário:", error);
    return error.response;
  }
};

export const getReviewsReceivedByUser = async (userId) => {
  try {
    const response = await api.get(`/api/reviews/received/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações recebidas pelo usuário:", error);
    return error.response;
  }
};

export const getReviewsSummary = async (userId) => {
  try {
    const response = await api.get(`/api/reviews/summary/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar o resumo de avaliações:", error);
    return error.response;
  }
};
