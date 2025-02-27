"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import { FaHeart, FaCrown, FaTrophy, FaMedal, FaComment } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { SyncLoader } from "react-spinners";
import Image from "next/image";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);
  const [topUsers, setTopUsers] = useState([
    {
      "id": 1,
      "name": "Arya",
      "totalMemes": 450,
      "joinDate": "2024-03-01T12:00:00Z",
      "totalLikes": 5678
    },
    {
      "id": 2,
      "name": "Aarohi",
      "totalMemes": 789,
      "joinDate": "2024-03-02T13:00:00Z",
      "totalLikes": 8901
    },
    {
      "id": 3,
      "name": "Aarosha",
      "totalMemes": 1011,
      "joinDate": "2024-03-03T14:00:00Z",
      "totalLikes": 2345
    },
    {
      "id": 4,
      "name": "Aashish",
      "totalMemes": 234,
      "joinDate": "2024-03-04T15:00:00Z",
      "totalLikes": 6789
    },
    {
      "id": 5,
      "name": "Aarohi",
      "totalMemes": 567,
      "joinDate": "2024-03-05T16:00:00Z",
      "totalLikes": 8901
    },
    {
      "id": 6,
      "name": "Aarosha",
      "totalMemes": 890,
      "joinDate": "2024-03-06T17:00:00Z",
      "totalLikes": 1234
    },
    {
      "id": 7,
      "name": "Aash",
      "totalMemes": 1011,
      "joinDate": "2024-03-07T18:00:00Z",
      "totalLikes": 5678
    },
    {
      "id": 8,
      "name": "Arya",
      "totalMemes": 234,
      "joinDate": "2024-03-08T19:00:00Z",
      "totalLikes": 8901
    },
    {
      "id": 9,
      "name": "Aarohi",
      "totalMemes": 567,
      "joinDate": "2024-03-09T20:00:00Z",
      "totalLikes": 2345
    },
    {
      "id": 10,
      "name": "Aarosha",
      "totalMemes": 890,
      "joinDate": "2024-03-10T21:00:00Z",
      "totalLikes": 6789}]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("memes");
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/leaderboard");
        setTopMemes(res.data.topMemes || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch leaderboard data:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaCrown className="text-yellow-400 text-2xl mr-2" />;
      case 1:
        return <FaTrophy className="text-gray-300 text-xl mr-2" />;
      case 2:
        return <FaMedal className="text-amber-600 text-xl mr-2" />;
      default:
        return null;
    }
  };

  const containerClass = darkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-100 text-gray-900";
    
  const cardClass = darkMode 
    ? "bg-gray-800 hover:bg-gray-700" 
    : "bg-white hover:bg-gray-50 shadow-md";

  return (
    <div className={`min-h-screen ${containerClass}`}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-10 px-4">
        <motion.h1 
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🏆 Meme Leaderboard 🏆
        </motion.h1>
        
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-gray-800 rounded-lg">
            <button
              onClick={() => setActiveTab("memes")}
              className={`px-4 py-2 rounded-md transition ${
                activeTab === "memes" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🔥 Top Memes
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md transition ${
                activeTab === "users" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              👑 Top Users
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <SyncLoader color="#36D7B7" />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-700">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "memes" ? (
              <motion.div
                key="memes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
                  🔥 Top Trending Memes
                </h2>
                <div className="space-y-4">
                  {topMemes.slice(0, 10).map((meme, index) => (
                    <motion.div 
                      key={meme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex items-center ${cardClass} p-4 rounded-lg transition`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full mr-3">
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden mr-4">
                        <img
                        loading='lazy'
                          src={meme.url}
                          alt={meme.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{meme.name}</h3>
                        <p className="text-gray-400 text-sm">{meme.uploader}</p>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                        <FaHeart className="text-red-500" />
                        <span>{meme.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 mx-2 bg-gray-700 px-3 py-1 rounded-full">
                        <FaComment className="text-blue-500" />
                        <span>{meme.comments.toLocaleString()}</span>
                      </div>

                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
                  👑 Top Users by Engagement
                </h2>
                <div className="space-y-4">
                  {topUsers.slice(0, 10).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex items-center ${cardClass} p-4 rounded-lg transition`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full mr-3">
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>
                      {getRankIcon(index)}
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        <div className="flex text-gray-400 text-sm">
                          <span className="mr-4">{user.totalMemes} memes</span>
                          <span>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                        <FaHeart className="text-red-500" />
                        <span>{user.totalLikes.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
