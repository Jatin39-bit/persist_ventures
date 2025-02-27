"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaUserPlus, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import cookies from 'js-cookie'

export default function SignupPage() {
  const router = useRouter();
  const { setLoggedIn, setUserr } = useUser();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password) => {
    let score = 0;
    
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    setPasswordStrength(score);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setUser({ ...user, password: newPassword });
    checkPasswordStrength(newPassword);
  };

  async function signup(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post("/api/user/signup", user);
      if (response.status === 200) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        cookies.set("token", response.data.token, { expires: 1 });
        setLoggedIn(true);
        if (response.data.user) {
          setUserr(response.data.newUser);
        }
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      cookies.remove("token")
      setLoggedIn(false);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50 to-purple-50"}`}>
      <motion.div 
        className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} p-8 rounded-xl shadow-xl w-full max-w-md`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-500 mb-4"
          >
            <FaUserPlus size={24} />
          </motion.div>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Join MemeVerse
          </h2>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Create an account to start sharing memes
          </p>
        </div>

        <form onSubmit={(e) => signup(e)} className="space-y-5">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              htmlFor="name"
            >
              <div className="flex items-center gap-2">
                <FaUser size={14} />
                <span>Name</span>
              </div>
            </label>
            <input
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              value={user.name}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              htmlFor="email"
            >
              <div className="flex items-center gap-2">
                <FaEnvelope size={14} />
                <span>Email</span>
              </div>
            </label>
            <input
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              value={user.email}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              htmlFor="password"
            >
              <div className="flex items-center gap-2">
                <FaLock size={14} />
                <span>Password</span>
              </div>
            </label>
            <input
              onChange={handlePasswordChange}
              value={user.password}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              type="password"
              id="password"
              name="password"
              placeholder="Create a secure password"
              required
            />
            
            {user.password && (
              <div className="mt-2">
                <div className="flex h-1 mt-2 overflow-hidden rounded bg-gray-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength * 20}%` }}
                    className={`
                      ${passwordStrength <= 1 ? 'bg-red-500' : ''}
                      ${passwordStrength > 1 && passwordStrength <= 3 ? 'bg-yellow-500' : ''}
                      ${passwordStrength > 3 ? 'bg-green-500' : ''}
                    `}
                  />
                </div>
                <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {passwordStrength <= 1 && "Weak password"}
                  {passwordStrength > 1 && passwordStrength <= 3 && "Moderate password"}
                  {passwordStrength > 3 && "Strong password"}
                </p>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
              isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Sign Up"
            )}
          </motion.button>

          <div className="text-center mt-6">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
