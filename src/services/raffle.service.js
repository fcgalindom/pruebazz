import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class RaffleServices {

    static async list() {
        const url = `${enviroments.baseUrl}raffles/`
        const response = await axios.get(url)
        return response.data
    }
    
    static async show(id) {
        const url = `${enviroments.baseUrl}raffle/${id}/`
        const response = await axios.get(url)
        return response.data
    }

    static async createCustomer(raffle) {
        const url = `${enviroments.baseUrl}raffle/create/`
        const response = await axios.post(url, raffle)
        return response.data;
    }

    static async updateCustomer(raffle, id) {
        const url = `${enviroments.baseUrl}raffle/update/${id}/`;
        const response = await axios.put(url, raffle)
        return response.data;
    }
    static async listlast() {
        const url = `${enviroments.baseUrl}raffle/last/`
        const response = await axios.get(url)
        return response.data
    }
    static async updateImage(award, id) {
        const url = `${enviroments.baseUrl}award/updateimage/${id}/`;
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
        const response = await axios.put(url, award, { headers });
        return response.data;
    }
}