import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API_URLS from "../config/apiUrls";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState({ username: "", email: "", general: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers")
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long")
      .required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/^(?=.*[!@#$%^&*])/, "Password must contain at least one special character")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (formData) => {
    setServerError({ username: "", email: "", general: "" });
    setSuccessMessage("");

    try {
      const res = await fetch(API_URLS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        if (data.message.includes("Username")) {
          setServerError((prev) => ({ ...prev, username: data.message }));
          setError("username", { type: "server", message: data.message });
        } else if (data.message.includes("Email")) {
          setServerError((prev) => ({ ...prev, email: data.message }));
          setError("email", { type: "server", message: data.message });
        } else {
          setServerError((prev) => ({ ...prev, general: data.message }));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError((prev) => ({ ...prev, general: "Something went wrong. Please try again later." }));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
      <div className="card shadow-lg p-4 border-0" style={{ width: "400px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">Register</h2>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {serverError.general && <div className="alert alert-danger">{serverError.general}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username || serverError.username ? "is-invalid" : ""}`}
              id="username"
              {...register("username")}
              onChange={() => {
                setServerError((prev) => ({ ...prev, username: "" }));
                clearErrors("username");
              }}
            />
            {(errors.username || serverError.username) && (
              <div className="invalid-feedback">
                {serverError.username || errors.username?.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email || serverError.email ? "is-invalid" : ""}`}
              id="email"
              {...register("email")}
              onChange={() => {
                setServerError((prev) => ({ ...prev, email: "" }));
                clearErrors("email");
              }}
            />
            {(errors.email || serverError.email) && (
              <div className="invalid-feedback">
                {serverError.email || errors.email?.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              {...register("password")}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm" disabled={successMessage}>
            {successMessage ? "Redirecting..." : "Register"}
          </button>

          <button className="btn btn-link w-100 mt-2 text-primary fw-semibold" onClick={() => navigate("/")}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
