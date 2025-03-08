

import { useState, useEffect } from "react";
import { Home, Search, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; 
import bgImage from "../assets/image1.png";

export default function NotFound() {
  const [memeIndex, setMemeIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { darkMode } = useTheme(); 

  const funnyMessages = [
    "This page has gone to find itself. Very deep.",
    "Error 404: Meme not found. The internet ate it.",
    "Looks like this meme was too dank for our servers.",
    "The meme you're looking for is in another castle.",
    "404: Page ran away to join the deleted files circus.",
    "This URL is taking a mental health day.",
    "Our developers accidentally the whole page.",
    "This page was abducted by aliens. The truth is out there.",
  ];

  const memeVisuals = [
    { alt: "This is Fine Dog", src: "https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif" },
    { alt: "Surprised Pikachu", src: "https://media.giphy.com/media/6nWhy3ulBL7GSCvKw6/giphy.gif" },
    { alt: "Sad Pablo Escobar", src: "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif" },
    { alt: "404 Tumbleweed", src: "https://media.giphy.com/media/Az33BHnpnRJYI/giphy.gif" },
  ];

  const changeMeme = () => {
    setMemeIndex((prevIndex) => (prevIndex + 1) % memeVisuals.length);
    setRotation(rotation + 360);
  };

  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounceHeight((prev) => (prev === 0 ? -10 : 0));
    }, 500);
    return () => clearInterval(bounceInterval);
  }, []);

  const [bounceHeight, setBounceHeight] = useState(0);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"} font-poppins`}>
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

      <nav className={`relative z-10 ${darkMode ? "bg-gray-800/30 backdrop-blur-md border-b border-gray-700/50" : "bg-white shadow-md"}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className={`text-2xl font-fredoka ${darkMode ? "text-blue-400" : "text-indigo-600"}`}>
            MemeVerse
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/explore" className={`text-sm ${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-indigo-600"}`}>
              Explore
            </Link>
            <Link to="/" className={`px-4 py-2 rounded-lg text-white font-medium ${darkMode ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-xl w-full rounded-xl ${darkMode ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50" : "bg-white/80 shadow-lg border border-gray-200"} overflow-hidden`}
        >
          <div className={`p-6 ${darkMode ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20" : "bg-indigo-600"} flex flex-col items-center relative`}>
            <motion.div
              animate={{ y: bounceHeight }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className={`absolute top-4 right-4 ${darkMode ? "bg-blue-400 text-black" : "bg-white text-indigo-600"} font-fredoka text-2xl rounded-full h-12 w-12 flex items-center justify-center cursor-pointer`}
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.1 }}
            >
              404
            </motion.div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-16 right-4 ${darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-700"} text-xs p-2 rounded shadow-md z-10 max-w-xs`}
                >
                  <p>You found the secret! 404 errors happen when a page can't be found on a server.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key={memeIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-60 w-full flex justify-center items-center p-2"
            >
              <img
                src={memeVisuals[memeIndex].src}
                alt={memeVisuals[memeIndex].alt}
                loading="lazy"
                className={`max-h-full max-w-full object-contain rounded-lg ${darkMode ? "shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "shadow-md"}`}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, boxShadow: darkMode ? "0 0 15px rgba(59, 130, 246, 0.5)" : "0 0 15px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.9 }}
              onClick={changeMeme}
              className={`absolute bottom-4 right-4 ${darkMode ? "bg-blue-400 text-black" : "bg-white text-indigo-600"} p-2 rounded-full shadow-lg`}
              style={{ transform: `rotate(${rotation}deg)` }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw className="h-5 w-5" />
            </motion.button>
          </div>

          <div className="p-8 text-center">
            <h1 className={`text-3xl sm:text-4xl font-fredoka ${darkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500" : "text-gray-800"} mb-2`}>
              Meme Not Found
            </h1>
            <p className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"} mb-8 min-h-16`}>
              {funnyMessages[memeIndex % funnyMessages.length]}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/"
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium ${darkMode ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  <Home className="h-5 w-5" />
                  Back to Meme HQ
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/explore"
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700/50" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  <Search className="h-5 w-5" />
                  Find Dank Memes
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center max-w-md"
        >
          <p
            className={`text-sm italic cursor-pointer ${darkMode ? "text-gray-400 hover:text-blue-400" : "text-gray-500 hover:text-indigo-500"}`}
            onClick={changeMeme}
          >
            "When one meme URL dies, another is born. Such is the circle of internet life."
          </p>
        </motion.div>
      </div>

      <footer className={`relative z-10 ${darkMode ? "bg-gray-800/30 backdrop-blur-md border-t border-gray-700/50" : "bg-white shadow-md"} mt-auto`}>
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <Link to="/" className={`text-xl font-fredoka ${darkMode ? "text-blue-400" : "text-indigo-600"}`}>
              MemeVerse
            </Link>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Where memes come to live forever (except this one)
            </p>
          </div>
          <div className="flex gap-4">
            {["about", "privacy", "terms", "contact"].map((link) => (
              <Link key={link} to={`/${link}`} className={`text-sm ${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-indigo-600"}`}>
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      <style jsx>{`
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-fredoka {
          font-family: "Fredoka One", cursive;
        }
        @media (max-width: 640px) {
          .grid-cols-2.sm\\:grid-cols-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
