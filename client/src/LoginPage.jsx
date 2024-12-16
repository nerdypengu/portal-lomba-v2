"use client";

import React, { useState } from "react";
import { Button, TextInput, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom"; // for navigation after login

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function from react-router

  const handleLogin = async () => {
    setError(null);
    setShowErrorNotification(false);

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
        credentials: "include", // Make sure cookies are included in cross-origin requests
      });

      const result = await response.json();

      if (response.ok) {
        // Handle successful login
        alert("Login successful");
        console.log("Server Response:", result);

        // Redirect to the dashboard after successful login
        navigate("/dashboard");
      } else {
        // Handle login error from the API response
        setError(result.message || "Login failed. Please try again.");
        setShowErrorNotification(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      setShowErrorNotification(true);
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        {showErrorNotification && (
          <Alert color="failure" className="mb-4">
            <span>{error}</span>
          </Alert>
        )}

        <div className="mb-4">
          <TextInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
