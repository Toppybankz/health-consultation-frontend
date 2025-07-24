import axios from "axios";

const API_URL = "http://localhost:5001/api"; // Backend Base URL

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};

// ✅ Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// ✅ Fetch All Group Chat Messages
export const fetchMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/chat/messages`);
    return response.data;
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    throw error;
  }
};

// ✅ Alias for getMessages (to match Chat.js usage)
export const getMessages = fetchMessages;

// ✅ Send Chat Message (Group or Private)
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/chat/send`, messageData);
    return response.data;
  } catch (error) {
    console.error("Send Message Error:", error);
    throw error;
  }
};

// ✅ Fetch Private Messages Between Two Users
export const getPrivateMessages = async (senderId, receiverId) => {
  try {
    const response = await axios.get(`${API_URL}/chat/private/${senderId}/${receiverId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Private Messages Error:", error);
    throw error;
  }
};

// ✅ Fetch All Doctors
export const getDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/doctors`);
    return response.data;
  } catch (error) {
    console.error("Fetch Doctors Error:", error);
    throw error;
  }
};

// ✅ NEW: Fetch All Patients (for doctors)
export const getPatients = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/patients`);
    return response.data;
  } catch (error) {
    console.error("Fetch Patients Error:", error);
    throw error;
  }
};
