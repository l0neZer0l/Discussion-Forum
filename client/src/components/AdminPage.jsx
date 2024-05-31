import React, { Component } from 'react';
import http from '../services/httpService';
import { api } from '../config';
import './AdminPage.css'; // Import CSS file for styling

class AdminPage extends Component {
  state = {
    users: [],
    roles: [],
    selectedUser: null,
    selectedRole: null,
  };

  async componentDidMount() {
    try {
      // Fetch users and roles from the backend
      const { data: users } = await http.get(api.usersEndPoint);
      const { data: roles } = await http.get(api.rolesEndPoint);

      this.setState({ users, roles });
    } catch (error) {
      console.error('Error fetching users and roles:', error);
    }
  }

  handleUserSelect = event => {
    const selectedUserId = event.target.value;
    const selectedUser = this.state.users.find(user => user._id === selectedUserId);
    this.setState({ selectedUser });
  };

  handleRoleSelect = event => {
    const selectedRoleId = event.target.value;
    const selectedRole = this.state.roles.find(role => role._id === selectedRoleId);
    this.setState({ selectedRole });
  };

  handleAssignRole = async () => {
    const { selectedUser, selectedRole } = this.state;
    if (!selectedUser || !selectedRole) return;

    try {
      // Update user role on the backend
      await http.put(`${api.usersEndPoint}/${selectedUser._id}/role`, { role: selectedRole._id });

      // Update user role in the state
      const updatedUsers = this.state.users.map(user =>
        user._id === selectedUser._id ? { ...user, role: selectedRole } : user
      );
      this.setState({ users: updatedUsers });

      // Reset selectedUser and selectedRole
      this.setState({ selectedUser: null, selectedRole: null });
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  render() {
    const { users, roles, selectedUser, selectedRole } = this.state;

    return (
      <div className="admin-page">
        <h1>Admin Page</h1>
        {/* User Role Management Section */}
        <div className="user-role-management">
          <h2>User Role Management</h2>
          {/* Dropdown to select a user */}
          <select onChange={this.handleUserSelect} value={selectedUser ? selectedUser._id : ''}>
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </select>
          {/* Dropdown to select a role */}
          <select onChange={this.handleRoleSelect} value={selectedRole ? selectedRole._id : ''}>
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
          {/* Button to assign role to user */}
          <button onClick={this.handleAssignRole}>Assign Role</button>
        </div>
        {/* Other Admin Functionalities */}
        {/* Add tags, Edit/Delete posts, Ban users, etc. */}
      </div>
    );
  }
}

export default AdminPage;
