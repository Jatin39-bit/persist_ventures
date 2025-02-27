
"use client";

import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "./context/ThemeContext";
import { SyncLoader } from "react-spinners";
import Navbar from "./components/Navbar";
import { FaFire, FaRegHeart, FaHeart, FaShare } from "react-icons/fa";
import { useUser } from "./context/AuthContext";

export default function Home() {
  const [memes, setMemes] = useState([]);
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [hoveredMeme, setHoveredMeme] = useState(null);
  const [shareTooltip, setShareTooltip] = useState(false);
  const {loggedIn}=useUser();


  useEffect(() => {
    const fetchMemes = () => {
      setLoading(true);
      axios
        .get("/api/memes", { params: { category:"trending" } })
        .then((res) => {
          setMemes(res.data.memes);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    fetchMemes()
  }, []);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen transition-all`}
    >
      <Navbar />
      <Head>
        <title>MemeVerse - Trending Memes</title>
        <meta name="description" content="Discover the best memes on MemeVerse" />
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <motion.h1 
            className="text-4xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to <span className="text-indigo-500">MemeVerse</span>
          </motion.h1>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
              <button
                className={`px-4 py-2 rounded-full transition-all bg-indigo-500 ${
                  darkMode
                    ? "bg-gray-800 "
                    : "bg-white  shadow-sm"
                }`}
              >
                <FaFire className="inline mr-2" />
                Trending
              </button>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <SyncLoader margin={5} size={15} speedMultiplier={1} color="#6366f1" />
          </div>
        ) : (
          <motion.div
            className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {memes.map((meme) => (
              <motion.div
                key={meme._id}
                className={`mb-4 break-inside-avoid rounded-lg shadow-lg overflow-hidden ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setHoveredMeme(meme._id)}
                onMouseLeave={() => setHoveredMeme(null)}
              >
                <div className="relative">
                  <Image
                    src={meme.url}
                    alt={meme.name}
                    width={500}
                    height={ 500}
                    unoptimized
                    className="w-full h-auto object-cover"
                    onClick={() => {
                      router.push(`/meme/${meme._id}`);
                    }}
                  />
                  
                  {hoveredMeme === meme._id && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-center">
                        <button 
                          className="px-3 py-1 bg-indigo-500 text-white rounded-full text-sm hover:bg-indigo-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/meme/${meme._id}`);
                          }}
                        >
                          View
                        </button>
                        <button 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href+'/meme/'+meme._id);
                          setShareTooltip(true);
                          setTimeout(() => setShareTooltip(false), 2000);
                        }
                      }
                        className="text-white hover:text-blue-400 transition-colors">
                          <FaShare size={18} />
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
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{meme.name}</h3>
                  <div className="flex justify-between items-center text-sm opacity-80">
                    <span className="capitalize">{meme.category || "Uncategorized"}</span>
                    <span>{meme.likes || 0} likes</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {!loading && memes.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No memes found in this category</h3>
            <p className="text-gray-500 dark:text-gray-400">Try another category or check back later</p>
          </div>
        )}
        
        {!loading && memes.length > 0 && (
          <div className="mt-12 text-center">
            <button 
              className={`px-6 py-2 rounded-full transition-all ${
                darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"
              } text-white font-medium`}
              onClick={() => router.push('/explore')}
            >
              Explore More Memes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}