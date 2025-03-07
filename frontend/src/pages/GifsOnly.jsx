
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { gsap } from "gsap";
import bgImage from "../assets/image1.png";
import { FaLaughSquint, FaShare } from "react-icons/fa";
import { Upload } from "lucide-react";

export default function GifsOnly() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMeme, setHoveredMeme] = useState(null);
  const [shareTooltip, setShareTooltip] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const memeRefs = useRef({});
  const contentRef = useRef(null);
  const Api = import.meta.env.VITE_GIF;
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${Api}&limit=20&rating=g`;

  

  useEffect(() => {
    const fetchMemes = () => {
      setLoading(true);
      axios
        .get(url)
        .then((res) => {
          console.log(res.data.data);
          setMemes(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    fetchMemes();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  useEffect(() => {
    if (!loading && memes.length > 0) {
      memes.forEach((meme, index) => {
        gsap.fromTo(
          memeRefs.current[meme.id],
          { opacity: 0, y: 20, filter: "grayscale(1) blur(5px)" },
          { opacity: 1, y: 0, filter: "grayscale(0) blur(0px)", duration: 1.2, ease: "power2.out", delay: index * 0.1 }
        );
      });
    }
  }, [loading, memes]);


  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"} font-poppins transition-all`}>
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
        <motion.div
          className="fixed bottom-8 right-8 z-50 hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <motion.button
            className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg ${darkMode ? "bg-blue-600 border border-blue-400" : "bg-indigo-600"} text-white`}
            whileHover={{ scale: 1.1, boxShadow: darkMode ? "0 0 15px rgba(59, 130, 246, 0.7)" : "0 0 15px rgba(99, 102, 241, 0.6)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/upload")}
          >
            <Upload size={24} />
          </motion.button>
        </motion.div>
      </div>

      <div ref={contentRef} className="relative min-h-screen z-10">
        <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center">

        <motion.div
      className="mb-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 120 }}
    >
      <motion.button
        className={`relative px-6 py-3 sm:px-8 sm:py-4 rounded-full flex items-center justify-center font-fredoka text-base sm:text-lg transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            : "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white border border-indigo-300/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        }`}
        whileHover={{
          scale: 1.1,
          boxShadow: darkMode ? "0 0 25px rgba(59, 130, 246, 0.7)" : "0 0 25px rgba(99, 102, 241, 0.5)",
          transition: { type: "spring", stiffness: 300 },
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        }}
      >
        <motion.span
          className="mr-2"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <FaLaughSquint size={24} />
        </motion.span>
        Gifs Only
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{
            background: darkMode
              ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)"
              : "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)",
          }}
        />
      </motion.button>

      <motion.div
        className="absolute -top-2 -right-2 text-yellow-400"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0l2 5h5l-4 3 1 5-4-3-4 3 1-5-4-3h5l2-5z" />
        </svg>
      </motion.div>

      <style jsx>{`
        .font-fredoka {
          font-family: "Fredoka One", cursive;
        }
      `}</style>
    </motion.div>

          {loading ? (
  <div className="flex justify-center items-center h-64">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <FaLaughSquint size={48} className="text-yellow-400" />
    </motion.div>
  </div>
) : (
  <motion.div
    className="columns-1 sm:columns-2 lg:columns-3 gap-6 w-full max-w-7xl px-4 sm:px-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {memes.map((meme) => (
      <div key={meme.id} ref={(el) => (memeRefs.current[meme.id] = el)} className="inline-block w-full mb-6">
        <motion.div
          className={`h-full break-inside-avoid rounded-lg overflow-hidden relative group ${darkMode ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50" : "bg-white shadow-md border border-gray-200"}`}
          whileHover={{
            y: -8,
            scale: 1.02,
            transition: { type: "spring", stiffness: 400 },
            ...(darkMode ? { boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" } : {}),
          }}
          onMouseEnter={() => setHoveredMeme(meme.id)}
          onMouseLeave={() => setHoveredMeme(null)}
        >
          <div className="relative">
            <motion.img
              src={meme.images.original.url}
              alt={meme.title || "GIF"}
              className="w-full h-auto object-cover rounded-lg transition-all duration-500"
              whileHover={{ scale: 1.05 }}
            />
            <AnimatePresence>
              {hoveredMeme === meme.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-black/30 p-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-center">
                    <motion.button
                      className="text-white hover:text-green-400 transition-colors relative"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(meme.images.original.url);
                        setShareTooltip(meme.id);
                        setTimeout(() => setShareTooltip(null), 2000);
                      }}
                    >
                      <FaShare size={18} />
                      {shareTooltip === meme.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute right-0 top-full mt-2 p-2 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-200"} text-sm whitespace-nowrap z-10`}
                        >
                          Link copied!
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-4">
            <motion.h3
              className="font-fredoka text-lg truncate"
              whileHover={{ scale: 1.01, x: 3, textShadow: darkMode ? "0 0 5px rgba(59, 130, 246, 0.5)" : "none" }}
            >
              {meme.title || "Untitled GIF"}
            </motion.h3>
          </div>
        </motion.div>
      </div>
    ))}
  </motion.div>
)}

          {!loading && memes.length === 0 && (
            <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <h3 className="text-xl font-fredoka mb-2">No GIFs found</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back later for more!</p>
            </motion.div>
          )}


        </div>
      </div>

      <style jsx>{`
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        .font-fredoka {
          font-family: 'Fredoka One', cursive;
        }
      `}</style>
    </div>
  );
}