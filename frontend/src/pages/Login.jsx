import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URLS from "../config/apiUrls";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "", general: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setError((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: "", password: "", general: "" });

    try {
      const res = await fetch(API_URLS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/tasks");
      } else {
        if (data.message.includes("email")) {
          setError((prev) => ({ ...prev, email: data.message }));
        } else if (data.message.includes("password")) {
          setError((prev) => ({ ...prev, password: data.message }));
        } else {
          setError((prev) => ({ ...prev, general: data.message }));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError((prev) => ({ ...prev, general: "Something went wrong. Please try again later." }));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
      <div className="card shadow-lg p-4 border-0" style={{ width: "400px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>

        {error.general && <div className="alert alert-danger">{error.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${error.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {error.email && <div className="invalid-feedback">{error.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${error.password ? "is-invalid" : ""}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {error.password && <div className="invalid-feedback">{error.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
            Login
          </button>
          <button
            className="btn btn-link w-100 mt-2 text-primary fw-semibold"
            onClick={() => navigate("/register")}
          >
            Create an account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
