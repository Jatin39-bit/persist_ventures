
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShareAlt,
  FaArrowLeft,
  FaUser,
  FaClock,
  FaLaughSquint,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../assets/image1.png";

export default function MemePage() {
  const [memeData, setMemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);
  const [relatedMemes, setRelatedMemes] = useState([]);
  const [category, setCategory] = useState("");
  const { darkMode } = useTheme();
  const { id } = useParams();
  const { loggedIn } = useUser();
  const navigate = useNavigate();
  const commentInputRef = useRef(null);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [laughAnimations, setLaughAnimations] = useState({});

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTimeElapsed = (dateString) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - posted) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return formatDate(dateString);
  };

  useEffect(() => {
    setLoading(true);
    const fetchMemeData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/memes/${id}`
        );
        setMemeData(res.data.meme);
        setLikes(res.data.meme.likes || 0);
        setComments(res.data.meme.commentArray || []);
        setCategory(res.data.meme.category);

        if (loggedIn) {
          const likeStatus = await axios.get(
            `${import.meta.env.VITE_API_URL}/memes/${id}/like-status`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setLiked(likeStatus.data.liked);
        }
      } catch (err) {
        console.error("Error fetching meme data:", err);
        toast.error("Failed to load meme");
      } finally {
        setLoading(false);
      }
    };
    fetchMemeData();
  }, [id, loggedIn]);

  useEffect(() => {
    if (!category) return;
    const fetchRelatedMemes = async () => {
      try {
        const relatedRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/memes/feed?category=${category}`
        );
        setRelatedMemes(
          relatedRes.data.memes.filter((m) => m._id !== id) || []
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchRelatedMemes();
  }, [category, id]);

  const triggerLaughAnimation = (id) => {
    setLaughAnimations((prev) => ({ ...prev, [id]: true }));
    setTimeout(
      () => setLaughAnimations((prev) => ({ ...prev, [id]: false })),
      1200
    );
  };

  const handleLike = async () => {
    if (!loggedIn) {
      toast.warn("Please login to like. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    try {
      if (liked) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/memes/${id}/unlike`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/memes/${id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikes(likes + 1);
        triggerLaughAnimation(id);
        setLiked(true);
      }
    } catch (err) {
      console.error("Error updating like status:", err);
      toast.error("Failed to update like");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      toast.warn("Please login to comment. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/memes/${id}/comment`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(res)
      const newCommentObj =
        res.data.meme.commentArray[res.data.meme.commentArray.length - 1];
      setComments([newCommentObj, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
      toast.error("Failed to post comment");
    }
  };

  const focusCommentInput = () => commentInputRef.current?.focus();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareTooltip(true);
    setTimeout(() => setShareTooltip(false), 2000);
  };

  const handleBack = () => navigate(-1);

  const toggleImageEnlargement = () => {
    setIsImageEnlarged(!isImageEnlarged);
    document.body.style.overflow = isImageEnlarged ? "auto" : "hidden";
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      } font-poppins`}
    >
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
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

      <div className="relative z-10 pt-12 md:pl-12 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className={`flex items-center space-x-2 mb-6 p-2 rounded-lg ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700/50"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaArrowLeft />
            <span>Back</span>
          </motion.button>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              {loading ? (
                <motion.div
                  className="flex justify-center items-center h-64"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <FaLaughSquint size={48} className="text-yellow-400" />
                </motion.div>
              ) : memeData ? (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl p-6 ${
                      darkMode
                        ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50"
                        : "bg-white/80 shadow-lg border border-gray-200"
                    }`}
                  >
                    <h1
                      className={`text-2xl sm:text-3xl font-fredoka ${
                        darkMode
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
                          : "text-gray-800"
                      } mb-2`}
                    >
                      {memeData.name}
                    </h1>
                    <div
                      className={`flex items-center justify-between text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FaUser className="text-blue-500" />
                        <span>{memeData.creator?.username || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-green-500" />
                        <span>
                          {memeData.createdAt
                            ? getTimeElapsed(memeData.createdAt)
                            : "Unknown date"}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`relative rounded-xl overflow-hidden ${
                      darkMode
                        ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        : "bg-white shadow-xl border border-gray-200"
                    }`}
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={toggleImageEnlargement}
                    >
                      <img
                        src={memeData.url}
                        alt={memeData.name || "Meme"}
                        loading="lazy"
                        className="w-full rounded-xl object-contain mx-auto"
                        style={{ maxHeight: isImageEnlarged ? "none" : "70vh" }}
                      />
                      <AnimatePresence>
                        {laughAnimations[id] && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute text-[#FFCC00] text-2xl"
                                initial={{
                                  x: 0,
                                  y: 0,
                                  scale: 1,
                                  opacity: 0.8,
                                  rotate: Math.random() * 30 - 15,
                                }}
                                animate={{
                                  x: (Math.random() - 0.5) * 250,
                                  y: (Math.random() - 0.5) * 250,
                                  scale: 2 + Math.random() * 0.8,
                                  opacity: 0,
                                  rotate: Math.random() * 60 - 30,
                                }}
                                transition={{ duration: 1 + Math.random() }}
                              >
                                <FaLaughSquint />
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!isImageEnlarged && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div
                            className={`px-4 py-2 rounded-full font-fredoka ${
                              darkMode
                                ? "bg-gray-700/80 text-gray-200"
                                : "bg-gray-200/80 text-gray-800"
                            }`}
                          >
                            Click to enlarge
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      darkMode
                        ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50"
                        : "bg-white/80 shadow-lg border border-gray-200"
                    }`}
                  >
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLike}
                      className="flex items-center space-x-2"
                    >
                      {liked ? (
                        <FaHeart size={24} className="text-red-500" />
                      ) : (
                        <FaRegHeart
                          size={24}
                          className={
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }
                        />
                      )}
                      <span className="font-bold">{likes}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={focusCommentInput}
                      className={`flex items-center space-x-2 ${
                        darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-700 hover:text-black"
                      }`}
                    >
                      <FaComment size={22} className="text-blue-500" />
                      <span className="font-bold">{comments.length}</span>
                    </motion.button>

                    <div className="relative">
                      <motion.button
                        whileHover={{
                          scale: 1.1,
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className={`flex items-center space-x-2 ${
                          darkMode
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-700 hover:text-black"
                        }`}
                      >
                        <FaShareAlt size={20} className="text-green-500" />
                        <span>Share</span>
                      </motion.button>
                      <AnimatePresence>
                        {shareTooltip && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`absolute right-0 top-full mt-2 p-2 rounded-md font-fredoka ${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-800"
                            } text-sm whitespace-nowrap`}
                          >
                            Link copied!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className={`rounded-xl p-6 ${
                      darkMode
                        ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50"
                        : "bg-white/80 shadow-lg border border-gray-200"
                    }`}
                  >
                    <h2 className="text-xl sm:text-2xl font-fredoka mb-4">
                      Comments
                    </h2>
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <motion.input
                          ref={commentInputRef}
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className={`flex-1 p-2 sm:p-3 rounded-lg ${
                            darkMode
                              ? "bg-gray-700/30 backdrop-blur-md border border-gray-600 text-gray-200 placeholder-gray-400"
                              : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                          whileFocus={{
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                        />
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            boxShadow: darkMode
                              ? "0 0 10px rgba(59, 130, 246, 0.5)"
                              : "0 0 10px rgba(99, 102, 241, 0.3)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={!newComment.trim()}
                          className={`w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white font-fredoka text-sm sm:text-base ${
                            !newComment.trim()
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          }`}
                        >
                          Post
                        </motion.button>
                      </div>
                    </form>
                    <div className="space-y-4 max-h-64 overflow-auto scrollbar-hide">
                      {comments.length === 0 ? (
                        <p
                          className={`text-center py-4 italic ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          No comments yet. Be the first to comment!
                        </p>
                      ) : (
                        comments.map((comment, index) => (
                          <motion.div
                            key={comment._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`p-4 rounded-lg ${
                              darkMode
                                ? "bg-gray-700/30 backdrop-blur-md border border-gray-700/50"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-300">
                                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-fredoka">
                                  {comment.username?.charAt(0).toUpperCase() ||
                                    "A"}
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {comment }
                                </div>
                                <div
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {comment.createdAt
                                    ? getTimeElapsed(comment.createdAt)
                                    : "Just now"}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-8 rounded-xl text-center ${
                    darkMode
                      ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50"
                      : "bg-white/80 shadow-lg border border-gray-200"
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl font-fredoka">
                    Meme not found or has been removed.
                  </h2>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: darkMode
                        ? "0 0 10px rgba(59, 130, 246, 0.5)"
                        : "0 0 10px rgba(99, 102, 241, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    className={`mt-4 px-4 py-2 rounded-lg text-white font-fredoka ${
                      darkMode
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    Go Back
                  </motion.button>
                </motion.div>
              )}
            </div>

            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`sticky top-20 rounded-xl p-6 ${
                  darkMode
                    ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50"
                    : "bg-white/80 shadow-lg border border-gray-200"
                }`}
              >
                <h2 className="text-xl sm:text-2xl font-fredoka mb-4">
                  Related Memes
                </h2>
                {relatedMemes.length === 0 ? (
                  <p
                    className={`text-center py-4 italic ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No related memes found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {relatedMemes.slice(0, 5).map((meme, index) => (
                      <Link to={`/meme/${meme._id}`} key={meme._id || index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.03 }}
                          className={`flex items-center p-2 rounded-lg ${
                            darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                            <img
                              src={meme.url}
                              alt={meme.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-fredoka line-clamp-2">
                              {meme.name}
                            </h3>
                            <div
                              className={`flex items-center mt-1 text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <FaHeart
                                className="text-red-500 mr-1"
                                size={12}
                              />
                              <span className="mr-3">{meme.likes || 0}</span>
                              <FaComment
                                className="text-blue-500 mr-1"
                                size={12}
                              />
                              <span>{meme.commentArray?.length || 0}</span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}

                {memeData?.creator && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className={`mt-6 p-4 rounded-lg ${
                      darkMode
                        ? "bg-gray-700/30 backdrop-blur-md border border-gray-700/50"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <h3 className="font-fredoka mb-2">Creator</h3>
                    <Link to={`/profile/${memeData.creator._id}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-blue-500 flex items-center justify-center text-white font-fredoka">
                          {memeData.creator.avatar ? (
                            <img
                              src={memeData.creator.avatar}
                              alt={memeData.creator.username}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            memeData.creator.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {memeData.creator.username}
                          </div>
                          <div
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {memeData.creator.memesCount || 0} memes
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isImageEnlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
            onClick={toggleImageEnlargement}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-screen-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={memeData.url}
                alt={memeData.name || "Meme"}
                className="max-h-[90vh] max-w-full object-contain rounded-xl"
                loading="lazy"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleImageEnlargement}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white font-fredoka"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-fredoka {
          font-family: "Fredoka One", cursive;
        }
        @media (max-width: 768px) {
          .lg\\:w-2\\/3 {
            width: 100%;
          }
          .lg\\:w-1\\/3 {
            width: 100%;
          }
        }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
      `}</style>
    </div>
  );
}
