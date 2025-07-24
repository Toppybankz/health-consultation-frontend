import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/doctor.jpg";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative bg-cover h-[80vh] md:h-[90vh] flex items-center"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundPosition: "center top"
        }}
      >
        <div className="bg-black bg-opacity-40 absolute inset-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to Health Consultation
          </h1>
          <p className="text-base md:text-lg mb-6">
            Connect with doctors and get real-time advice from experts for free.
          </p>
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-5 md:px-6 py-3 rounded-lg font-semibold text-sm md:text-base"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-700">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          <div className="bg-white p-6 shadow-md rounded-lg text-center">
            <span className="text-green-600 text-4xl mb-4 block">💬</span>
            <h3 className="font-semibold text-xl">Free Service</h3>
            <p className="text-gray-600 mt-2">Consult doctors without any cost.</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg text-center">
            <span className="text-green-600 text-4xl mb-4 block">⏰</span>
            <h3 className="font-semibold text-xl">24/7 Support</h3>
            <p className="text-gray-600 mt-2">Get advice anytime, anywhere.</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg text-center">
            <span className="text-green-600 text-4xl mb-4 block">🔒</span>
            <h3 className="font-semibold text-xl">Secure & Reliable</h3>
            <p className="text-gray-600 mt-2">Your privacy is our priority.</p>
          </div>
        </div>
      </section>

      {/* Testimonies Section */}
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            {
              name: "Jane Doe",
              feedback: "Health Consult connected me with a doctor in minutes. Best experience ever!"
            },
            {
              name: "John Smith",
              feedback: "Very fast and reliable consultation service. Totally free!"
            },
            {
              name: "Mary Johnson",
              feedback: "Highly recommended. The doctors are professional and friendly."
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 shadow-md p-6 rounded-lg text-center">
              <p className="text-gray-700 italic mb-4">"{item.feedback}"</p>
              <h4 className="font-semibold text-green-700">- {item.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Health Tips */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Health Tips from Experts</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          {[
            { tip: "Drink plenty of water daily", doctor: "Dr. Adams" },
            { tip: "Exercise 30 mins daily", doctor: "Dr. Susan" },
            { tip: "Eat more fruits & veggies", doctor: "Dr. Mike" },
            { tip: "Get enough sleep", doctor: "Dr. Jane" },
            { tip: "Manage stress effectively", doctor: "Dr. Paul" },
            { tip: "Regular health checkups", doctor: "Dr. Grace" },
            { tip: "Avoid smoking", doctor: "Dr. Samuel" },
            { tip: "Limit processed foods", doctor: "Dr. Rose" },
          ].map((item, index) => (
            <div key={index} className="bg-white p-4 shadow-md rounded-lg">
              <p className="font-semibold text-gray-800">{item.tip}</p>
              <p className="text-sm text-gray-500 mt-1">- {item.doctor}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About & Privacy */}
      <section className="bg-gray-100 py-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="max-w-3xl mx-auto text-gray-600 mb-6">
          Health Consult is your trusted platform for free online health consultations. We prioritize your well-being and ensure professional guidance.
        </p>
        <h3 className="text-lg font-semibold">Privacy Policy</h3>
        <p className="max-w-3xl mx-auto text-gray-600">
          Your information is safe with us. We do not share your data with third parties.
        </p>
      </section>

      {/* ✅ Gray Background Footer */}
      <footer className="text-center mt-6 text-gray-600 text-sm py-4 bg-gray-200">
        Copyright © 2025 Health Consultation Agency.
      </footer>
    </div>
  );
};

export default Home;
