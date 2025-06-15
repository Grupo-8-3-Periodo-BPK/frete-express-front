import { api } from "../contexts/AuthContext";

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/api/recovery/request", {
      emailOrPhone: email,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const validateToken = async (token) => {
  try {
    const response = await api.post(`/api/recovery/validate`, { token });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await api.post(`/api/recovery/reset`, { token, newPassword: password });
    return response;
  } catch (error) {
    return error.response
  }
};
