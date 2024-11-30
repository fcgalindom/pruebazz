import enviroments from '@/enviroments/api.js'
import axios from 'axios'

export class TicketServices {

    static async list(filters) {
        const url = `${enviroments.baseUrl}tickets/`
        const response = await axios.get(url, { params: filters })
        return response.data
    }

    static async dependencies() {
        const url = `${enviroments.baseUrl}tickets/dependencies/`
        const response = await axios.get(url)
        return response.data
    }

    static async show(id) {
        const url = `${enviroments.baseUrl}tickets/${id}/`
        const response = await axios.get(url)
        return response.data
    }

    static async createCustomer(raffle) {
        const url = `${enviroments.baseUrl}tickets/create/`
        const response = await axios.post(url, raffle)
        return response.data;
    }

    static async updateCustomer(raffle, id) {
        const url = `${enviroments.baseUrl}tickets/update/${id}/`;
        const response = await axios.put(url, raffle)
        return response.data;
    }

    static async changeState(id, status) {
        const url = `${enviroments.baseUrl}tickets/changeState/${id}/`;
        const response = await axios.put(url, {status: status})
        return response.data;
    }

    static async getTiketsByRaffle(id) {
        const url = `${enviroments.baseUrl}tickets/getTicketsByRaffle/${id}/`;
        const response = await axios.get(url)
        return response.data;
    }
    static async getTiketsRefferece() {
        const url = `${enviroments.baseUrl}ticketreferece/`;
        const response = await axios.get(url)
        return response.data;
    }

    static async downloadExcel() {
        try {
            const urlAxios = `${enviroments.baseUrl}tickets/generate-excel/`
            const response = await axios.get(urlAxios, {
              responseType: 'blob', // Importante para manejar el archivo
            });
    
            // Crear un enlace de descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.xlsx'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();
          } catch (error) {
            console.error('Error descargando el Excel:', error);
          }
    }
    static  getnumberticket(id){
        const url = `${enviroments.baseUrl}tickets/getnumer/${id}/`
        const response =  axios.get(url)
        return response

    }
    static  getnumberrafle(id){

        const url = `${enviroments.baseUrl}rafle/getnumber/${id}/`
        const response =  axios.get(url)
        return response.data

    }
}