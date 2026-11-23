import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!formData.name || !formData.email || !formData.password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      const res = await registerUser(formData);
      alert(res.message || "Registration completed.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally { setLoading(false); }
  };
  return <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center"><div className="bg-white p-8 rounded shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Register</h2>
    {error && <p role="alert" className="text-red-500 mb-4 text-center">{error}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded" />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border p-2 rounded" />
      <input type="password" name="password" placeholder="Password (at least 8 characters)" value={formData.password} onChange={handleChange} required minLength={8} className="w-full border p-2 rounded" />
      <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded"><option value="patient">Patient</option><option value="doctor">Doctor</option></select>
      <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-70">{loading ? "Registering..." : "Register"}</button>
    </form>
  </div></div>;
};
export default Register;
