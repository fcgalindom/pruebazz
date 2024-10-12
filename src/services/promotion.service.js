import enviroments from '@/enviroments/api.js'
import axios from 'axios'


export class PromotionServices {

    static async list(filters) {
        const url = `${enviroments.baseUrl}promotions/`
        const response = await axios.get(url, { params: filters });
        return response.data
    }

    static async createPromotion(promotion) {
        const url = `${enviroments.baseUrl}promotions/create/`
        const response = await axios.post(url, promotion)
        return response.data;
    }

    static async updatePromotion(promotion, id) {
        const url = `${enviroments.baseUrl}promotions/update/${id}/`
        const response = await axios.put(url, promotion)
        return response.data;
    }

    static async show(id) {
        const url = `${enviroments.baseUrl}promotions/${id}/`
        const response = await axios.get(url)
        return response.data
    }
    static async deletePromotion(state , id) {
        const url = `${enviroments.baseUrl}promotions/change_state/${id}/`
        const response = await axios.put(url,state)
        return response.data
    }

}