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
      await userService.register(this.state.data); // Register function now handles storing session
      window.location = "/dashboard"; // Redirect to dashboard after successful registration
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("User Already Registered");
      }
    }
  };

  render() {
    // If session exists, redirect to dashboard
    if (localStorage.getItem("token")) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <React.Fragment>
        <ToastContainer />
        <div className="container-fluid col-lg-4 col-md-8">
          <h1>Register</h1>
          <form onSubmit={this.handleSubmit}>
            {/* Your input fields go here */}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
