
"use client";
import React, { useEffect, useState, useRef, use} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SyncLoader } from "react-spinners";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import { 
  FaHeart, FaRegHeart, FaComment, FaShareAlt, 
  FaArrowLeft, FaUser, FaClock 
} from "react-icons/fa";
import { useTheme } from "@/app/context/ThemeContext";
import { useUser } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import cookies from 'js-cookie';
import Link from "next/link";

export default function Page({ params }) {
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
  const id= params.id;
  const { loggedIn, setLoggedIn, userr, setUserr } = useUser();
  const router = useRouter();
  const commentInputRef = useRef(null);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTimeElapsed = (dateString) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - posted) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return formatDate(dateString);
  };


  useEffect(() => {
    setLoading(true);
    
    const fetchMemeData = async () => {
      try {
        const res = await axios.get(`/api/memes/${id}`);
        setMemeData(res.data.meme);
        setLikes(res.data.meme.likes || 0);
        setComments(res.data.meme.commentArray || []);
        setCategory(res.data.meme.category || "");
        
        if (loggedIn) {
          const likeStatus = await axios.get(`/api/memes/${id}/like-status`);
          setLiked(likeStatus.data.liked);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching meme data:", err);
        setLoading(false);
      }
    };

    async function fetchRelatedMemes() {
      try {
        const relatedRes = await axios.get(`/api/memes?category=${category}`);
    setRelatedMemes(relatedRes.data.memes || []);
      } catch (error) {
        console.log(error)
      }
    }
    
    fetchMemeData();
    fetchRelatedMemes();
  }, [id, loggedIn]);


  const handleLike = async () => {
    if (!loggedIn) {
      const confirmLogin = window.confirm("Please login to like this meme. Would you like to go to the login page?");
      if (confirmLogin) {
        router.push('/login');
      }
      return;
    }

    try {
      if (liked) {
        await axios.post(`/api/memes/${id}/unlike`);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await axios.post(`/api/memes/${id}/like`);
        setLikes(likes + 1);
        setLiked(true);
        
        const heartAnimation = document.createElement('div');
        heartAnimation.classList.add('heart-animation');
        document.body.appendChild(heartAnimation);
        setTimeout(() => {
          document.body.removeChild(heartAnimation);
        }, 1000);
      }
    } catch (err) {
      console.error("Error updating like status:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!loggedIn) {
      const confirmLogin = window.confirm("Please login to comment. Would you like to go to the login page?");
      if (confirmLogin) {
        router.push('/login');
      }
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      const res = await axios.post(`/api/memes/${id}/comment`, { text: newComment });
      const length = res.data.meme.commentArray.length;
      const newCommentObj = res.data.meme.commentArray[length - 1];
      setComments([newCommentObj, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const focusCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareTooltip(true);
    setTimeout(() => setShareTooltip(false), 2000);
  };

  const handleBack = () => {
    router.back();
  };

  const toggleImageEnlargement = () => {
    setIsImageEnlarged(!isImageEnlarged);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <style jsx global>{`
        .heart-animation {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: red;
          font-size: 100px;
          opacity: 0;
          animation: heartPulse 1s ease-out;
          z-index: 1000;
        }
        
        @keyframes heartPulse {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
        
        .hover-scale {
          transition: all 0.2s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>

      <Navbar />

      <div className="container mx-auto px-4 py-2">
        <button 
          onClick={handleBack}
          className={`flex items-center space-x-2 mb-4 p-2 rounded-lg 
          ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-200"} 
          transition-colors duration-200`}
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <SyncLoader color="#36D7B7" />
            </div>
          ) : memeData ? (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
              >
                <h1 className="text-2xl font-bold mb-2">{memeData.name}</h1>
                <div className="flex items-center justify-between text-sm opacity-75">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-blue-500" />
                    <span>{memeData.creator?.username || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-green-500" />
                    <span>{memeData.createdAt ? getTimeElapsed(memeData.createdAt) : "Unknown date"}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`relative rounded-lg overflow-hidden shadow-xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-2`}
              >
                <div className="relative cursor-pointer" onClick={toggleImageEnlargement}>
                  <img
                    src={memeData.url}
                    alt={memeData.name || "Meme"}
                    loading="lazy"
                    className="w-full rounded-lg object-contain mx-auto"
                    style={{ maxHeight: isImageEnlarged ? "none" : "70vh" }}
                  />
                  {!isImageEnlarged && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <div className={`px-4 py-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} bg-opacity-80`}>
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
                className={`flex items-center justify-between p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <button
                  className="flex items-center space-x-2 transition-transform duration-200 hover:scale-110"
                  onClick={handleLike}
                >
                  <motion.div
                    whileTap={{ scale: 1.4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {liked ? (
                      <FaHeart size={24} className="text-red-500" />
                    ) : (
                      <FaRegHeart size={24} className={darkMode ? "text-gray-300" : "text-gray-700"} />
                    )}
                  </motion.div>
                  <span className="font-bold">{likes}</span>
                </button>

                <button
                  className={`flex items-center space-x-2 ${
                    darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
                  } transition-transform duration-200 hover:scale-110`}
                  onClick={focusCommentInput}
                >
                  <FaComment size={22} className="text-blue-500" />
                  <span className="font-bold">{comments.length}</span>
                </button>

                <div className="relative">
                  <button
                    className={`flex items-center space-x-2 ${
                      darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
                    } transition-transform duration-200 hover:scale-110`}
                    onClick={handleShare}
                  >
                    <FaShareAlt size={20} className="text-green-500" />
                    <span>Share</span>
                  </button>
                  
                  <AnimatePresence>
                    {shareTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute right-0 top-full mt-2 p-2 rounded-md ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
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
                className={`rounded-lg p-4 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      ref={commentInputRef}
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className={`flex-1 p-3 rounded-lg ${
                        darkMode 
                          ? "bg-gray-700 text-white border-gray-600" 
                          : "bg-gray-100 text-gray-900 border-gray-300"
                      } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-bold
                      ${!newComment.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}
                      transition-colors duration-200`}
                    >
                      Post
                    </button>
                  </div>
                </form>
                
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-center py-4 italic opacity-70">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment, index) => (
                      <motion.div
                        key={comment || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-50"
                        } border-l-4 border-blue-500`}
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-300">
                              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                                {'A'}
                              </div>
                          </div>
                          <div>
                            <div className="font-semibold">
                              {comment}
                            </div>
                            <div className="text-xs opacity-70">
                              {"Just now"}
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
            <div className={`p-8 rounded-lg text-center ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <h2 className="text-xl">Meme not found or has been removed.</h2>
              <button 
                onClick={handleBack}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`sticky top-20 rounded-lg p-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <h2 className="text-xl font-bold mb-4">Related Memes</h2>
            
            {relatedMemes.length === 0 ? (
              <p className="text-center py-4 italic opacity-70">No related memes found</p>
            ) : (
              <div className="space-y-4">
                {relatedMemes.slice(0, 5).map((meme, index) => (
                  <Link href={`/meme/${meme._id}`} key={meme._id || index}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
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
                        <h3 className="font-medium line-clamp-2">{meme.name}</h3>
                        <div className="flex items-center mt-1 text-sm opacity-70">
                          <FaHeart className="text-red-500 mr-1" size={12} />
                          <span className="mr-3">{meme.likes || 0}</span>
                          <FaComment className="text-blue-500 mr-1" size={12} />
                          <span>{meme.comments || 0}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}

            {memeData?.creator && (
              <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <h3 className="font-bold mb-2">Creator</h3>
                <Link href={`/profile/${memeData.creator._id}`}>
                  <div className="flex items-center hover:opacity-80 transition-opacity duration-200">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-blue-500 flex items-center justify-center text-white">
                      {memeData.creator.avatar ? (
                        <img src={memeData.creator.avatar} alt={memeData.creator.username} className="w-full h-full object-cover" loading="lazy"/>
                      ) : (
                        memeData.creator.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{memeData.creator.username}</div>
                      <div className="text-xs opacity-70">{memeData.creator.memesCount || 0} memes</div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
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
              className="relative max-h-screen max-w-screen-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
              loading="lazy"
                src={memeData.url}
                alt={memeData.name || "Meme"}
                className="max-h-[90vh] max-w-full object-contain"
              />
              <button
                onClick={toggleImageEnlargement}
                className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}