import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Share2 } from "lucide-react";
import {
  FaRegGrinStars,
  FaStar,
  FaMoon,
  FaSun,
  FaLaughSquint,
  FaRegLaughSquint,
} from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { gsap } from "gsap";
import bgImage from "../assets/image1.png";
import { RiGhostSmileFill } from "react-icons/ri";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [memes, setMemes] = useState([]);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [hoveredMeme, setHoveredMeme] = useState(null);
  const [shareTooltip, setShareTooltip] = useState(false);
  const memeRefs = useRef({});
  const contentRef = useRef(null);


  useEffect(() => {
    const fetchMemes = () => {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/memes/feed`, {
          params: { category: "trending" },
        })
        .then((res) => {
          setMemes(res.data.memes);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    fetchMemes();
  }, []);

  const characterVariants = {
    float: {
      y: [0, -20, 0],
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5 + Math.random(),
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const starVariants = {
    twinkle: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.3, 1],
      transition: {
        duration: 2 + Math.random(),
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5,
      }
    );
  }, []);

  useEffect(() => {
    if (!loading && memes.length > 0) {
      memes.forEach((meme, index) => {
        gsap.fromTo(
          memeRefs.current[meme._id],
          {
            opacity: 0,
            y: 20,
            filter: "grayscale(1) blur(5px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "grayscale(0) blur(0px)",
            duration: 1.2,
            ease: "power2.out",
          }
        );
      });
    }
  }, [loading, memes]);

  return (
    <div
      className={`${
        darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen transition-all`}
    >
      <Navbar />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />

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
          backgroundRepeat: "repeat",
          backgroundAttachment: "fixed",
          zIndex: 0,
        }}
        className="group"
      >
        <div
          className={`absolute inset-0 h-full bg-black ${
            darkMode ? "opacity-70" : "opacity-40"
          }`}
        ></div>
      </div>


      <div ref={contentRef} className="relative min-h-screen z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col justify-center items-center md:pl-12 ">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-5 left-18 flex items-center space-x-2 z-10"
          >
            <span
              className={`font-fredoka text-3xl sm:text-4xl tracking-wide ${
                darkMode
                  ? "bg-purple-500 text-white"
                  : "bg-indigo-600 text-white"
              } px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.5)]`}
            >
              Meme
            </span>
            <span
              className={`font-fredoka text-3xl sm:text-4xl ${
                darkMode ? "text-yellow-300" : "text-yellow-500"
              }`}
            >
              Verse
            </span>
          </motion.div>
          <div className="container mx-auto px-4 py-2 text-center flex justify-center mt-12 relative text-gray-100">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
              className={`relative z-10 p-6 sm:p-12 rounded-3xl max-w-lg text-center ${
                darkMode
                  ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  : "bg-white/80 shadow-xl border border-gray-200"
              }`}
            >
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl font-fredoka tracking-wide uppercase ${
                  darkMode
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500"
                    : "text-gray-800"
                }`}
              >
                Welcome to <span className="block sm:inline">MemeVerse</span>
              </h1>
              <p
                className={`mt-3 text-base sm:text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                The galaxy where humor orbits creativity—explore, craft, and
                share epic memes!
              </p>
              <Link to="/explore">
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: darkMode
                      ? "0 0 20px rgba(236, 72, 153, 0.5)"
                      : "0 0 20px rgba(236, 72, 153, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-6 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-lg sm:text-xl font-fredoka rounded-full shadow-lg border-2 ${
                    darkMode ? "border-pink-400" : "border-red-500"
                  }`}
                >
                  Explore Now
                </motion.button>
              </Link>
            </motion.div>

            <div className="absolute inset-0 pointer-events-none">
              {[
                {
                  Icon: RiGhostSmileFill,
                  color: "text-yellow-400",
                  x: "right-10",
                  y: "bottom-20",
                },
                {
                  Icon: FaRegLaughSquint,
                  color: "text-blue-400",
                  x: "left-10",
                  y: "top-20",
                },
                {
                  Icon: FaRegGrinStars,
                  color: "text-pink-400",
                  x: "right-20",
                  y: "top-40",
                },
                {
                  Icon: IoMdPlanet,
                  color: "text-green-400",
                  x: "left-20",
                  y: "bottom-40",
                },
              ].map(({ Icon, color, x, y }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  variants={characterVariants}
                  className={`absolute ${x} ${y} ${color} text-4xl sm:text-5xl`}
                >
                  <Icon />
                </motion.div>
              ))}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {[
                { x: "top-16 right-16", size: "text-xl" },
                { x: "bottom-20 left-12", size: "text-lg" },
                { x: "top-24 left-24", size: "text-xl" },
                { x: "bottom-32 right-32", size: "text-lg" },
                { x: "top-10 right-40", size: "text-lg" },
                { x: "bottom-10 left-40", size: "text-xl" },
                { x: "top-40 right-10", size: "text-lg" },
                { x: "top-28 left-10", size: "text-lg" },
                { x: "bottom-14 right-20", size: "text-lg" },
              ].map(({ x, size }, index) => (
                <motion.div
                  key={index}
                  variants={starVariants}
                  animate="twinkle"
                  className={`absolute ${x} ${size} ${
                    darkMode ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  <FaStar />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2
                className={`text-4xl font-bold gradient-shift ${
                  darkMode
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                    : "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
                }`}
              >
                Trending Memes
              </h2>
            </motion.div>
          </div>

          {loading ? (
            <div
              className="flex justify-center items-center h-64"
              <motion.span
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1 }}
  >
    <FaLaughSquint size={48} className="text-yellow-400" />
  </motion.span>
            </div>
          ) : (
            <motion.div
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 w-full max-w-7xl px-4 sm:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {memes.map((meme) => (
                <div
                  key={meme._id}
                  ref={(el) => (memeRefs.current[meme._id] = el)}
                  className="inline-block w-full mb-6"
                >
                  <motion.div
                    className={`h-full break-inside-avoid rounded-lg overflow-hidden relative group ${
                      darkMode
                        ? "backdrop-blur-md bg-white/10 border border-white/20 "
                        : "bg-white text-gray-900 shadow-md border border-gray-200"
                    } ${
                      darkMode && hoveredMeme === meme._id
                        ? "border-blue-400 glow-border"
                        : ""
                    }`}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 400 },
                    }}
                    onMouseEnter={() => setHoveredMeme(meme._id)}
                    onMouseLeave={() => setHoveredMeme(null)}
                  >
                    {darkMode && (
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg opacity-0 group-hover:opacity-70 blur transition-all duration-300 ${
                          hoveredMeme === meme._id ? "block" : "hidden"
                        }`}
                      ></div>
                    )}

                    <div className="relative">
                      <div className="overflow-hidden">
                        <motion.img
                          src={meme.url}
                          alt={meme.name}
                          className="w-full h-auto object-cover transition-all duration-500"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => navigate(`/meme/${meme._id}`)}
                        />
                      </div>


                      <AnimatePresence>
                        {hoveredMeme === meme._id && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-black/30 p-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex justify-between items-center">
                              <motion.button
                                className={`px-3 py-1 ${
                                  darkMode
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-indigo-500 hover:bg-indigo-600"
                                } text-white rounded-full text-sm transition-colors`}
                                whileHover={{
                                  scale: 1.05,
                                  boxShadow: darkMode
                                    ? "0 0 10px rgba(59, 130, 246, 0.7)"
                                    : "0 0 10px rgba(99, 102, 241, 0.7)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/meme/${meme._id}`);
                                }}
                              >
                                View
                              </motion.button>

                              <div className="flex space-x-3">
                                <motion.button
                                  className="text-white hover:text-green-400 transition-colors relative icon-button-small"
                                  whileHover={{
                                    scale: 1.1,
                                    transition: {
                                      type: "spring",
                                      stiffness: 300,
                                    },
                                  }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(
                                      window.location.href + "/meme/" + meme._id
                                    );
                                    setShareTooltip(meme._id);
                                    setTimeout(
                                      () => setShareTooltip(null),
                                      2000
                                    );
                                  }}
                                >
                                  <Share2 size={18} />

                                  <AnimatePresence>
                                    {shareTooltip === meme._id && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={`absolute right-0 top-full mt-2 p-2 rounded-md ${
                                          darkMode
                                            ? "bg-gray-700"
                                            : "bg-gray-200"
                                        } text-sm whitespace-nowrap z-10`}
                                      >
                                        Link copied!
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="p-4">
                      <motion.h3
                        className={`font-semibold text-lg mb-2 truncate ${
                          darkMode ? "diamond-text" : ""
                        }`}
                        whileHover={{
                          scale: 1.01,
                          x: 3,
                          textShadow: darkMode
                            ? "0 0 5px rgba(59, 130, 246, 0.5)"
                            : "none",
                        }}
                      >
                        {meme.name}
                      </motion.h3>
                      <div className="flex justify-between items-center text-sm opacity-80">
                        <motion.span
                          className="capitalize"
                          whileHover={{ scale: 1.05 }}
                        >
                          {meme.category || "Uncategorized"}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}

          {!loading && memes.length === 0 && (
            <div className="text-center py-16">
              <motion.h3
                className="text-xl font-medium mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                No memes found in this category
              </motion.h3>
              <motion.p
                className="text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Try another category or check back later
              </motion.p>
            </div>
          )}

          {!loading && memes.length > 0 && (
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                className={`px-6 py-2 rounded-full transition-all ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 border border-blue-400 diamond-shine"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white font-medium`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: darkMode
                    ? "0 0 15px rgba(59, 130, 246, 0.7)"
                    : "0 0 15px rgba(99, 102, 241, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/explore")}
              >
                Explore More Memes
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        className={`fixed bottom-16 right-8 z-10 xl:block  sm:hidden `}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <motion.button
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg  ${
            darkMode
              ? "bg-blue-600 border border-blue-400 diamond-shine"
              : "bg-indigo-600"
          } text-white`}
          whileHover={{
            scale: 1.1,
            boxShadow: darkMode
              ? "0 0 15px rgba(59, 130, 246, 0.7)"
              : "0 0 15px rgba(99, 102, 241, 0.6)",
          }}
          whileTap={{ scale: 0.8 }}
          onMouseUp={() => navigate("/upload")}
        >
          <Upload size={24} />
        </motion.button>
      </motion.div>

      <style jsx>{`
        .icon-button-small {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease-in-out;
        }
        .icon-button-small:hover {
          animation: shake .2s ease-in-out 1;
        }
        
        .glow-text {
          text-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3);
        }
        
        .glow-border {
box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2);        }
        
      
        .set-bgg{
        background-image: url('../assets/iamge4.jpeg')
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        }
        

        .gradient-shift {
          background-size: 200% 100%;
          animation: gradientShift 5s ease infinite;
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
          
        
      `}</style>
    </div>
  );
}
