import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
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

	componentDidMount() {
		const userCookie = this.getCookie('user')
		if (userCookie) {
			this.setState({ user: userCookie })
		}
	}

	getCookie(name) {
		const value = `; ${document.cookie}`
		const parts = value.split(`; ${name}=`)
		if (parts.length === 2) return parts.pop().split(';').shift()
		return null
	}

	render() {
		const { user } = this.state

		return (
			<div>
				<NavBar user={user} />
				<Switch>
					<Route
						path='/users/login'
						render={(props) =>
							user ? <Redirect to='/dashboard' /> : <Log {...props} />
						}
					/>
					<Route
						path='/users/register'
						render={(props) =>
							user ? <Redirect to='/dashboard' /> : <Register {...props} />
						}
					/>
					<Route path='/users/logout' component={Logout} />
					<ProtectedRoute path='/dashboard' component={Dashboard} user={user} />
					<Route path='/not-found' component={NotFound} />
					<ProtectedRoute path='/new-post' component={NewPost} user={user} />
					<ProtectedRoute
						path='/edit-post/:id'
						component={EditPost}
						user={user}
					/>
					<Route
						path='/post/:id'
						render={(props) => <PostPage {...props} user={user} />}
					/>
					<ProtectedRoute path='/admin' component={AdminPage} user={user} />
					<Route exact path='/' component={Jumbotron} />
					<Redirect from='/users' to='/users/login' />
					<Redirect to='/not-found' />
				</Switch>
			</div>
		)
	}
}

export default App
