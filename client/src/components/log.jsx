// log.jsx
import React from "react";
import { Link, Redirect } from "react-router-dom";
import Joi from "joi-browser";
import { ToastContainer, toast } from "react-toastify";
import "../App.css";
import Input from "../components/common/input";
import Form from "./common/form";
import { login } from "../services/authService";

class Log extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().required().label("Email ID"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const { data: jwt } = await login(data.email, data.password);
      console.log("JWT Token:", jwt); // Add this line to log the token
      localStorage.setItem("token", jwt);
      console.log("Token Stored in Local Storage:", localStorage.getItem("token")); // Add this line to log the token after storing
      window.location = "/dashboard"; // Redirect to dashboard after successful login
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Invalid Email Or Password");
      }
    }
  };
  render() {
    if (localStorage.getItem("token")) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div>
        <div className="container col-lg-3 col-md-6 border rounded mt-3">
          <h1 className="p-3">Login</h1>

          <form onSubmit={this.handleSubmit}>
            <Input
              name="email"
              label="Email ID"
              onChange={this.handleChange}
              error={this.state.errors.email}
            />
            <Input
              name="password"
              label="Password"
              onChange={this.handleChange}
              error={this.state.errors.password}
              type="password"
            />
            <div className="text-center">
              <button
                className="btn btn-primary m-3"
                disabled={this.validate()}
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="container col-lg-3 col-md-6 border rounder mt-1 p-3 text-center">
          New User? <Link to="/users/register">Register Here</Link>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default Log;
