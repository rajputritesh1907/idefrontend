import React, { useEffect, useRef, useState } from 'react';
import { MdClose, MdSend } from 'react-icons/md';
import { api_base_url } from '../helper';

const GEMINI_CHAT_KEY = 'AIzaSyC3jNobx2uiRxsQgbw978_5Pk9F1Tt-kZc';

const ChatWindow = ({ chat, currentUser, onClose, isGeminiBot }) => {
  const [messages, setMessages] = useState(chat?.messages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [botMode, setBotMode] = useState(isGeminiBot || false);

  // Load Gemini chat history from localStorage
  useEffect(() => {
    if (botMode) {
      const saved = localStorage.getItem(GEMINI_CHAT_KEY);
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } else if (chat?.messages) {
      setMessages(chat.messages);
    }
  }, [botMode, chat]);

  // Save Gemini chat history to localStorage
  useEffect(() => {
    if (botMode) {
      localStorage.setItem(GEMINI_CHAT_KEY, JSON.stringify(messages));
    }
  }, [messages, botMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    if (botMode) {
      // Gemini bot mode
      setMessages((prev) => {
        const updated = [...prev, { sender: currentUser, content: input, isUser: true }];
        localStorage.setItem(GEMINI_CHAT_KEY, JSON.stringify(updated));
        return updated;
      });
      try {
        const res = await fetch(`${api_base_url}/chatbot/gemini`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input.trim() })
        });
        const data = await res.json();
        setMessages((prev) => {
          const updated = [...prev, { sender: 'Gemini Bot', content: data.success ? data.response : 'Sorry, I could not process your request.', isBot: true }];
          localStorage.setItem(GEMINI_CHAT_KEY, JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        setMessages((prev) => {
          const updated = [...prev, { sender: 'Gemini Bot', content: 'Error connecting to Gemini API.' }];
          localStorage.setItem(GEMINI_CHAT_KEY, JSON.stringify(updated));
          return updated;
        });
      }
      setInput('');
      setLoading(false);
      return;
    }
    // User chat mode
    if (chat && chat._id) {
      await fetch(`${api_base_url}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: chat._id,
          senderId: currentUser,
          content: input.trim(),
        })
      });
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-dark-800/95 border border-dark-600/50 rounded-2xl shadow-2xl flex flex-col h-[500px]">
      <div className="flex items-center justify-between p-4 border-b border-dark-600/50">
        <div className="font-bold text-lg">{botMode ? 'Gemini Chatbot' : 'Chat'}</div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setBotMode((b) => !b)} className="px-2 py-1 text-xs rounded bg-dark-600 text-white hover:bg-primary-500 transition">{botMode ? 'User Chat' : 'Gemini Bot'}</button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark-700/50 transition-colors duration-200">
            <MdClose className="text-xl" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-dark-700">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === currentUser || msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === currentUser || msg.isUser ? 'bg-primary-500 text-white' : msg.isBot ? 'bg-green-700 text-white' : 'bg-dark-600 text-white'}`}>
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs text-dark-300 mt-1 text-right">{msg.sender}</div>
            </div>
          </div>
        ))}
        {loading && <div className="text-center text-xs text-dark-300">Loading...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex p-4 border-t border-dark-600/50 gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg bg-dark-700 text-white border border-dark-600 focus:outline-none"
          placeholder={botMode ? "Ask Gemini anything..." : "Type a message..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium" disabled={loading}>
          <MdSend className="text-lg" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;