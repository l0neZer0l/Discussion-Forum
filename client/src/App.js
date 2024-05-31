import React, { Component } from 'react'
import jwtDecode from 'jwt-decode'
import { Route, Switch, Redirect } from 'react-router-dom'
import http from './services/httpService'
import { api } from './config.js'
import Dashboard from './components/dashboard'
import Jumbotron from './components/common/jumbotron'
import NotFound from './components/not-found'
import NewPost from './components/createpost'
import Log from './components/log'
import Logout from './components/logout'
import Register from './components/register'
import NavBar from './components/navbar'
import ProtectedRoute from './components/common/protectedRoute'
import PostPage from './components/PostPage'
import EditPost from './components/EditPost'
import AdminPage from './components/AdminPage'

class App extends Component {
	state = {
		user: null,
	}

	async componentDidMount() {
		const jwt = localStorage.getItem('token')
		if (jwt) {
			try {
				const user_jwt = jwtDecode(jwt)
				const response = await http.get(`${api.usersEndPoint}/${user_jwt._id}`)
				const user = response.data
				this.setState({ user })
			} catch (ex) {
				console.error('Error fetching user data:', ex)
			}
		}
	}

	render() {
		return (
			<div>
				<NavBar user={this.state.user} />
				<Switch>
					<Route path='/users/login' component={Log} />
					<Route path='/users/register' component={Register} />
					<Route path='/users/logout' component={Logout} />
					<Route
						path='/dashboard'
						render={(props) => <Dashboard {...props} user={this.state.user} />}
					/>
					<Route path='/not-found' component={NotFound} />
					<ProtectedRoute
						path='/new-post'
						render={(props) => <NewPost {...props} user={this.state.user} />}
					/>
					<ProtectedRoute
						path='/edit-post/:id'
						render={(props) => <EditPost {...props} user={this.state.user} />}
					/>
					<Route
						path='/post/:id'
						render={(props) => <PostPage {...props} user={this.state.user} />}
					/>
					<Route path='/admin' component={AdminPage} />
					<Route exact path='/' component={Jumbotron} />
					<Redirect from='/users' to='/users/login' />
					<Redirect to='/not-found' />
				</Switch>
			</div>
		)
	}
}

export default App
