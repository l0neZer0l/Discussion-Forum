import http from './httpService'
import { api } from '../config.js'

export function login(email, password) {
	return http
		.post(api.usersEndPoint + 'login', {
			email: email,
			password: password,
		})
		.then((response) => {
			console.log('Login Response:', response) // Add this line to log the response
			return response
		})
		.catch((error) => {
			console.error('Login Error:', error)
			throw error // Ensure the error is thrown to the caller
		})
}
