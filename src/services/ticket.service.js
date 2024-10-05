import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class TicketServices {

    static async list(filters) {
        const url = `${enviroments.baseUrl}tickets/`
        const response = await axios.get(url, { params: filters })
        return response.data
    }

    static async dependencies() {
        const url = `${enviroments.baseUrl}tickets/dependencies/`
        const response = await axios.get(url)
        return response.data
    }


    static async show(id) {
        const url = `${enviroments.baseUrl}raffle/${id}/`
        const response = await axios.get(url)
        return response.data
    }

    static async createCustomer(raffle) {
        const url = `${enviroments.baseUrl}tickets/create/`
        const response = await axios.post(url, raffle)
        return response.data;
    }

    static async updateCustomer(raffle, id) {
        const url = `${enviroments.baseUrl}raffle/update/${id}/`;
        const response = await axios.put(url, raffle)
        return response.data;
    }
}