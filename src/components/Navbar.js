import React from "react";
import { Link, useLocation } from "react-router-dom";
const Navbar = () => {
  const { pathname } = useLocation();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  return <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50"><div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <Link to="/" className="text-2xl font-bold text-green-600">Health Consult</Link>
    <div className="space-x-6 text-gray-700 font-medium"><Link to="/" className="hover:text-green-600">Home</Link>
      {!token && <><Link to="/login" className="hover:text-green-600">Login</Link><Link to="/register" className="hover:text-green-600">Register</Link></>}
      {token && role !== "admin" && <Link to="/chat" className="hover:text-green-600">Chat</Link>}
      {token && role === "admin" && <Link to="/admin" aria-current={pathname === "/admin" ? "page" : undefined} className="hover:text-green-600">Admin</Link>}
    </div></div></nav>;
};
export default Navbar;
