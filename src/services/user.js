import { api } from "../contexts/AuthContext";

export const getAllUsers = async (page = 0, size = 10, sort = "id") => {
  try {
    const response = await api.get(
      `/api/users/paged?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar usuários:",
      error.response ? error.response.data : error.message
    );
    return error.response ? error.response.data : error.response;
  }
};

export const getAllDrivers = async (page = 0, size = 10, sort = "id") => {
  try {
    const response = await api.get(
      `/api/users/drivers/paged?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar motoristas:",
      error.response ? error.response.data : error.message
    );
    return error.response ? error.response.data : error.response;
  }
};

export const getAllClients = async (page = 0, size = 10, sort = "id") => {
  try {
    const response = await api.get(
      `/api/users/clients/paged?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar clientes:",
      error.response ? error.response.data : error.message
    );
    return error.response ? error.response.data : error.response;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao buscar usuário com ID ${id}:`,
      error.response ? error.response.data : error.message
    );
    return error.response ? error.response.data : error.response;
  }
};

export const registerClient = async (userData) => {
  try {
    const response = await api.post("/api/users/register/client", userData);
    return response;
  } catch (error) {
    return error.response || error;
  }
};

export const registerDriver = async (userData) => {
  try {
    const response = await api.post("/api/users/register/driver", userData);
    return response;
  } catch (error) {
    return error.response || error;
  }
};

export const registerUserByAdmin = async (userData) => {
  try {
    const response = await api.post("/api/admin/register", userData);
    return response;
  } catch (error) {
    return error.response || error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao atualizar usuário com ID ${id}:`,
      error.response ? error.response.data : error.message
    );
    return error.response ? error.response.data : error.response;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/users/${id}`);
    return response;
  } catch (error) {
    console.error(
      `Erro ao deletar usuário com ID ${id}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/api/users/profile");
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar perfil do usuário:",
      error.response ? error.response.data : error.message
    );
    return error.response ? error.response.data : error.response;
  }
};
