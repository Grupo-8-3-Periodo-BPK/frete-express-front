import { api } from "../contexts/AuthContext";

// Busca todos os contratos
export const getAllContracts = async () => {
  try {
    const response = await api.get("/api/contracts");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar contratos:", error.response?.data);
    throw error.response?.data || new Error("Falha ao buscar contratos.");
  }
};

// Busca um contrato específico pelo ID
export const getContractById = async (id) => {
  try {
    const response = await api.get(`/api/contracts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar contrato ${id}:`, error.response?.data);
    throw error.response?.data || new Error("Contrato não encontrado.");
  }
};

// Busca contratos por ID do cliente
export const getContractsByClient = async (clientId) => {
  try {
    const response = await api.get(`/api/contracts/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao buscar contratos do cliente ${clientId}:`,
      error.response?.data
    );
    throw (
      error.response?.data || new Error("Falha ao buscar contratos do cliente.")
    );
  }
};

// Busca contratos por ID do motorista
export const getContractsByDriver = async (driverId) => {
  try {
    const response = await api.get(`/api/contracts/driver/${driverId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao buscar contratos do motorista ${driverId}:`,
      error.response?.data
    );
    throw (
      error.response?.data ||
      new Error("Falha ao buscar contratos do motorista.")
    );
  }
};

// Busca contratos por ID do frete
export const getContractsByFreight = async (freightId) => {
  try {
    const response = await api.get(`/api/contracts/freight/${freightId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao buscar contratos do frete ${freightId}:`,
      error.response?.data
    );
    throw (
      error.response?.data || new Error("Falha ao buscar contratos do frete.")
    );
  }
};

// Cria um novo contrato (candidatura do motorista)
export const createContract = async (contractData) => {
  try {
    const response = await api.post("/api/contracts", contractData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar contrato:", error.response?.data);
    throw error.response?.data || new Error("Falha ao criar o contrato.");
  }
};

// Cliente aprova o contrato
export const approveContract = async (id) => {
  try {
    const response = await api.patch(`/api/contracts/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao aprovar o contrato ${id}:`, error.response?.data);
    throw error.response?.data || new Error("Falha ao aprovar o contrato.");
  }
};

// Motorista cancela o contrato
export const cancelByDriver = async (id) => {
  try {
    const response = await api.patch(`/api/contracts/${id}/cancel-by-driver`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar o contrato ${id}:`, error.response?.data);
    throw error.response?.data || new Error("Falha ao cancelar o contrato.");
  }
};

// Cliente cancela o contrato
export const cancelByClient = async (id) => {
  try {
    const response = await api.patch(`/api/contracts/${id}/cancel-by-client`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar o contrato ${id}:`, error.response?.data);
    throw error.response?.data || new Error("Falha ao cancelar o contrato.");
  }
};

// Contrato é concluído
export const completeContract = async (id) => {
  try {
    const response = await api.patch(`/api/contracts/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao concluir o contrato ${id}:`, error.response?.data);
    throw error.response?.data || new Error("Falha ao concluir o contrato.");
  }
};

// Deleta um contrato
export const deleteContract = async (id) => {
  try {
    await api.delete(`/api/contracts/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir contrato ${id}:`, error.response?.data);
    throw error.response?.data || new Error("Falha ao excluir o contrato.");
  }
};
