import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { sendMessage, getPrivateMessages, getDoctors, getPatients, getConversations } from "../services/api";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";

const readSelectedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("selectedUser") || "null");
  } catch {
    return null;
  }
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId] = useState(localStorage.getItem("userId"));
  const [userRole] = useState(localStorage.getItem("role") || "patient");
  const [userName] = useState(localStorage.getItem("userName"));
  const [usersList, setUsersList] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(readSelectedUser);
  const [room, setRoom] = useState(localStorage.getItem("chatRoom") || null);
  const [sending, setSending] = useState(false);
  const [inboxError, setInboxError] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const roomRef = useRef(room);
  const selectedUserRef = useRef(selectedUser);

  const refreshConversations = useCallback(async () => {
    try {
      const result = await getConversations();
      setConversations(Array.isArray(result) ? result : []);
      setInboxError("");
    } catch (error) {
      setInboxError(error.response?.data?.message || "Unable to load your conversation inbox.");
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = userRole === "patient" ? await getDoctors() : await getPatients();
        setUsersList(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
    refreshConversations();
  }, [userRole, refreshConversations]);

  // Keep one authenticated socket alive. Rejoin the selected room after every reconnect.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"], auth: { token } });
    socketRef.current = socket;

    const joinSelectedRoom = () => {
      const participant = selectedUserRef.current;
      const participantId = participant && (participant._id || participant.id);
      if (participantId) socket.emit("joinRoom", participantId);
    };

    const handleIncomingMessage = (newMessage) => {
      if (newMessage.room === roomRef.current && String(newMessage.sender) !== String(userId)) {
        setMessages((previous) => previous.some((item) => String(item._id) === String(newMessage._id)) ? previous : [...previous, newMessage]);
      }
      refreshConversations();
    };

    socket.on("connect", joinSelectedRoom);
    socket.on("message", handleIncomingMessage);

    return () => {
      socket.off("connect", joinSelectedRoom);
      socket.off("message", handleIncomingMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, refreshConversations]);

  useEffect(() => {
    roomRef.current = room;
    selectedUserRef.current = selectedUser;
    if (!selectedUser) return;
    loadMessages(selectedUser);
    const participantId = selectedUser._id || selectedUser.id;
    if (socketRef.current?.connected && participantId) socketRef.current.emit("joinRoom", participantId);
  }, [room, selectedUser]); // loadMessages is stable for the logged-in user.

  const loadMessages = useCallback(async (otherUser) => {
    if (!otherUser || !userId) return;
    try {
      const result = await getPrivateMessages(userId, otherUser._id || otherUser.id);
      setMessages(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error loading messages:", error.message);
      setMessages([]);
    }
  }, [userId]);

  const joinRoom = (user) => {
    const otherId = user._id || user.id;
    const newRoom = `private-${[String(userId), String(otherId)].sort().join("-")}`;
    roomRef.current = newRoom;
    selectedUserRef.current = user;
    setRoom(newRoom);
    setSelectedUser(user);
    localStorage.setItem("chatRoom", newRoom);
    localStorage.setItem("selectedUser", JSON.stringify(user));
    setMessages([]);
    if (socketRef.current?.connected) socketRef.current.emit("joinRoom", otherId);
    loadMessages(user);
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !selectedUser || sending) return;
    setSending(true);
    try {
      const savedMessage = await sendMessage({ receiver: selectedUser._id || selectedUser.id, text: trimmedMessage });
      setMessages((previous) => previous.some((item) => String(item._id) === String(savedMessage._id)) ? previous : [...previous, savedMessage]);
      setMessage("");
      await refreshConversations();
    } catch (error) {
      setInboxError(error.response?.data?.message || error.response?.data?.error || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-[560px] bg-gray-100">
      <aside className="w-full max-w-sm bg-white border-r border-gray-300 overflow-y-auto">
        <div className="p-4 text-sm text-gray-600 border-b">
          Logged in as: <span className="font-semibold">{userName}</span> ({userRole})
        </div>
        <section className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h3 className="font-bold text-green-700">Your conversations</h3>
            <button type="button" onClick={refreshConversations} className="text-sm text-green-700 hover:underline">Refresh</button>
          </div>
          {inboxError && <p role="alert" className="mx-4 mb-3 text-sm text-red-600">{inboxError}</p>}
          {conversations.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-gray-500">No conversations yet. Choose someone below to start one.</p>
          ) : (
            <ul className="pb-2">
              {conversations.map((conversation) => {
                const participant = conversation.participant;
                const lastMessage = conversation.lastMessage;
                const participantId = participant.id;
                return (
                  <li key={participantId}>
                    <button type="button" onClick={() => joinRoom({ _id: participantId, name: participant.name, role: participant.role })}
                      className={`w-full px-4 py-3 text-left hover:bg-green-50 ${String(selectedUser?._id || selectedUser?.id) === String(participantId) ? "bg-green-100" : ""}`}>
                      <span className="block font-semibold text-gray-800">{participant.name}</span>
                      <span className="block truncate text-xs text-gray-500">{lastMessage?.text || "Conversation started"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        <section>
          <h3 className="p-4 font-bold text-green-700">{userRole === "patient" ? "Available doctors" : "Available patients"}</h3>
          {usersList.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 pb-4">No {userRole === "patient" ? "doctors" : "patients"} available</p>
          ) : (
            <ul className="pb-3">
              {usersList.map((user) => (
                <li key={user._id}>
                  <button type="button" className={`w-full p-3 text-left hover:bg-green-100 ${String(selectedUser?._id || selectedUser?.id) === String(user._id) ? "bg-green-200 font-semibold" : ""}`} onClick={() => joinRoom(user)}>
                    <span className="block">{user.name}</span><span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <div className="bg-white shadow px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-green-700 text-center">{selectedUser ? `Chat with ${selectedUser.name}` : "Select a conversation or choose a user"}</h2>
        </div>
        <div className="flex-1 flex flex-col p-4 min-h-0">
          <div className="flex-1 overflow-y-auto bg-white rounded shadow p-4 mb-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div key={msg._id || `${msg.createdAt || "pending"}-${index}`}
                  className={`p-2 rounded-lg max-w-xs mb-2 ${String(msg.sender) === String(userId) ? "bg-green-100 ml-auto text-right" : "bg-gray-200"}`}>
                  {String(msg.sender) !== String(userId) && <p className="text-xs text-gray-600 font-semibold mb-1">{msg.senderName}</p>}
                  <p className="break-words">{msg.text}</p>
                  <time className="mt-1 block text-xs text-gray-500">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</time>
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </div>
          {selectedUser && (
            <form className="flex" onSubmit={(event) => { event.preventDefault(); handleSend(); }}>
              <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..."
                className="flex-1 min-w-0 border border-gray-300 rounded-l px-3 py-2" maxLength={5000} />
              <button type="submit" disabled={sending || !message.trim()} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 rounded-r">
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
