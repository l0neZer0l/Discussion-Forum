import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ user, onLogout }) => {
  const renderAuthLinks = () => {
    if (!user) {
      return (
        <React.Fragment>
          <li className="nav-item">
            <NavLink className="nav-link" to="/users/login">
              Login
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/users/register">
              Register
            </NavLink>
          </li>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {user.role === 'admin' && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin">
                Admin
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <span className="nav-link">Hi {user.username}</span>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#" onClick={onLogout}>
              Logout
            </NavLink>
          </li>
        </React.Fragment>
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Community
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">{renderAuthLinks()}</ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
