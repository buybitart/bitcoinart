import api from '../http'

export default class AuthService {
    static async login(email, password) {
        return api.post('/users/login', {email, password})
    }

    static async googleLogin(email, password) {
        return api.post('/users/login', {email, password})
    }

    static async register(email, password) {
        return api.post('/users/register', {email, password})
    }

    static async logout() {
        return api.put('/users/logout')
    }
}