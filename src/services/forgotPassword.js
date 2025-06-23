import { api } from "../contexts/AuthContext";

export const forgotPassword = async (email) => {
  try {
    console.log(email);
    const response = await api.post("/api/recovery/request", {
      emailOrPhone: String(email),
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateToken = async (token) => {
  try {
    const response = await api.post(`/api/recovery/validate`, {
      token: token,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await api.post(`/api/recovery/reset`, {
      token,
      newPassword: password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
