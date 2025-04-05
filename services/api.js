import axios from "axios"

const api = axios.create({baseURL: "http://localhost:8080"})

export const sayHello = async () => {
    try{
        const response = await api.get('/api/hello')
        return response.data;
    }catch (err){
        console.error('erro ao buscar mensagem: ',err)
        throw err;
    }
}

export default api;