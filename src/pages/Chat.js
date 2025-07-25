import React, { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import {
  sendMessage,
  getPrivateMessages,
  getDoctors,
  getPatients,
} from "../services/api";

// ✅ Use environment variable for socket URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";
const socket = io(SOCKET_URL);

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

  // ✅ Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Fetch Doctors or Patients
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

  // ✅ Load chat history
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

  // ✅ Join room if saved
  useEffect(() => {
    if (room) {
      socket.emit("joinRoom", room);
      loadMessages();
    }
  }, [room, loadMessages]);

  // ✅ Real-time listener
  useEffect(() => {
    const handleIncomingMessage = (newMessage) => {
      if (newMessage.room === room) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("message", handleIncomingMessage);
    return () => socket.off("message", handleIncomingMessage);
  }, [room]);

  // ✅ Select user and join new room
  const joinRoom = (user) => {
    const newRoom = `private-${[userId, user._id].sort().join("-")}`;
    setRoom(newRoom);
    setSelectedUser(user);

    localStorage.setItem("chatRoom", newRoom);
    localStorage.setItem("selectedUser", JSON.stringify(user));

    socket.emit("joinRoom", newRoom);
    loadMessages();
  };

  // ✅ Send message
  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;

    const newMsg = {
      text: message,
      sender: userId,
      senderName: userName || "Unknown", // ✅ FIX: Always include senderName
      room,
      receiver: selectedUser._id,
    };

    // Optimistic update
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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <div className="mb-4 text-sm text-gray-600">
          Logged in as: <span className="font-semibold">{userName}</span> ({userRole})
        </div>
        <h3 className="font-bold text-green-700 mb-4">
          {userRole === "patient" ? "Doctors" : "Patients"}
        </h3>
        <ul>
          {usersList.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No {userRole === "patient" ? "doctors" : "patients"} available
            </p>
          ) : (
            usersList.map((u) => (
              <li
                key={u._id}
                className={`p-2 rounded cursor-pointer hover:bg-green-100 ${
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
        <div className="sticky top-0 bg-gray-100 z-10 text-center py-3 border-b">
          <h2 className="text-xl font-bold text-green-700">
            {selectedUser
              ? `Chat with ${selectedUser.name}`
              : "Select a user to start chat"}
          </h2>
        </div>

        <div className="bg-white shadow-md rounded w-full max-w-2xl mx-auto p-4 flex flex-col mt-4">
          <div className="flex-1 overflow-y-auto h-80 border p-4 mb-4 space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.sender === userId
                      ? "bg-green-100 self-end text-right"
                      : "bg-gray-200"
                  }`}
                >
                  {/* ✅ Show sender name if not you */}
                  {msg.sender !== userId && (
                    <p className="text-xs text-gray-600 font-semibold mb-1">{msg.senderName}</p>
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
                className="flex-1 border p-2 rounded-l"
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
