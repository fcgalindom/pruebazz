import enviroments from '@/enviroments/api.js'
import axios from 'axios'


export class LoginServices {

    static async login(user) {
        const url = `${enviroments.baseUrl}sellers/login/`
        const response = await axios.post(url, user)
        return response.data
    }

}