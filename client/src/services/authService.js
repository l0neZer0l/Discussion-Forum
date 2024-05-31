import http from './httpService'
import { api } from '../config.js'

export async function login(email, password) {
	try {
		const response = await http.post(api.usersEndPoint + 'login', {
			email,
			password,
		})
		return response
	} catch (error) {
		throw error
	}
}

export async function logout() {
	try {
		const response = await http.post(api.usersEndPoint + 'logout')
		return response
	} catch (error) {
		throw error
	}
}

export async function getCurrentUser() {
	try {
		const response = await http.get(api.usersEndPoint + 'me')
		return response.data
	} catch (error) {
		throw error
	}
}
