import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Health Consult
        </Link>
        <div className="space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <Link to="/login" className="hover:text-green-600">Login</Link>
          <Link to="/register" className="hover:text-green-600">Register</Link>
          <Link to="/chat" className="hover:text-green-600">Chat</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
