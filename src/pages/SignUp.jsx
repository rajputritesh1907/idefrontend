import React, { useState } from 'react'
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import image from "../images/authPageSide.png";
import { api_base_url } from '../helper';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiUserCheck } from 'react-icons/fi';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
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
      const response = await fetch(api_base_url + "/signUp", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          username: username.trim(),
          name: name.trim(),
          email: email.trim(),
        password: pwd
      })
      });

      const data = await response.json();
      
      if (data.success === true) {
        alert("Account created successfully");
        navigate("/login"); 
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
        {/* Left side - Sign Up Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="glass p-8 lg:p-12 rounded-3xl max-w-md mx-auto">
            {/* Logo */}
            <div className="text-center mb-8">
              <img className='w-32 h-auto mx-auto mb-6' src={logo} alt="Logo" />
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-dark-300">Join our coding community and start building amazing projects</p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={submitForm} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-200">Username</label>
                <div className="inputBox">
                  <FiUser className="text-dark-400 ml-4 text-lg" />
                  <input 
                    required 
                    onChange={(e) => setUsername(e.target.value)} 
                    value={username} 
                    type="text" 
                    placeholder='Enter your username'
                    className="ml-3"
                  />
                </div>
              </div>

              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-200">Full Name</label>
            <div className="inputBox">
                  <FiUserCheck className="text-dark-400 ml-4 text-lg" />
                  <input 
                    required 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    type="text" 
                    placeholder='Enter your full name'
                    className="ml-3"
                  />
                </div>
            </div>

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
                    placeholder='Create a strong password'
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

              {/* Sign Up Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="btnBlue w-full h-12 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className='text-dark-300'>
                  Already have an account?{' '}
                  <Link to="/login" className='text-primary-400 hover:text-primary-300 font-medium transition-colors'>
                    Sign In
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
                <h2 className="text-4xl font-bold mb-4">Join the Community</h2>
                <p className="text-lg text-dark-200">Start your coding journey today</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default SignUp