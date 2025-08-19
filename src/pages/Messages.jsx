import React, { useEffect, useRef, useState } from "react";
import { api_base_url } from "../helper";
import { FiUserPlus, FiCheck, FiX, FiSend, FiRefreshCw } from "react-icons/fi";
import { FaComments } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Messages = ({ userId }) => {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const loadContacts = async () => {
    const res = await fetch(`${api_base_url}/friends/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.success) setContacts(data.contacts);
  };
  const loadRequests = async () => {
    const res = await fetch(`${api_base_url}/friends/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.success)
      setRequests({ incoming: data.incoming, outgoing: data.outgoing });
  };
  const searchUsers = async () => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }
    // Backend /searchUsers expects GET with ?q=
    try {
      const res = await fetch(
        `${api_base_url}/searchUsers?q=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      if (data.success) setUsers(data.users.filter((u) => u._id !== userId));
    } catch (e) {
      /* silent */
    }
  };
  useEffect(() => {
    loadContacts();
    loadRequests();
  }, []);
  useEffect(() => {
    const t = setTimeout(searchUsers, 400);
    return () => clearTimeout(t);
  }, [search]);

  const openChat = async (otherUserId) => {
    const res = await fetch(`${api_base_url}/chat/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, friendId: otherUserId }),
    });
    const data = await res.json();
    if (data.success) {
      setSelected(otherUserId);
      setChat(data.chat);
    }
  };
  const sendMessage = async () => {
    if (!message.trim() || !chat) return;
    const local = {
      sender: userId,
      content: message,
      timestamp: new Date().toISOString(),
    };
    setChat((c) => ({ ...c, messages: [...(c.messages || []), local] }));
    const toSend = message;
    setMessage("");
    await fetch(`${api_base_url}/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: chat._id,
        senderId: userId,
        content: toSend,
      }),
    });
  };
  const act = async (requestId, action) => {
    await fetch(`${api_base_url}/friends/act`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action, userId }),
    });
    await loadContacts();
    await loadRequests();
  };
  const sendRequest = async (toId) => {
    await fetch(`${api_base_url}/friends/sendRequest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromId: userId, toId }),
    });
    setSearch("");
    setUsers([]);
    await loadRequests();
  };

  if (!userId) return <div className="p-4">Login required.</div>;

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages?.length]);

  return (
    <div className="w-full">
      <div className="fixed top-0 left-0 z-50 w-full">
        <Navbar />
      </div>
      <div className="h-[calc(100vh-100px)] md:h-[calc(100vh-100px)] flex text-white max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-dark-800/50 backdrop-blur mt-[15vh]">
        {/* Left Sidebar */}
        <div className="w-72 hidden md:flex flex-col border-r border-white/10 bg-dark-900/40">
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2 font-semibold text-indigo-300 text-sm">
              <FaComments /> Chats
            </div>
            <button
              onClick={() => {
                loadContacts();
                loadRequests();
              }}
              className="p-1 rounded hover:bg-dark-700/60 text-gray-400 hover:text-indigo-300"
            >
              <FiRefreshCw />
            </button>
          </div>
          <div className="p-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-dark-700/60 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>
          <div className="px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {contacts.map((c) => (
              <div
                key={c.userId}
                onClick={() => openChat(c.userId)}
                className={`p-2 rounded cursor-pointer text-sm flex items-center gap-3 hover:bg-dark-700/60 ${
                  selected === c.userId ? "bg-indigo-600/50 text-white" : ""
                }`}
              >
                {" "}
                <Avatar seed={c.userId} name={c.name} />{" "}
                <span className="truncate">{c.name || "User"}</span>
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="text-xs text-gray-500 p-2 italic">
                No contacts yet.
              </div>
            )}
          </div>
          <div className="mt-auto border-t border-white/10 p-3 space-y-4">
            <SectionTitle title="Incoming Requests" />
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {requests.incoming.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between bg-dark-700/50 px-2 py-1 rounded text-xs"
                >
                  <span className="truncate">
                    {r.from.username || r.from.name}
                  </span>
                  <div className="flex gap-1">
                    <IconBtn
                      onClick={() => act(r._id, "accept")}
                      color="green"
                      icon={<FiCheck />}
                    />
                    <IconBtn
                      onClick={() => act(r._id, "reject")}
                      color="red"
                      icon={<FiX />}
                    />
                  </div>
                </div>
              ))}
              {requests.incoming.length === 0 && (
                <div className="text-gray-500 text-[10px] italic">None</div>
              )}
            </div>
            <SectionTitle title="Search Results" />
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between bg-dark-700/40 px-2 py-1 rounded text-xs"
                >
                  <span className="truncate">{u.username || u.name}</span>
                  <button
                    onClick={() => sendRequest(u._id)}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded flex items-center gap-1"
                  >
                    <FiUserPlus className="text-sm" />
                    Add
                  </button>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-gray-500 text-[10px] italic">
                  Type to search users
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10 bg-dark-900/60 backdrop-blur sticky top-0">
            {selected ? (
              <Avatar
                seed={selected}
                name={contacts.find((c) => c.userId === selected)?.name}
              />
            ) : (
              <FaComments className="text-xl text-indigo-400" />
            )}
            <div className="font-medium text-sm">
              {selected
                ? contacts.find((c) => c.userId === selected)?.name || "Chat"
                : "Select a contact"}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
            {chat ? (
              (chat.messages || []).map((m, i) => (
                <MessageBubble
                  key={i}
                  isOwn={m.sender === userId}
                  text={m.content}
                />
              ))
            ) : (
              <div className="text-gray-500 text-sm flex flex-col items-center justify-center h-full opacity-70">
                <FaComments className="text-5xl mb-4 opacity-30" />
                <div>Select a contact to start chatting</div>
                <div className="text-xs mt-2 text-gray-600">
                  Or search and add a new friend.
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2 bg-dark-900/60 backdrop-blur">
            <input
              disabled={!chat}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={chat ? "Type a message" : "Open a chat to begin"}
              className={`flex-1 bg-dark-700/60 border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 ${
                !chat ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <button
              onClick={sendMessage}
              disabled={!chat || !message.trim()}
              className="px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-2"
            >
              <FiSend /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Small components
const Avatar = ({ seed, name }) => {
  const letter = (name || "?").trim()[0]?.toUpperCase() || "?";
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold shadow-inner">
      {letter}
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <div className="uppercase tracking-wide text-[10px] text-gray-500 font-semibold">
    {title}
  </div>
);

const IconBtn = ({ onClick, color, icon }) => (
  <button
    onClick={onClick}
    className={`w-6 h-6 flex items-center justify-center rounded bg-${color}-600 hover:bg-${color}-500 text-white text-xs`}
  >
    {icon}
  </button>
);

const MessageBubble = ({ isOwn, text }) => (
  <div
    className={`max-w-[70%] md:max-w-[55%] px-4 py-2 rounded-xl text-sm leading-relaxed shadow ${
      isOwn
        ? "ml-auto bg-indigo-600 text-white rounded-br-sm"
        : "bg-dark-700/70 text-gray-100 rounded-bl-sm border border-white/5"
    }`}
  >
    {text}
  </div>
);

export default Messages;
