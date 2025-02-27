


"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import Navbar from "../components/Navbar";
import SyncLoader from "react-spinners/SyncLoader";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";

export default function ExplorePage() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("random");
  const [sortOption, setSortOption] = useState("mostLiked");
  const [allMemes, setAllMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();
  const ITEMS_PER_PAGE = 6;
  
  const router = useRouter();
  const { darkMode } = useTheme();

  useEffect(() => {
    setLoading(true);
    setMemes([]);
    setAllMemes([]);
    setPage(1);
    setHasMore(true);
    
    axios
      .get(`/api/memes?category=${activeCategory}&sort=${sortOption}`)
      .then((res) => {
        setAllMemes(res.data.memes);
        setMemes(res.data.memes.slice(0, ITEMS_PER_PAGE));
        setHasMore(res.data.memes.length > ITEMS_PER_PAGE);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching memes:", err);
        setLoading(false);
      });
  }, [activeCategory, sortOption]);


  const lastMemeElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreMemes();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  const loadMoreMemes = () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = nextPage * ITEMS_PER_PAGE;
    const nextMemes = allMemes.slice(startIndex, endIndex);
    
    setTimeout(() => {
      setMemes(prevMemes => [...prevMemes, ...nextMemes]);
      setPage(nextPage);
      setHasMore(endIndex < allMemes.length);
      setLoadingMore(false);
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    axios
      .get(`/api/memes/search?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => {
        setSearchResults(res.data.memes);
        setShowSearchModal(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error searching memes:", err);
        setLoading(false);
      });
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const getTrendingTags = (category) => {
    const tagSets = {
      trending: ["viral", "popular", "trending", "funny", "relatable", "current"],
      new: ["fresh", "latest", "original", "innovative", "creative", "unique"],
      classic: ["throwback", "classic", "retro", "vintage", "nostalgic", "timeless"],
      random: ["random", "diverse", "mixed", "variety", "assorted", "unexpected"]
    };
    
    return tagSets[category] || tagSets.random;
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Navbar />
      
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center mb-6">Explore Memes</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className={`sticky top-20 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="flex flex-col space-y-2">
                  {["trending", "new", "classic", "random"].map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-lg text-left transition-colors ${
                        activeCategory === category
                          ? "bg-blue-600 text-white"
                          : darkMode
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {getTrendingTags(activeCategory).map((tag) => (
                    <span 
                      key={tag}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search memes..."
                    className={`w-full p-3 rounded-l-lg focus:outline-none ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Memes
                </h2>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className={`p-2 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <option value="mostLiked">Most Liked</option>
                  <option value="comments">Most Comments</option>
                </select>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-[50vh]">
                  <SyncLoader color="#36D7B7" />
                </div>
              ) : (
                <div className="space-y-8">
                  {memes.map((meme, index) => {
                    const isLastElement = memes.length === index + 1;
                    return (
                      <motion.div
                        key={meme._id}
                        ref={isLastElement ? lastMemeElementRef : null}
                        className={`rounded-lg shadow-lg overflow-hidden ${
                          darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => {
                          router.push(`/meme/${meme._id}`);
                        }}
                      >
                        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                          <div className="font-semibold text-lg">{meme.name}</div>
                          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            on {new Date(meme.createdAt).toDateString()}
                          </div>
                        </div>
                        <Image
                          src={meme.url}
                          alt={meme.name}
                          width={800}
                          height={600}
                          className="w-full h-auto object-contain"
                          unoptimized
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                              <span className="flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                <span>{meme.likes}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                <span>{meme.comments}</span>
                              </span>
                            </div>
                            <button className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {loadingMore && (
                <div className="flex justify-center my-6">
                  <SyncLoader color="#36D7B7" size={10} />
                </div>
              )}
            </div>
            
            <div className="lg:col-span-3">
              <div className={`sticky top-20 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
                <h3 className="text-xl font-semibold mt-6 mb-4">Trending Now</h3>
                <div className="space-y-2">
                  {["When the code finally works", "2025 problems", "Developer life", "Working from home"].map((topic, idx) => (
                    <div key={idx} className={`p-3 rounded-lg cursor-pointer ${
                      darkMode ? "hover:bg-gray-700 bg-gray-700/50" : "hover:bg-gray-100 bg-gray-100"
                    }`}>
                      <div className="font-medium">{topic}</div>
                      <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {Math.floor(Math.random() * 10) + 1}k views today
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative w-full max-w-4xl rounded-lg shadow-lg p-6 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-2 right-2 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Search Results for "{searchQuery}"</h2>
            
            {searchResults.length === 0 ? (
              <p className="text-center py-10">No memes found matching your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                {searchResults.map((meme) => (
                  <motion.div
                    key={meme._id}
                    className={`rounded-lg shadow overflow-hidden ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      router.push(`/meme/${meme._id}`);
                      setShowSearchModal(false);
                    }}
                  >
                    <Image
                      src={meme.url}
                      alt={meme.name}
                      width={300}
                      height={300}
                      className="w-full h-auto object-cover"
                      unoptimized
                    />
                    <div className="p-3 text-center font-semibold">{meme.name}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}