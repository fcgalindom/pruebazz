import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class CustomerServices {

    static async list() {
        const url = enviroments.baseUrl + 'customers/'
        const response = await axios.get(url)
        return response.data
    }

    static async createCustomer() {
        const url = enviroments.baseUrl + 'customer/create/';
        const response = await axios.post(url, user)
        return response.data;
    }

    static async updateCustomer() {
        const url = enviroments.baseUrl + 'customer/update/';
        const response = await axios.post(url, user)
        return response.data;
    }
}