import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class SellerServices {

    static async list() {
        const url = enviroments.baseUrl + 'sellers/'
        const response = await axios.get(url)
        return response.data
    }

    static async createSeller(seller) {
        const url = enviroments.baseUrl + 'sellers/register/';
        const response = await axios.post(url, seller)
        return response.data;
    }

    static async updateSeller() {
        const url = enviroments.baseUrl + 'customer/update/';
        const response = await axios.post(url, user)
        return response.data;
    }
}