import axios from "axios";
import { api } from "../contexts/AuthContext";

export const createFreight = async (data) => {
  try {
    const response = await api.post("/api/freights", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar frete:", error.response?.data);
    throw error.response?.data || new Error("Falha ao criar o frete.");
  }
};

export const getFreights = async (status = null) => {
  try {
    const url = status ? `/api/freights?status=${status}` : "/api/freights";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar fretes:", error.response?.data);
    throw error.response?.data || new Error("Falha ao buscar fretes.");
  }
};

export const getFreightById = async (id) => {
  try {
    const response = await api.get(`/api/freights/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar frete:", error.response?.data);
    throw error.response?.data || new Error("Falha ao buscar o frete.");
  }
};

export const deleteFreight = async (id) => {
  try {
    const response = await api.delete(`/api/freights/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar frete:", error.response?.data);
    throw error.response || new Error("Falha ao deletar o frete.");
  }
};

export const updateFreight = async (id, data) => {
  try {
    const response = await api.put(`/api/freights/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar frete:", error.response?.data);
    throw error.response?.data || new Error("Falha ao atualizar o frete.");
  }
};

export const getIBGECities = async (state) => {
  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    );
    const data = await response.json();
    return data;
  } catch (err) {
    return err.response;
  }
};

export const getIBGECitiesByState = async (state) => {
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    return err.response;
  }
};
