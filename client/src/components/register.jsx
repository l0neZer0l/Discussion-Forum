import React from "react";
import Input from "./common/input";
import Form from "./common/form";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import * as userService from "../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/react-toastify.esm";

class Register extends Form {
  state = {
    data: { username: "", email: "", password: "", password2: "", name: "", role: "", cinNumber: "" },
    errors: {},
  };

  schema = {
    name: Joi.string().required().label("Full Name"),
    username: Joi.string().required().label("Username"),
    email: Joi.string().required().label("Email ID"),
    password: Joi.string().required().label("Password"),
    password2: Joi.string().required().label("Confirm Password"),
    role: Joi.string().required().valid("professeur", "ex-etudiant", "etudiant").label("Role"),
    cinNumber: Joi.string().required().length(8).regex(/^\d+$/).label("CIN Number"),
  };

  doSubmit = async () => {
    try {
      const response = await userService.register(this.state.data);
      localStorage.setItem("token", response.headers["x-auth-token"]);
      window.location = "/dashboard"; // Redirect to dashboard after successful registration
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("User Already Registered");
      }
    }
  };

  render() {
    if (localStorage.getItem("token")) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="container-fluid col-lg-4 col-md-8">
          <h1>Register</h1>
          <form onSubmit={this.handleSubmit}>
            <Input
              value={this.state.data.name}
              onChange={this.handleChange}
              label="Name"
              name="name"
              type="text"
              error={this.state.errors.name}
            />
            <Input
              name="username"
              value={this.state.data.username}
              label="Username"
              type="text"
              onChange={this.handleChange}
              error={this.state.errors.username}
            />
            <Input
              value={this.state.data.email}
              onChange={this.handleChange}
              label="Email ID"
              type="text"
              name="email"
              error={this.state.errors.email}
            />
            <Input
              value={this.state.data.password}
              onChange={this.handleChange}
              label="Password"
              type="password"
              name="password"
              error={this.state.errors.password}
            />
            <Input
              value={this.state.data.password2}
              onChange={this.handleChange}
              label="Confirm Password"
              name="password2"
              type="password"
              error={this.state.errors.password2}
            />
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select className="form-select" id="role" name="role" value={this.state.data.role} onChange={this.handleChange}>
                <option value="">Select Role</option>
                <option value="professeur">Professeur</option>
                <option value="ex-etudiant">Ex-Etudiant</option>
                <option value="etudiant">Etudiant</option>
              </select>
              {this.state.errors.role && <div className="text-danger">{this.state.errors.role}</div>}
            </div>
            <Input
              value={this.state.data.cinNumber}
              onChange={this.handleChange}
              label="CIN Number"
              name="cinNumber"
              type="text"
              error={this.state.errors.cinNumber}
            />
            <div className="d-grid gap-2">
              <button className="btn btn-primary" disabled={this.validate()}>
                Register
              </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
