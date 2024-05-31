import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Create a new axios instance
const http = axios.create()

// Add a request interceptor to set the x-auth-token header
http.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (typeof token === 'string') {
		config.headers['x-auth-token'] = token
	} else {
		console.error('Invalid token format:', token)
		throw new Error('Invalid token format')
	}
	return config
})

// Add a response interceptor for handling unexpected errors
http.interceptors.response.use(null, (error) => {
	const expectedError =
		error.response &&
		error.response.status >= 400 &&
		error.response.status < 500

	if (!expectedError) {
		toast('An unexpected error occurred!')
	}
	console.log(error.response.status)
	console.log(error)
	return Promise.reject(error)
})

export default {
	get: http.get,
	post: http.post,
	put: http.put,
	delete: http.delete,
}
