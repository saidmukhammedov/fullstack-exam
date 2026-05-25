import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      console.log("Login error:", err);
      alert("Login error: " + err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl mb-4">Login</h1>

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 mb-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 w-full"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="mt-2 text-sm">
          No account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
