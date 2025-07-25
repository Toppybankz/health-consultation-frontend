import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import {
  sendMessage,
  getPrivateMessages,
  getDoctors,
  getPatients,
} from "../services/api";

// ✅ Use live backend for production, fallback to localhost for dev
const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  "https://health-backend-2xol.onrender.com";

// ✅ Configure socket with proper path and transports
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // ✅ Avoid long polling issues
  withCredentials: true,
  path: "/socket.io", // ✅ Explicit path for Render compatibility
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId] = useState(localStorage.getItem("userId"));
  const [userRole] = useState(localStorage.getItem("role") || "patient");
  const [userName] = useState(localStorage.getItem("userName"));
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(
    JSON.parse(localStorage.getItem("selectedUser")) || null
  );
  const [room, setRoom] = useState(localStorage.getItem("chatRoom") || null);

  const messagesEndRef = useRef(null);

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Fetch doctors or patients
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res =
          userRole === "patient" ? await getDoctors() : await getPatients();
        setUsersList(res);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
  }, [userRole]);

  // ✅ Load previous messages for the selected user
  const loadMessages = useCallback(async () => {
    try {
      if (selectedUser && userId) {
        const res = await getPrivateMessages(userId, selectedUser._id);
        setMessages(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("Error loading messages:", error.message);
      setMessages([]);
    }
  }, [selectedUser, userId]);

  // ✅ Join saved room on refresh
  useEffect(() => {
    if (room) {
      socket.emit("joinRoom", room);
      loadMessages();
    }
  }, [room, loadMessages]);

  // ✅ Listen for new real-time messages
  useEffect(() => {
    const handleIncomingMessage = (newMessage) => {
      if (newMessage.room === room) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("message", handleIncomingMessage);
    return () => socket.off("message", handleIncomingMessage);
  }, [room]);

  // ✅ Switch chat to another user
  const joinRoom = (user) => {
    const newRoom = `private-${[userId, user._id].sort().join("-")}`;
    setRoom(newRoom);
    setSelectedUser(user);

    localStorage.setItem("chatRoom", newRoom);
    localStorage.setItem("selectedUser", JSON.stringify(user));

    socket.emit("joinRoom", newRoom);
    loadMessages();
  };

  // ✅ Send message to backend + socket
  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;

    const newMsg = {
      text: message,
      sender: userId,
      senderName: userName || "Unknown",
      room,
      receiver: selectedUser._id,
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      await sendMessage(newMsg);
      socket.emit("sendMessage", newMsg);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }

    setMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r border-gray-300 h-screen overflow-y-auto">
        <div className="p-4 text-sm text-gray-600 border-b">
          Logged in as: <span className="font-semibold">{userName}</span> ({userRole})
        </div>
        <h3 className="p-4 font-bold text-green-700">
          {userRole === "patient" ? "Doctors" : "Patients"}
        </h3>
        <ul>
          {usersList.length === 0 ? (
            <p className="text-gray-500 text-sm px-4">
              No {userRole === "patient" ? "doctors" : "patients"} available
            </p>
          ) : (
            usersList.map((u) => (
              <li
                key={u._id}
                className={`p-3 hover:bg-green-100 cursor-pointer ${
                  selectedUser?._id === u._id ? "bg-green-200 font-semibold" : ""
                }`}
                onClick={() => joinRoom(u)}
              >
                {u.name}
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-green-700 text-center">
            {selectedUser
              ? `Chat with ${selectedUser.name}`
              : "Select a user to start chat"}
          </h2>
        </div>

        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto bg-white rounded shadow p-4 mb-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-xs mb-2 ${
                    msg.sender === userId
                      ? "bg-green-100 self-end text-right"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.sender !== userId && (
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      {msg.senderName}
                    </p>
                  )}
                  <p>{msg.text}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {selectedUser && (
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l px-3 py-2"
              />
              <button
                onClick={handleSend}
                className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-r"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
