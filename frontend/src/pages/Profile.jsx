

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Edit, Heart, Clock, User } from "lucide-react";
import { FaComment } from "react-icons/fa";
import { useUser } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../assets/image1.png";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("uploaded");
  const [uploadedMemes, setUploadedMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);
  const { userr, setUserr, loggedIn } = useUser();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const { darkMode } = useTheme();
  const navigate=useNavigate();

  async function getProfile() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 200) {
        setUserr(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
    }
  }

  async function handleProfileEdit(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        { name, bio },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        getProfile();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  }

  async function getLikedMemes() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/liked`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 200) setLikedMemes(response.data.memes);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch liked memes");
    }
  }

  async function getUploadedMemes() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/memes/uploaded`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 200) setUploadedMemes(response.data.memes);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch uploaded memes");
    }
  }

  const handleLike = async (memeId) => {
    if (!loggedIn) {
      toast.warn("Please login to unlike. Redirecting to login page...");
      setTimeout(() => window.location.href = "/login", 2000);
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/memes/${memeId}/unlike`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      getLikedMemes();
    } catch (err) {
      console.error("Error updating like status:", err);
      toast.error("Failed to unlike meme");
    }
  };

  useEffect(() => {
    if (userr) {
      setName(userr.name || "");
      setBio(userr.bio || "");
    }
    getUploadedMemes();
    getLikedMemes();
  }, [userr]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"} font-poppins`}>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
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
        <div className={`absolute inset-0 h-full bg-black ${darkMode ? "opacity-70" : "opacity-30"}`}></div>
      </div>

      <div className="relative z-10 pt-12 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:pl- xl:pl-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-xl ${darkMode ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50" : "bg-white/80 shadow-xl border border-gray-200"}`}
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    loading="lazy"
                    src={userr?.avatar || "https://picsum.photos/200"}
                    alt={userr?.name}
                    className={`w-32 h-32 rounded-full object-cover border-4 ${darkMode ? "border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "border-indigo-600"}`}
                  />
                </motion.div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className={`text-2xl sm:text-3xl font-fredoka capitalize ${darkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500" : "text-gray-800"}`}>
                    {userr?.name || "Anonymous"}
                  </h1>
                  <p className={`mt-2 text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{userr?.bio || "No bio yet"}</p>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: darkMode ? "0 0 15px rgba(59, 130, 246, 0.5)" : "0 0 15px rgba(99, 102, 241, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("edit")}
                    className={`mt-4 px-4 py-2 rounded-lg text-white font-medium ${darkMode ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  >
                    Edit Profile
                  </motion.button>
                </div>
              </div>
            </div>

            <div className={`border-t ${darkMode ? "border-gray-700/50" : "border-gray-200"}`}>
              <div className="flex justify-center">
                {["uploaded", "liked", "edit"].map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 font-medium text-center ${activeTab === tab ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white" : darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} ${darkMode && activeTab === tab ? "shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""}`}
                  >
                    {tab === "uploaded" ? "My Uploaded Memes" : tab === "liked" ? "Liked Memes" : "Edit Profile"}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === "uploaded" && (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl sm:text-2xl font-fredoka mb-6 text-white">My Uploaded Memes</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploadedMemes.map((meme, index) => (
                      <motion.div
                        key={meme._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: index * 0.05 }}
                        className={`rounded-lg overflow-hidden ${darkMode ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50" : "bg-white shadow-md border border-gray-200"}`}
                        whileHover={{ scale: 1.02 }}
                        onClick={()=>navigate(`/meme/${meme._id}`)}
                      >
                        <img src={meme.url} alt={meme.name} className="w-full h-64 object-cover" loading="lazy" />
                        <div className="p-4">
                          <h3 className="font-fredoka text-lg mb-2">{meme.name}</h3>
                          <div className={`flex justify-between items-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(meme.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                  </div>
                </motion.div>
              )}

              {activeTab === "liked" && (
                <motion.div
                  key="liked"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl sm:text-2xl font-fredoka mb-6 text-white">Memes You've Liked</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedMemes.map((meme, index) => (
                      <motion.div
                        key={meme._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: index * 0.05 }}
                        className={`rounded-lg overflow-hidden ${darkMode ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50" : "bg-white shadow-md border border-gray-200"}`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <img onClick={()=>navigate(`/meme/${meme._id}`)} src={meme.url} alt={meme.name} className="w-full h-64 object-cover" loading="lazy" />
                        <div className="p-4">
                          <h3 className="font-fredoka text-lg mb-2">{meme.name}</h3>
                          <div className={`flex justify-between items-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              Anonymous
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(meme.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className={`flex justify-between ${darkMode ? "border-gray-700/50" : "border-gray-200"} border-t pt-3`}>
                            <button onClick={() => handleLike(meme._id)} className="flex items-center text-red-500">
                              <Heart className="h-5 w-5 mr-1 fill-current" />
                              {meme.likes}
                            </button>
                            <div className="flex items-center text-blue-500">
                              <FaComment className="h-5 w-5 mr-1" />
                              {meme.comments || 0}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "edit" && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg p-6 ${darkMode ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50" : "bg-white shadow-md border border-gray-200"}`}
                >
                  <h2 className="text-xl sm:text-2xl font-fredoka mb-6">Edit Profile Information</h2>
                  <form onSubmit={handleProfileEdit} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex flex-col items-center">
                        <motion.img
                          src={userr?.avatar || "https://picsum.photos/200"}
                          alt={userr?.name}
                          loading="lazy"
                          className={`w-40 h-40 rounded-full object-cover ${darkMode ? "border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "border-indigo-600"} border-4 mb-4`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <div>
                          <label htmlFor="username" className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
                            <User size={16} />
                            Name
                          </label>
                          <motion.input
                            type="text"
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700/30 backdrop-blur-md border border-gray-600 text-gray-200 placeholder-gray-400" : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"}`}
                            whileFocus={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                          />
                        </div>
                        <div>
                          <label htmlFor="bio" className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
                            <Edit size={16} />
                            Bio
                          </label>
                          <motion.textarea
                            id="bio"
                            rows="4"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700/30 backdrop-blur-md border border-gray-600 text-gray-200 placeholder-gray-400" : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"}`}
                            whileFocus={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                          />
                        </div>
                        <div className="flex justify-end space-x-4">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg ${darkMode ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-300 hover:bg-gray-100 text-gray-700"} border`}
                            onClick={() => setActiveTab("uploaded")}
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05, boxShadow: darkMode ? "0 0 15px rgba(59, 130, 246, 0.5)" : "0 0 15px rgba(99, 102, 241, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg text-white font-medium ${darkMode ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                          >
                            Save Changes
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-fredoka {
          font-family: "Fredoka One", cursive;
        }
        @media (max-width: 640px) {
          .grid-cols-1.sm\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
