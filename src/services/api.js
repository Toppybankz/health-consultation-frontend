import axios from "axios";

// ✅ Use environment variable for API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// ✅ Create a reusable Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Login User
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch All Group Chat Messages
export const fetchMessages = async () => {
  try {
    const response = await api.get("/chat/messages");
    return response.data;
  } catch (error) {
    console.error("Fetch Messages Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Alias for getMessages (to match Chat.js usage)
export const getMessages = fetchMessages;

// ✅ Send Chat Message (Group or Private)
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/chat/send", messageData);
    return response.data;
  } catch (error) {
    console.error("Send Message Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch Private Messages Between Two Users
export const getPrivateMessages = async (senderId, receiverId) => {
  try {
    const response = await api.get(`/chat/private/${senderId}/${receiverId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Private Messages Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch All Doctors
export const getDoctors = async () => {
  try {
    const response = await api.get("/auth/doctors");
    return response.data;
  } catch (error) {
    console.error("Fetch Doctors Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch All Patients
export const getPatients = async () => {
  try {
    const response = await api.get("/auth/patients");
    return response.data;
  } catch (error) {
    console.error("Fetch Patients Error:", error.response?.data || error.message);
    throw error;
  }
};
