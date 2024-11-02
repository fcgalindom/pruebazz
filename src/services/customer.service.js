import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class CustomerServices {

    static async list(filters) {
        const url = `${enviroments.baseUrl}customers/`
        const response = await axios.get(url, { params: filters });
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

    static async listCities() {
        const url = `${enviroments.baseUrl}cities/`
        const response = await axios.get(url)
        return response.data
    }
    static async getByDocument(document) {
        const url = `${enviroments.baseUrl}customersDocuments/`
        const response = await axios.get(url, { params: { document } });
        return response.data
    }

}