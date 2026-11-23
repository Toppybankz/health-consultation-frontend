import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import {
  sendMessage,
  getPrivateMessages,
  getDoctors,
  getPatients,
} from "../services/api";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";

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
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = userRole === "patient" ? await getDoctors() : await getPatients();
        setUsersList(res);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
  }, [userRole]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      auth: { token }
    });
    socketRef.current = socket;

    const handleIncomingMessage = (newMessage) => {
      if (newMessage.room === room && String(newMessage.sender) !== String(userId)) {
        setMessages((previous) => {
          if (newMessage._id && previous.some((item) => String(item._id) === String(newMessage._id))) {
            return previous;
          }
          return [...previous, newMessage];
        });
      }
    };
    socket.on("message", handleIncomingMessage);
    return () => {
      socket.off("message", handleIncomingMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [room, userId]);

  const loadMessages = useCallback(async (otherUser) => {
    if (!otherUser || !userId) return;
    try {
      const result = await getPrivateMessages(userId, otherUser._id);
      setMessages(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error loading messages:", error.message);
      setMessages([]);
    }
  }, [userId]);

  useEffect(() => {
    if (!selectedUser) return;
    loadMessages(selectedUser);
    if (socketRef.current) socketRef.current.emit("joinRoom", selectedUser._id);
  }, [selectedUser, loadMessages]);

  const joinRoom = (user) => {
    const newRoom = `private-${[String(userId), String(user._id)].sort().join("-")}`;
    setRoom(newRoom);
    setSelectedUser(user);
    localStorage.setItem("chatRoom", newRoom);
    localStorage.setItem("selectedUser", JSON.stringify(user));
    setMessages([]);
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !selectedUser || sending) return;

    setSending(true);
    try {
      // The API persists once and the backend broadcasts the saved message.
      // Do not also emit a socket send event (that used to save it twice).
      const savedMessage = await sendMessage({
        receiver: selectedUser._id,
        text: trimmedMessage
      });
      setMessages((previous) => {
        if (savedMessage._id && previous.some((item) => String(item._id) === String(savedMessage._id))) {
          return previous;
        }
        return [...previous, savedMessage];
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
            usersList.map((user) => (
              <li
                key={user._id}
                className={`p-3 hover:bg-green-100 cursor-pointer ${selectedUser?._id === user._id ? "bg-green-200 font-semibold" : ""}`}
                onClick={() => joinRoom(user)}
              >
                {user.name}
              </li>
            ))
          )}
        </ul>
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-green-700 text-center">
            {selectedUser ? `Chat with ${selectedUser.name}` : "Select a user to start chat"}
          </h2>
        </div>
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto bg-white rounded shadow p-4 mb-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg._id || `${msg.createdAt || "pending"}-${index}`}
                  className={`p-2 rounded-lg max-w-xs mb-2 ${String(msg.sender) === String(userId) ? "bg-green-100 self-end text-right" : "bg-gray-200"}`}
                >
                  {String(msg.sender) !== String(userId) && (
                    <p className="text-xs text-gray-600 font-semibold mb-1">{msg.senderName}</p>
                  )}
                  <p>{msg.text}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </div>
          {selectedUser && (
            <form
              className="flex"
              onSubmit={(event) => { event.preventDefault(); handleSend(); }}
            >
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l px-3 py-2"
                maxLength={5000}
              />
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 rounded-r"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
