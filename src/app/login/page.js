"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from 'sonner';
import { useUser } from '../context/AuthContext';
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import cookies from 'js-cookie'

export default function Login() {
  const router = useRouter();
  const { setUserr, setLoggedIn } = useUser();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  async function login(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post("/api/user/login", user);
      if (response.status === 200) {
        toast.success("Login Successful");
        localStorage.setItem("token", response.data.token);
        cookies.set("token", response.data.token, { expires: 1 });
        setLoggedIn(true);
        if (response.data.user) {
          setUserr(response.data.user);
        }
        router.push(`/`);
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      cookies.remove('token')
      setLoggedIn(false);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
      setUser({ email: "", password: "" });
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
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-500 mb-4"
          >
            <FaSignInAlt size={24} />
          </motion.div>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Welcome Back!
          </h2>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Login to access your MemeVerse account
          </p>
        </div>

        <form onSubmit={(e) => login(e)} className="space-y-5">
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
            <div className="flex justify-between items-center mb-2">
              <label
                className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                htmlFor="password"
              >
                <div className="flex items-center gap-2">
                  <FaLock size={14} />
                  <span>Password</span>
                </div>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
            <input
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              value={user.password}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
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
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </motion.button>
          
          <div className="mt-6 text-center">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
