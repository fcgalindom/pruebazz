import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class SellerServices {

    static async list(filters) {
        const url = enviroments.baseUrl + 'sellers/'
        const response = await axios.get(url, { params: filters })
        return response.data
    }

    static async createSeller(seller) {
        const url = enviroments.baseUrl + 'sellers/register/';
        const response = await axios.post(url, seller)
        return response.data;
    }

    static async updateSeller(user,id) {
        const url =  `${enviroments.baseUrl}sellers/update/${id}/`;
        const response = await axios.put(url, user)
        return response.data;
    }
    static async show(id) {
        const url = `${enviroments.baseUrl}sellers/${id}/`
        const response = await axios.get(url)
        return response.data
    }
}