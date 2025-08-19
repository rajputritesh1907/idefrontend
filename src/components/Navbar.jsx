import React, { useEffect, useState } from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { BsGridFill, BsList } from "react-icons/bs";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMessageCircle,
} from "react-icons/fi";
import { api_base_url } from "../helper"; 
import { FaRobot } from "react-icons/fa";

const Navbar = ({ isGridLayout, setIsGridLayout }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Theme UI removed
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
  const [isGeminiBotOpen, setIsGeminiBotOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [profile, setProfile] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    // fetch user details
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: uid }),
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d.user);
        else setError(d.message);
      });
    // fetch profile (for profilePicture)
    fetch(api_base_url + "/getProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: uid }),
    })
      .then((r) => r.json())
      .then((p) => {
        if (p.success) setProfile(p.profile);
      });
  }, []);

  // Theme shortcuts removed

  // Start chat handler
  const handleStartChat = async (user) => {
    setIsChatSearchOpen(false);
    const res = await fetch(api_base_url + "/chat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId, friendId: user._id }),
    });
    const data = await res.json();
    if (data.success) setActiveChat(data.chat);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  const toggleLayout = () => {
    setIsGridLayout(!isGridLayout);
  };

  return (
    <nav className="navbar sticky top-0 z-50 px-6 lg:px-12 h-20 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        {/* <img className='w-32 h-auto cursor-pointer transition-transform hover:scale-105' src={logo} alt="Logo" /> */}
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link className="flex items-center space-x-2 text-dark-200 hover:text-white transition-colors duration-200" to="/">
          <FiHome className="text-lg" />
          <span>Home</span>
        </Link>
        {/* <Link className="text-dark-200 hover:text-white transition-colors duration-200">About</Link> */}
        <Link className="text-dark-200 hover:text-white transition-colors duration-200">
          Contact
        </Link>
        <Link className="text-dark-200 hover:text-white transition-colors duration-200">
          Services
        </Link>
        <Link
          to="/community"
          className="text-dark-200 hover:text-white transition-colors duration-200"
        >
          Community
        </Link>
        <Link
          to="/messages"
          className="text-dark-200 hover:text-white transition-colors duration-200"
        >
          Messages
        </Link>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Layout Toggle */}
        <button
          onClick={toggleLayout}
          className="p-2 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 transition-colors duration-200 text-dark-200 hover:text-white"
          title={isGridLayout ? "Switch to List View" : "Switch to Grid View"}
        >
          {isGridLayout ? (
            <BsList className="text-lg" />
          ) : (
            <BsGridFill className="text-lg" />
          )}
        </button>

        {/* Theme controls removed */}

        {/* Chat Button */}
        {/* <button
          onClick={() => setIsChatSearchOpen(true)}
          className="p-2 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 transition-colors duration-200 text-dark-200 hover:text-white"
          title="Chat with Friend"
        >
          <FiMessageCircle className="text-lg" />
        </button> */}
        {/* Gemini Bot Button */}
        {/* <button
          onClick={() => setIsGeminiBotOpen(true)}
          className="p-2 rounded-lg bg-dark-700/50 hover:bg-primary-500 transition-colors duration-200 text-dark-200 hover:text-white"
          title="Gemini Chatbot"
        >
          <FaRobot className="text-lg" />
        </button> */}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="btnBlue !bg-red-500 hover:!bg-red-600 min-w-[100px] h-10 text-sm font-medium"
        >
          Logout
        </button>

        {/* User Avatar */}
        <div className="relative">
          <Avatar
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            name={data ? data.name : ""}
            size="40"
            round="50%"
            src={profile?.profilePicture || undefined}
            className="cursor-pointer transition-transform hover:scale-110 border-2 border-dark-600 hover:border-primary-500"
          />

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 w-64 glass rounded-xl shadow-2xl border border-dark-600/20 overflow-hidden animate-slide-down">
              {/* User Info */}
              <div className="p-4 border-b border-dark-600/20">
                <div className="flex items-center space-x-3">
                  <Avatar
                    name={data ? data.name : ""}
                    size="40"
                    round="50%"
                    src={profile?.profilePicture || undefined}
                  />
                  <div>
                    <h3 className="text-white font-semibold">
                      {data ? data.name : "User"}
                    </h3>
                    <p className="text-dark-300 text-sm">
                      {data ? data.email : "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-dark-200 hover:text-white hover:bg-dark-700/50 transition-colors duration-200"
                >
                  <FiUser className="text-lg" />
                  <span>Profile</span>
                </button>

                {/* <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-dark-200 hover:text-white hover:bg-dark-700/50 transition-colors duration-200">
                  <FiSettings className="text-lg" />
                  <span>Settings</span>
                </button> */}

                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                >
                  <FiLogOut className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2 rounded-lg bg-dark-700/50 hover:bg-dark-600/50 transition-colors duration-200 text-dark-200 hover:text-white">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Theme modals removed */}

      {/* Chat Search Modal */}
      {/* <ChatSearchModal
        isOpen={isChatSearchOpen}
        onClose={() => setIsChatSearchOpen(false)}
        onStartChat={handleStartChat}
      /> */}
      {/* Chat Window */}
      {activeChat && (
        <ChatWindow
          chat={activeChat}
          currentUser={currentUserId}
          onClose={() => setActiveChat(null)}
        />
      )}
      {/* Gemini Chatbot Window */}
      {isGeminiBotOpen && (
        <ChatWindow
          chat={null}
          currentUser={currentUserId || "You"}
          onClose={() => setIsGeminiBotOpen(false)}
          isGeminiBot={true}
        />
      )}
    </nav>
  );
};

export default Navbar;
