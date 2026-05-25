import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { fullName, email, password });
      nav("/login");
    } catch {
      alert("Register error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl mb-4">Register</h1>

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
        />

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
          className="bg-green-500 text-white px-4 py-2 w-full"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="mt-2 text-sm">
          Have account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
