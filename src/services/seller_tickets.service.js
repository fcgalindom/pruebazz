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
    static async findByidbyTicket(numero) {
        try {
            const url = `${enviroments.baseUrl}primer-seller/`;
            const response = await axios.get(url, {
                params: { numero: numero.toString().padStart(4, '0') }
            });
            return response.data.seller_id;
        } catch (error) {
            console.error('Error al buscar seller por número:', error);
            return null;
        }
    }

    static async getTiketsFreeForSeller(raffle, seller) {
        const url = enviroments.baseUrl + `sellers-tickets/getTiketsFreeForSeller/`
        const response = await axios.get(url, { params: { raffle, seller } })
        return response.data
    }
}