import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";
import logo from "../../assets/images/logo.png"; // Import the logo

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) {
          toast.error("Email is required");
          return false;
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        return true;

      case "password":
        if (!value) {
          toast.error("Password is required");
          return false;
        }
        if (value.length < 4) {
          toast.error("Password must be at least 4 characters long");
          return false;
        }
        if (value.length > 6) {
          toast.error("Password cannot exceed 6 characters");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const validateForm = () => {
    return (
      validateField("email", formData.email) &&
      validateField("password", formData.password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        "https://kwetu-backend.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {
            sessionStorage.setItem("email", formData.email);
            navigate("/dashboard");
          },
        });
      } else {
        const data = await response.json();
        toast.error(data.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    }
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-image" />
            <h1>Login</h1>
          </div>
          <p className="subtitle">Welcome back administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password (4-6 characters)"
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>

          <div className="login-link">
            Don't have an account?
            <Link to="/register" className="link">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
