import { api } from "../contexts/AuthContext";

// Função para buscar TODOS os veículos (Ex: para um painel de admin)
export const getAllVehicles = async () => {
    try {
        const response = await api.get('/api/vehicles');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar todos os veículos:', error.response ? error.response.data : error.message);
        // Lança o erro para ser tratado pelo componente que chamou a função
        return error.response?.data || error.response;
    }
};

// Função para buscar veículos de um usuário específico
export const getVehiclesByUser = async (userId) => {
    // Validação para garantir que o userId foi fornecido
    if (!userId) {
        return error.response;
    }
    try {
        const response = await api.get(`/api/vehicles/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar veículos para o usuário ${userId}:`, error.response ? error.response.data : error.message);
        return error.response?.data || error.response;
    }
};

// Função para criar um novo veículo
export const createVehicle = async (vehicleData) => {
    try {
        const response = await api.post('/api/vehicles', vehicleData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar veículo:', error.response ? error.response.data : error.message);
        // Retorna a mensagem de erro específica do backend (ex: "Placa ja cadastrada")
        return error.response?.data || error.response;
    }
};

// Função para atualizar um veículo existente
export const updateVehicle = async (id, vehicleData) => {
    try {
        const response = await api.put(`/api/vehicles/${id}`, vehicleData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar veículo ${id}:`, error.response ? error.response.data : error.message);
        return error.response?.data || error.response;
    }
};

// Função para excluir um veículo
export const deleteVehicle = async (id) => {
    try {
        // O método DELETE geralmente retorna um status 204 No Content sem corpo de resposta
        await api.delete(`/api/vehicles/${id}`);
        return { message: 'Veículo excluído com sucesso' }; // Retorno de sucesso para o frontend
    } catch (error) {
        console.error(`Erro ao excluir veículo ${id}:`, error.response ? error.response.data : error.message);
        return error.response?.data || error.response;
    }
};