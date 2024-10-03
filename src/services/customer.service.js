import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class CustomerServices {

    static async list() {
        const url = `${enviroments.baseUrl}customers/`
        const response = await axios.get(url)
        return response.data
    }

    static async createCustomer(customer) {
        const url = `${enviroments.baseUrl}customers/create/`
        const response = await axios.post(url, customer)
        return response.data;
    }

    static async updateCustomer(customer, id) {
        const url = `${enviroments.baseUrl}customers/update/${id}/`
        const response = await axios.put(url, customer)
        return response.data;
    }

    static async show(id) {
        const url = `${enviroments.baseUrl}customers/${id}/`
        const response = await axios.get(url)
        return response.data
    }
}