import axios from "axios"
import { api } from "../contexts/AuthContext";

export const createFreight = async (data) => {
    try {
        const response = await api.post("/api/freights", data);
        return response;
    } catch (err) {        
        return err.response
    }
};

export const getFreights = async () => {
    try {
        const response = await api.get("/api/freights")
        return response
    } catch (err) {
        return err.response;
    }
}

export const getFreightById = async (id) => {
    try {
        const response = await api.get(`/api/freights/${id}`);
        return response;
    } catch (err) {
        console.error("Erro ao buscar frete:", err.response);
        return err.response
    }
};

export const deleteFreight = async (id) => {
    try {
        const response = await api.delete(`/api/freights/${id}`);
        return response;
    } catch (err) {
        console.error("Erro ao deletar frete:", err.response);
        return err.response
    }
};

export const updateFreight = async (id, data) => {
    try {
        const response = await api.put(`/api/freights/${id}`, data);
        return response;
    } catch (err) {
        console.error("Erro ao atualizar frete:", err.response);
        return err.response
    }
};

export const getIBGECities = async (state) => {
    try {
        const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        const data = await response.json()
        return data
    } catch (err) {
        return err.response        
    }
}

export const getIBGECitiesByState = async (state) => {
    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
        const data = await response.json()
        return data
    } catch (err) {
        return err.response
    }
}