import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.scss";

const Register = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "id":
        if (!value.trim()) {
          toast.error("Username is required");
          return false;
        }
        if (!/^[a-zA-Z]+$/.test(value)) {
          toast.error("Username should contain only letters");
          return false;
        }
        return true;

      case "name":
        if (!value.trim()) {
          toast.error("Full name is required");
          return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          toast.error("Full name should contain only letters");
          return false;
        }
        return true;

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

      case "phone":
        if (!value) {
          toast.error("Phone number is required");
          return false;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          toast.error("Phone number must be exactly 10 digits");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Create an array of validations to run
    const validations = [
      { field: "id", value: formData.id },
      { field: "name", value: formData.name },
      { field: "email", value: formData.email },
      { field: "password", value: formData.password },
      { field: "phone", value: formData.phone },
    ];

    // Run all validations
    for (const validation of validations) {
      if (!validateField(validation.field, validation.value)) {
        isValid = false;
        break; // Stop at first error
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        "https://kwetu-backend.onrender.com/api/admin/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Administrator account created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => navigate("/login"),
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const data = await response.json();
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    }
  };

  // Real-time validation as user types
  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  return (
    <div className="signup-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="signup-card">
        <div className="signup-header">
          <div className="logo-container">
            <div className="logo-circle"></div>
            <h1>Sign Up</h1>
          </div>
          <p className="subtitle">Create your administrator account</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Username (letters only)"
              className="form-input"
            />
            <div className="input-highlight"></div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Full Name (letters only)"
              className="form-input"
            />
            <div className="input-highlight"></div>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email (E.g example@gmail.com)"
              className="form-input"
            />
            <div className="input-highlight"></div>
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
            <div className="input-highlight"></div>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Phone Number (10 digits)"
              className="form-input"
            />
            <div className="input-highlight"></div>
          </div>

          <button type="submit" className="submit-btn">
            Create Account
          </button>

          <div className="login-link">
            Already have an account?
            <a href="/login" className="link">
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
