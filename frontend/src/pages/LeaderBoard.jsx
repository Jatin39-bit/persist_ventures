

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Heart, MessageCircle, Trophy, Award, Medal } from "lucide-react";
import { FaLaughSquint } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import bgImage from "../assets/image1.png";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);
  const [topUsers, setTopUsers] = useState([
    {
      id: 1,
      name: "Arya",
      totalMemes: 450,
      joinDate: "2024-03-01T12:00:00Z",
      totalLikes: 5678,
    },
    {
      id: 2,
      name: "Aarohi",
      totalMemes: 789,
      joinDate: "2024-03-02T13:00:00Z",
      totalLikes: 8901,
    },
    {
      id: 3,
      name: "Aarosha",
      totalMemes: 1011,
      joinDate: "2024-03-03T14:00:00Z",
      totalLikes: 2345,
    },
    {
      id: 4,
      name: "Aashish",
      totalMemes: 234,
      joinDate: "2024-03-04T15:00:00Z",
      totalLikes: 6789,
    },
    {
      id: 5,
      name: "Aarohi",
      totalMemes: 567,
      joinDate: "2024-03-05T16:00:00Z",
      totalLikes: 8901,
    },
    {
      id: 6,
      name: "Aarosha",
      totalMemes: 890,
      joinDate: "2024-03-06T17:00:00Z",
      totalLikes: 1234,
    },
    {
      id: 7,
      name: "Aash",
      totalMemes: 1011,
      joinDate: "2024-03-07T18:00:00Z",
      totalLikes: 5678,
    },
    {
      id: 8,
      name: "Arya",
      totalMemes: 234,
      joinDate: "2024-03-08T19:00:00Z",
      totalLikes: 8901,
    },
    {
      id: 9,
      name: "Aarohi",
      totalMemes: 567,
      joinDate: "2024-03-09T20:00:00Z",
      totalLikes: 2345,
    },
    {
      id: 10,
      name: "Aarosha",
      totalMemes: 890,
      joinDate: "2024-03-10T21:00:00Z",
      totalLikes: 6789,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("memes");
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/memes/leaderboard`
        );
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
        return (
          <Trophy className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        );
      case 1:
        return <Award className="text-gray-300 w-5 h-5 sm:w-6 sm:h-6 mr-2" />;
      case 2:
        return <Medal className="text-amber-600 w-5 h-5 sm:w-6 sm:h-6 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      } font-poppins`}
    >
      <Navbar />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: 0,
        }}
      >
        <div
          className={`absolute inset-0 h-full bg-black ${
            darkMode ? "opacity-70" : "opacity-30"
          }`}
        ></div>
      </div>

      <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 md:pl-18 xl:pl-0 relative z-10">
        <motion.h1
          className={`text-3xl sm:text-4xl md:text-5xl font-fredoka text-center mb-6 sm:mb-8 ${
            darkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
              : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          MemeVerse Leaderboard
        </motion.h1>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div
            className={`flex flex-wrap justify-center gap-2 p-1 rounded-lg ${
              darkMode
                ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50"
                : "bg-white/80 shadow-md border border-gray-200"
            }`}
          >
            <motion.button
              onClick={() => setActiveTab("memes")}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md font-semibold text-sm sm:text-base transition-all ${
                activeTab === "memes"
                  ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                  : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } ${
                darkMode && activeTab === "memes"
                  ? "shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : ""
              }`}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              🔥 Top Memes
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("users")}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md font-semibold text-sm sm:text-base transition-all ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                  : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } ${
                darkMode && activeTab === "users"
                  ? "shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : ""
              }`}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              👑 Top Users
            </motion.button>
          </div>
        </div>

        {loading ? (
          <motion.div
            className="flex justify-center items-center h-64"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <FaLaughSquint size={48} className="text-yellow-400" />
          </motion.div>
        ) : error ? (
          <div className="text-center p-6 bg-red-900/20 rounded-lg border border-red-700">
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
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
                <h2 className="text-xl sm:text-2xl font-fredoka mb-4 sm:mb-6 border-b text-white border-gray-700/50 pb-2">
                  🔥 Top Trending Memes
                </h2>
                <div className="space-y-3 sm:space-y-4 mb-12">
                  {topMemes.slice(0, 10).map((meme, index) => (
                    <motion.div
                      key={meme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: index * 0.05,
                      }}
                      className={`flex flex-col sm:flex-row items-center ${
                        darkMode
                          ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50"
                          : "bg-white shadow-md border border-gray-200"
                      } p-3 sm:p-4 rounded-lg transition ${
                        index < 3 && darkMode
                          ? "border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          : ""
                      }`}
                      whileHover={{
                        scale: 1.02,
                        ...(index < 3 ? { y: -5 } : {}),
                      }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full mr-0 sm:mr-3 mb-2 sm:mb-0">
                        <span className="text-base sm:text-lg font-bold">
                          {index + 1}
                        </span>
                      </div>
                      {getRankIcon(index)}
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden mr-0 sm:mr-4 mb-2 sm:mb-0">
                        <img
                          loading="lazy"
                          src={meme.url}
                          alt={meme.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-fredoka text-sm sm:text-base md:text-lg truncate">
                          {meme.name}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {meme.uploader}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                        <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded-full">
                          <Heart className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm">
                            {meme.likes.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded-full">
                          <MessageCircle className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm">
                            {meme.comments.toLocaleString()}
                          </span>
                        </div>
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
                <h2 className="text-xl sm:text-2xl font-fredoka mb-4 sm:mb-6 border-b border-gray-700/50 pb-2">
                  👑 Top Users by Engagement
                </h2>
                <div className="space-y-3 sm:space-y-4 mb-12">
                  {topUsers.slice(0, 10).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: index * 0.05,
                      }}
                      className={`flex flex-col sm:flex-row items-center ${
                        darkMode
                          ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50"
                          : "bg-white shadow-md border border-gray-200"
                      } p-3 sm:p-4 rounded-lg transition ${
                        index < 3 && darkMode
                          ? "border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          : ""
                      }`}
                      whileHover={{
                        scale: 1.02,
                        ...(index < 3 ? { y: -5 } : {}),
                      }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full mr-0 sm:mr-3 mb-2 sm:mb-0">
                        <span className="text-base sm:text-lg font-bold">
                          {index + 1}
                        </span>
                      </div>
                      {getRankIcon(index)}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-fredoka text-sm sm:text-base md:text-lg truncate">
                          {user.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row text-gray-400 text-xs sm:text-sm">
                          <span className="sm:mr-4 mb-1 sm:mb-0">
                            {user.totalMemes} memes
                          </span>
                          <span>
                            {user.joinDate
                              ? new Date(user.joinDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded-full mt-2 sm:mt-0">
                        <Heart className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm">
                          {user.totalLikes.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <style jsx>{`
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-fredoka {
          font-family: "Fredoka One", cursive;
        }
        @media (max-width: 640px) {
          .flex-col.sm\\:flex-row {
            flex-direction: column;
            align-items: center;
          }
          .text-center.sm\\:text-left {
            text-align: center;
          }
          .mt-2.sm\\:mt-0 {
            margin-top: 0.5rem;
          }
          .mb-2.sm\\:mb-0 {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
