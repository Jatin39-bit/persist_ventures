
import { useEffect, useState, useRef, useCallback } from "react";
import { motion} from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaLaughSquint } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/image1.png";
import { Heart, MessageCircle } from "lucide-react";

export default function ExplorePage() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState("random");
  const [sortOption, setSortOption] = useState("mostLiked");
  const [allMemes, setAllMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observer = useRef();
  const ITEMS_PER_PAGE = 6;

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    setLoading(true);
    setMemes([]);
    setAllMemes([]);
    setPage(1);
    setHasMore(true);

    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/memes/feed?category=${activeCategory}&sort=${sortOption}`
      )
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
        if (entries[0].isIntersecting && hasMore) loadMoreMemes();
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
      setMemes((prevMemes) => [...prevMemes, ...nextMemes]);
      setPage(nextPage);
      setHasMore(endIndex < allMemes.length);
      setLoadingMore(false);
    }, 500);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/memes/search?q=${encodeURIComponent(
            searchQuery
          )}`
        )
        .then((res) => {
          setSearchResults(res.data.memes);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error searching memes:", err);
          setLoading(false);
        });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleCategoryChange = (category) => setActiveCategory(category);

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

      <div className="max-w-7xl mx-auto px-4 py-6 z-10 relative min-h-screen md:pl-18 xl:pl-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 w-full flex justify-center"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find dank memes…"
            className={`w-full sm:w-[70%] p-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${
                darkMode
                  ? "bg-gray-900/30 backdrop-blur-md border border-gray-700/50 text-white placeholder-gray-400"
                  : "bg-white/80 shadow-md border border-gray-200 text-gray-900 placeholder-gray-500"
              } 
              focus:w-[110%] sm:focus:w-[80%] focus:shadow-lg`}
          />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">

          <div className="lg:hidden flex md:flex-row flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:flex-1"
          >
            <div
              className={`p-4 rounded-lg ${
                darkMode
                  ? "bg-gray-900/30 backdrop-blur-md border border-gray-700/50"
                  : "bg-white/80 shadow-md border border-gray-200"
              }`}
            >
              <h3 className="text-2xl font-fredoka mb-4 text-center lg:text-left">
                Categories
              </h3>
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-3 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                {["trending", "new", "classic", "random"].map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 
                      ${
                        activeCategory === category
                          ? "bg-gradient-to-r from-pink-400 to-purple-600 text-white shadow-lg"
                          : darkMode
                          ? "bg-gray-900/50 text-gray-300 hover:bg-gray-900/80"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } 
                      ${
                        darkMode && activeCategory === category
                          ? "shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                          : ""
                      }`}
                    whileHover={{
                      scale: 1.05,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:flex-1"
          >
            <div
              className={`p-4 rounded-lg${
                darkMode
                  ? "bg-gray-900/30 backdrop-blur-md border border-gray-700/50"
                  : "bg-white/80 shadow-md border border-gray-200"
              }`}
            >
              <h3 className="text-2xl font-fredoka mb-4 text-center">Sort</h3>
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                <motion.button
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortOption === "mostLiked"
                      ? "bg-gradient-to-r from-pink-400 to-purple-600 text-white"
                      : darkMode
                      ? "bg-gray-900/50 text-gray-300 hover:bg-gray-900/80"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } ${
                    darkMode && sortOption === "mostLiked"
                      ? "shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                      : ""
                  }`}
                  onClick={() => setSortOption("mostLiked")}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Most Liked
                </motion.button>
                <motion.button
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortOption === "comments"
                      ? "bg-gradient-to-r from-pink-400 to-purple-600 text-white"
                      : darkMode
                      ? "bg-gray-900/50 text-gray-300 hover:bg-gray-900/80"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } ${
                    darkMode && sortOption === "comments"
                      ? "shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                      : ""
                  }`}
                  onClick={() => setSortOption("comments")}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Most Comments
                </motion.button>
              </div>
            </div>
          </motion.div>
          </div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:flex-1 hidden lg:block"
          >
            <div
              className={`p-4 rounded-lg ${
                darkMode
                  ? "bg-gray-900/30 backdrop-blur-md border border-gray-700/50"
                  : "bg-white/80 shadow-md border border-gray-200"
              }`}
            >
              <h3 className="text-2xl font-fredoka mb-4 text-center lg:text-left">
                Categories
              </h3>
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-3 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                {["trending", "new", "classic", "random"].map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 
                      ${
                        activeCategory === category
                          ? "bg-gradient-to-r from-pink-400 to-purple-600 text-white shadow-lg"
                          : darkMode
                          ? "bg-gray-900/50 text-gray-300 hover:bg-gray-900/80"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } 
                      ${
                        darkMode && activeCategory === category
                          ? "shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                          : ""
                      }`}
                    whileHover={{
                      scale: 1.05,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="lg:flex-[3]">
            {loading ? (
              <motion.div
                className="flex justify-center items-center h-[50vh]"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <FaLaughSquint size={48} className="text-yellow-400" />
              </motion.div>
            ) : (
              <div className="space-y-6 overflow-y-auto h-[calc(100vh-10px)] sm:h-[calc(100vh-100px)] pr-2 scrollbar-hide">
                {searchResults.length > 0 ? (
                  searchResults.map((meme, index) => (
                    <motion.div
                      onClick={() => navigate(`/meme/${meme._id}`)}
                      key={meme._id}
                      ref={
                        index === searchResults.length - 1
                          ? lastMemeElementRef
                          : null
                      }
                      className={`rounded-lg overflow-hidden ${
                        darkMode
                          ? "bg-gray-900/30 backdrop-blur-md border border-gray-700/50"
                          : "bg-white shadow-md border border-gray-200"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: index * 0.05,
                      }}
                    >
                      <div className="p-3 border-b border-gray-700/50 flex justify-between items-center">
                        <h3 className="font-fredoka text-lg truncate">
                          {meme.name}
                        </h3>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(meme.createdAt).toDateString()}
                        </span>
                      </div>
                      <img
                        src={meme.url}
                        alt={meme.name}
                        className="w-full h-auto object-contain"
                      />
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex space-x-4">
                          <span className="flex items-center space-x-1">
                            <Heart className="h-5 w-5 text-red-500" />
                            <span>{meme.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-5 w-5" />
                            <span>{meme.comments}</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : searchResults.length === 0 && searchQuery.trim() !== "" ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center mt-16 text-3xl font-fredoka text-center"
                  >
                    No memes found
                  </motion.p>
                ) : (
                  memes.map((meme, index) => (
                    <motion.div
                      key={meme._id}
                      ref={
                        index === memes.length - 1 ? lastMemeElementRef : null
                      }
                      className={`rounded-lg overflow-hidden ${
                        darkMode
                          ? "bg-gray-900/30 backdrop-blur-md border border-gray-700/50"
                          : "bg-white shadow-md border border-gray-200"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: index * 0.05,
                      }}
                    >
                      <div
                        className="p-3 border-b border-gray-700/50 flex justify-between items-center"
                        onClick={() => navigate(`/meme/${meme._id}`)}
                      >
                        <h3 className="font-fredoka text-lg truncate">
                          {meme.name}
                        </h3>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(meme.createdAt).toDateString()}
                        </span>
                      </div>
                      <img
                        onClick={() => navigate(`/meme/${meme._id}`)}
                        src={meme.url}
                        alt={meme.name}
                        className="w-full h-auto object-contain"
                      />
                      <div className="p-4 flex justify-between items-center">
                        <div
                          className="flex space-x-4"
                          onClick={() => navigate(`/meme/${meme._id}`)}
                        >
                          <span className="flex items-center space-x-1">
                            <Heart className="h-5 w-5 text-red-500" />
                            <span>{meme.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-5 w-5" />
                            <span>{meme.comments}</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                {loadingMore && (
                  <motion.div
                    className="flex justify-center my-6"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <FaLaughSquint size={32} className="text-yellow-400" />
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:flex-1 hidden lg:block"
          >
            <div
              className={`p-4 rounded-lg ${
                darkMode
                  ? "bg-gray-900/30 backdrop-blur-md border border-gray-700/50"
                  : "bg-white/80 shadow-md border border-gray-200"
              }`}
            >
              <h3 className="text-2xl font-fredoka mb-2 text-center">Sort</h3>
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                <motion.button
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all mb-4 ${
                    sortOption === "mostLiked"
                      ? "bg-gradient-to-r from-pink-400 to-purple-600 text-white"
                      : darkMode
                      ? "bg-gray-900/50 text-gray-300 hover:bg-gray-900/80"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } ${
                    darkMode && sortOption === "mostLiked"
                      ? "shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                      : ""
                  }`}
                  onClick={() => setSortOption("mostLiked")}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Most Liked
                </motion.button>
                <motion.button
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortOption === "comments"
                      ? "bg-gradient-to-r from-pink-400 to-purple-600 text-white"
                      : darkMode
                      ? "bg-gray-900/50 text-gray-300 hover:bg-gray-900/80"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } ${
                    darkMode && sortOption === "comments"
                      ? "shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                      : ""
                  }`}
                  onClick={() => setSortOption("comments")}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Most Comments
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-fredoka {
          font-family: "Fredoka One", cursive;
        }
        @media (max-width: 1023px) {
          .flex-col.lg\\:flex-row {
            flex-direction: column;
          }
        }
        @media (min-width: 1024px) {
          .flex-col.lg\\:flex-row {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}