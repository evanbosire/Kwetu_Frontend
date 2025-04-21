import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./addstaff.scss"; // Import the SCSS file
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner"; // Import the spinner
import axios from "axios"; // Import axios

const base_url = "http://localhost:5000"

const counties = [
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita Taveta",
  "Tana River",
  "Tharaka Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

const roles = [
  "Inventory manager",
  "Finance manager",
  "Service manager",
  "Supervisor",
  "Supplier",
  "Gym Coach",
  "Nutritionist",
];

const EmployeeForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) {
      navigate("/login");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("Submitting data:", data); // Log the data being sent

      // Ensure password is exactly 4 characters long
      if (data.password.length !== 4) {
        throw new Error("Password must be exactly 4 characters long.");
      }

      const response = await axios.post(
        `${base_url}/api/employees`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from server:", response.data); // Log the server response

      if (response.status !== 201) {
        throw new Error(
          response.data.message || "Network response was not ok."
        );
      }

      alert("Employee data submitted successfully");
      reset(); // Reset the form fields
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Log the server's error response
        console.error("Server error response:", error.response.data);
        alert("Failed to submit employee data: " + error.response.data.message);
      } else {
        alert("Failed to submit employee data: " + error.message);
      }
    } finally {
      setLoading(false); // Hide the loader
    }
  };

  return (
    <div className="staffContainer">
      <div className="title">ADD EMPLOYEE</div>
      <div className="form-container">
        {loading && (
          <div className="loaderContainer">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#3498db"
              ariaLabel="three-dots-loading"
            />
            <div className="loadingMessage">Submitting...</div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              {...register("firstName", { required: "First Name is required" })}
            />
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              {...register("lastName", { required: "Last Name is required" })}
            />
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <span className="error">{errors.gender.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="county">County</label>
            <select
              id="county"
              {...register("county", { required: "County is required" })}
            >
              <option value="">Select County</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
            {errors.county && (
              <span className="error">{errors.county.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              {...register("phoneNumber", {
                required: "Phone Number is required",
              })}
            />
            {errors.phoneNumber && (
              <span className="error">{errors.phoneNumber.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">User Role</label>
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <span className="error">{errors.role.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must be exactly 4 characters",
                },
                maxLength: {
                  value: 4,
                  message: "Password must be exactly 4 characters",
                },
              })}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
