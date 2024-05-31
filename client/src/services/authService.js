import http from './httpService'
import { api } from '../config.js'

export async function login(email, password) {
	try {
		const response = await http.post(api.usersEndPoint + 'login', {
			email,
			password,
		})

		const { token } = response.data
		if (typeof token === 'string') {
			localStorage.setItem('token', token)
		} else {
			console.error('Invalid token format:', token)
			throw new Error('Invalid token format')
		}
		return response
	} catch (error) {
		console.error('Login Error:', error)
		throw error
	}
}
