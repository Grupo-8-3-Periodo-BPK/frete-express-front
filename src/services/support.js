import { api } from "../contexts/AuthContext";

export const sendSupportEmail = async (emailData) => {
    try {
        const response = await api.post("/api/email/send", emailData);
        return response;
    } catch (error) {
        console.error('Erro ao enviar e-mail de suporte:', error.response ? error.response.data : error.message);
        throw error.response || new Error('Erro ao enviar e-mail de suporte');
    }
}; 