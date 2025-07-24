import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <p className="text-lg mb-4">Welcome back! What do you want to do today?</p>
      <Link to="/chat" className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-600">
        Start Chat with Doctor
      </Link>
    </div>
  );
}

export default Dashboard;
