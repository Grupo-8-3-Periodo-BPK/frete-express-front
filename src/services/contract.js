import { api } from "../contexts/AuthContext";

// Busca todos os contratos
export const getAllContracts = async () => {
    try {
        const response = await api.get('/api/contracts');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar contratos:', error.response?.data);
        throw error.response?.data || new Error('Falha ao buscar contratos.');
    }
};

// Busca um contrato específico pelo ID
export const getContractById = async (id) => {
    try {
        const response = await api.get(`/api/contracts/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar contrato ${id}:`, error.response?.data);
        throw error.response?.data || new Error('Contrato não encontrado.');
    }
};

// Busca contratos por ID do cliente
export const getContractsByClient = async (clientId) => {
    try {
        const response = await api.get(`/api/contracts/client/${clientId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar contratos do cliente ${clientId}:`, error.response?.data);
        throw error.response?.data || new Error('Falha ao buscar contratos do cliente.');
    }
};

// Busca contratos por ID do motorista
export const getContractsByDriver = async (driverId) => {
    try {
        const response = await api.get(`/api/contracts/driver/${driverId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar contratos do motorista ${driverId}:`, error.response?.data);
        throw error.response?.data || new Error('Falha ao buscar contratos do motorista.');
    }
};

// Cria um novo contrato
export const createContract = async (contractData) => {
    try {
        const response = await api.post('/api/contracts', contractData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar contrato:', error.response?.data);
        throw error.response?.data || new Error('Falha ao criar o contrato.');
    }
};

// Atualiza um contrato existente
export const updateContract = async (id, contractData) => {
    try {
        const response = await api.put(`/api/contracts/${id}`, contractData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar contrato ${id}:`, error.response?.data);
        throw error.response?.data || new Error('Falha ao atualizar o contrato.');
    }
};

// Deleta um contrato
export const deleteContract = async (id) => {
    try {
        await api.delete(`/api/contracts/${id}`);
    } catch (error) {
        console.error(`Erro ao excluir contrato ${id}:`, error.response?.data);
        throw error.response?.data || new Error('Falha ao excluir o contrato.');
    }
};

// Define o aceite do motorista
export const setDriverAcceptance = async (id, accepted) => {
    try {
        const response = await api.patch(`/api/contracts/${id}/driver-acceptance?accepted=${accepted}`);
        return response.data;
    } catch (error) {
        console.error(`Erro no aceite do motorista para o contrato ${id}:`, error.response?.data);
        throw error.response?.data || new Error('Falha ao processar aceite do motorista.');
    }
};

// Define o aceite do cliente
export const setClientAcceptance = async (id, accepted) => {
    try {
        const response = await api.patch(`/api/contracts/${id}/client-acceptance?accepted=${accepted}`);
        return response.data;
    } catch (error) {
        console.error(`Erro no aceite do cliente para o contrato ${id}:`, error.response?.data);
        throw error.response?.data || new Error('Falha ao processar aceite do cliente.');
    }
};