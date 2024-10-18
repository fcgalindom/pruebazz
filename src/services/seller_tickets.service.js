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
            console.log('todo bien', response.data);
            
            return response.data   
        } catch (error) {
            console.log(error.response.data);
            
            throw error.response.data
        }
    }

    static async show(id) {
        const url = enviroments.baseUrl + `sellers-tickets/show/${id}/`
        const response = await axios.get(url)
        return response.data
    }
}