import { useState } from "react";

import api from "../services/api";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../context/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        formData
      );

      login(res.data);

      toast.success("Login successful");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <button
          className="w-full bg-black text-white p-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;