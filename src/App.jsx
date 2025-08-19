import React, {useState} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Editior from './pages/Editior';
// import GeminiChat from './pages/GeminiChat';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Messages from './pages/Messages';
// Theme system removed
import ChatWindow from './components/ChatWindow';
import { FaRobot } from 'react-icons/fa';

const NeonBlobsBackground = () => (
  <div className="neon-bg-blobs pointer-events-none fixed inset-0 -z-10 w-full h-full overflow-hidden">
    {/* Main gradient background is handled by App.css, this adds blobs and stars */}
    {/* Neon Blob 1 */}
    <svg className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] opacity-70 animate-float-slow" viewBox="0 0 600 600" fill="none">
      <defs>
        <radialGradient id="blob1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientTransform="rotate(45)">
          <stop offset="0%" stopColor="#a21caf" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <ellipse cx="300" cy="300" rx="280" ry="220" fill="url(#blob1)" />
    </svg>
    {/* Neon Blob 2 */}
    <svg className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] opacity-60 animate-float-slower" viewBox="0 0 700 700" fill="none">
      <defs>
        <radialGradient id="blob2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientTransform="rotate(-30)">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d946ef" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <ellipse cx="350" cy="350" rx="300" ry="250" fill="url(#blob2)" />
    </svg>
    {/* Subtle stars/particles */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" fill="none">
      <g>
        {[...Array(60)].map((_, i) => (
          <circle key={i} cx={Math.random()*1920} cy={Math.random()*1080} r={Math.random()*1.5+0.5} fill="#fff" opacity={Math.random()*0.3+0.1} />
        ))}
      </g>
    </svg>
  </div>
);

const App = () => {
  let isLoggedIn = localStorage.getItem("isLoggedIn");
  const [showBot, setShowBot] = useState(false);
  return (
    <>
      <NeonBlobsBackground />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login"/>} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/editior/:projectID' element={isLoggedIn ? <Editior /> : <Navigate to="/login"/>} />
          <Route path='/profile' element={isLoggedIn ? <Profile userId={localStorage.getItem('userId')} /> : <Navigate to="/login"/>} />
          <Route path='/community' element={isLoggedIn ? <Community userId={localStorage.getItem('userId')} /> : <Navigate to="/login"/>} />
          <Route path='/messages' element={isLoggedIn ? <Messages userId={localStorage.getItem('userId')} /> : <Navigate to="/login"/>} />
          {/* <Route path='/chatbot' element={isLoggedIn ? <GeminiChat currentUser={localStorage.getItem('userId') || 'You'} /> : <Navigate to="/login"/>} /> */}
          <Route path="*" element={isLoggedIn ? <NoPage />: <Navigate to="/login"/>} />
        </Routes>
      </BrowserRouter>
      {/* Gemini Chatbot Floating Button */}
      {isLoggedIn && !showBot && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          onClick={() => setShowBot(true)}
          title="Open Gemini Chatbot"
        >
          <FaRobot className="text-2xl" />
        </button>
      )}
      {showBot && (
        <ChatWindow
          chat={null}
          currentUser={localStorage.getItem('userId') || 'You'}
          onClose={() => setShowBot(false)}
          isGeminiBot={true}
        />
      )}
    </>
  )
}

export default App