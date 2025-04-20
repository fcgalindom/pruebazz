import enviroments from '@/enviroments/api.js'
import axios from 'axios'
import Swal from 'sweetalert2'

export class SellerServices {

    static async list(filters) {
        const url = enviroments.baseUrl + 'sellers/'
        const response = await axios.get(url, { params: filters })
        return response.data
    }

    static async createSeller(seller) {
        const url = enviroments.baseUrl + 'sellers/register/';
    try {
        const response = await axios.post(url, seller);
        Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
        return response.data;
    } catch (error) {
        let message = 'Ocurrió un error al registrar el vendedor.';
        if (error.response.status === 400) {
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                html: error.response.data.error,
            });

        }else{
  
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                html: message,
                customClass: {
                    popup: 'z-[9999]' // si usas TailwindCSS
                }
            });
        }
        return error;
    }

    }

    static async updateSeller(user,id) {
        const url =  `${enviroments.baseUrl}sellers/update/${id}/`;
        try {
        const response = await axios.put(url, user)
        Swal.fire("¡Guardado!", "Datos guardados con éxito", "success");
        return response.data;
        }catch (error) {
            let message = 'Ocurrió un error al registrar el vendedor.';
            if (error.response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    html: error.response.data.error,
                });
    
            }else{
      
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    html: message,
                });
            }
            return error;
        }
    }
    static async show(id) {
        const url = `${enviroments.baseUrl}sellers/${id}/`
        const response = await axios.get(url)
        return response.data
    }

    static async tracking(id, filters) {
        const url = `${enviroments.baseUrl}sellers-tracking/${id}/`
        const response = await axios.get(url, {params: filters})
        return response.data
    }
    static async getsellerofice() {
        const url = `${enviroments.baseUrl}sellers/ofice/`
        const response = await axios.get(url)
        return response.data
    }
    static async updateSellerStatus(id,status) {
        const url =  `${enviroments.baseUrl}sellers/update-status/${id}/`;
        const response = await axios.put(url, status)
        return response.data;
    }
}