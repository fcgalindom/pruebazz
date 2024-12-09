import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class SellerTicketsServices {

    static async dependencies(filters) {
        const url = enviroments.baseUrl + 'sellers-tickets/dependencies/'
        const response = await axios.get(url, { params: filters })
        return response.data
    }

    static async store(data, id) {
        try {
            const url = enviroments.baseUrl + `sellers-tickets/store/${id}/`
            const response = await axios.post(url, data)
            
            return response.data   
        } catch (error) {
            
            throw error.response.data
        }
    }

    static async show(id, is_tracking) {
        const url = enviroments.baseUrl + `sellers-tickets/show/${id}/`
        const response = await axios.get(url)
        return response.data
    }

    static async getTiketsFreeForSeller(raffle, seller) {
        const url = enviroments.baseUrl + `sellers-tickets/getTiketsFreeForSeller/`
        const response = await axios.get(url, { params: { raffle, seller } })
        return response.data
    }
}