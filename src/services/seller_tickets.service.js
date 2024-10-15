import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class SellerTicketsServices {

    static async dependencies(filters) {
        const url = enviroments.baseUrl + 'sellers-tickets/dependencies/'
        const response = await axios.get(url, { params: filters })
        return response.data
    }

    static async store(data, id) {
        const url = enviroments.baseUrl + `sellers-tickets/store/${id}/`
        const response = await axios.post(url, data)
        return response.data
    }
}