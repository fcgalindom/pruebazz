import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class RaffleServices {

    static async list() {
        const url = enviroments.baseUrl + 'raffles/'
        const response = await axios.get(url)
        return response.data
    }

    static async show(id) {
        const url = enviroments.baseUrl + 'raffle/' + id + '/'
        const response = await axios.get(url)
        return response.data
    }

    static async createCustomer(raffle) {
        const url = enviroments.baseUrl + 'raffle/create/';
        const response = await axios.post(url, raffle)
        return response.data;
    }

    static async updateCustomer(raffle, id) {
        const url = enviroments.baseUrl + 'customer/update/' + id + '/';
        const response = await axios.post(url, raffle)
        return response.data;
    }
}