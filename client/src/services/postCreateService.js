import http from './httpService'
import { api } from '../config.js'

export function createpost(postbody) {
	return http.post(api.postsEndPoint + 'create', {
		title: postbody.title,
		description: postbody.description,
		tags: postbody.tags,
	})
}
