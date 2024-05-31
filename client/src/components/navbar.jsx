import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ user }) => {
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
            <NavLink className="nav-link" to="/me">
              Hi {user.username}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/users/logout">
              Logout
            </NavLink>
          </li>
        </React.Fragment>
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <NavLink className="navbar-brand" to="/">
        Community
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
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
    </nav>
  );
};

export default NavBar;
