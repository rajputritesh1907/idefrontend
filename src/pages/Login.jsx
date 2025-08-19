import React, { useState } from 'react'
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import image from "../images/authPageSide.png";
import { api_base_url } from '../helper';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(api_base_url + "/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: pwd
      })
      });

      const data = await response.json();
      
      if (data.success === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userId", data.userId);
        // Cache minimal user object for profile header usage
        try {
          localStorage.setItem("user", JSON.stringify({ userId: data.userId }));
        } catch {}
        setTimeout(() => {
          window.location.href = "/"
        }, 200);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl flex items-center justify-center">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="glass p-8 lg:p-12 rounded-3xl max-w-md mx-auto">
            {/* Logo */}
            <div className="text-center mb-8">
              <img className='w-32 h-auto mx-auto mb-6' src={logo} alt="Logo" />
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-dark-300">Sign in to your account to continue coding</p>
            </div>

            {/* Login Form */}
            <form onSubmit={submitForm} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-200">Email Address</label>
                <div className="inputBox">
                  <FiMail className="text-dark-400 ml-4 text-lg" />
                  <input 
                    required 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    type="email" 
                    placeholder='Enter your email'
                    className="ml-3"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-200">Password</label>
            <div className="inputBox">
                  <FiLock className="text-dark-400 ml-4 text-lg" />
                  <input 
                    required 
                    onChange={(e) => setPwd(e.target.value)} 
                    value={pwd} 
                    type={showPassword ? "text" : "password"} 
                    placeholder='Enter your password'
                    className="ml-3 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-4 text-dark-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
            </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className='text-red-400 text-sm'>{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="btnBlue w-full h-12 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className='text-dark-300'>
                  Don't have an account?{' '}
                  <Link to="/signUp" className='text-primary-400 hover:text-primary-300 font-medium transition-colors'>
                    Sign Up
                  </Link>
                </p>
              </div>
          </form>
        </div>
        </div>

        {/* Right side - Image */}
        {/* <div className="hidden lg:block w-1/2 p-8">
          <div className="relative h-full flex items-center justify-center">
            <div className="glass rounded-3xl overflow-hidden">
              <img 
                className='h-[600px] w-full object-cover' 
                src={image} 
                alt="Coding illustration" 
              />
            </div> 
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Code. Create. Innovate.</h2>
                <p className="text-lg text-dark-200">Your online development environment</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Login