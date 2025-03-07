

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Upload, Image, Tag, List, Bot, RefreshCw } from "lucide-react";
import { FaLaughSquint } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "../context/AuthContext";
import bgImage from "../assets/image1.png";

export default function UploadPage() {
  const { userr } = useUser();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("trending");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [suggestedCaptions, setSuggestedCaptions] = useState([]);
  const [useAiCaption, setUseAiCaption] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const { darkMode } = useTheme();
  const fileInputRef = useRef(null);
  const [token, setToken] = useState(null);

  const categories = [
    { value: "trending", label: "Trending" },
    { value: "new", label: "New" },
    { value: "classic", label: "Classic" },
  ];

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    setSuggestedCaptions([]);
    setShowCaptions(false);
  }, [image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      setImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => setPreviewUrl(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      setImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => setPreviewUrl(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const generateCaptions = async () => {
    if (!image) {
      toast.error("Please upload an image first");
      return;
    }
    setGeneratingCaption(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("key", "a9d871de3adf0212696f54141e3b9709");
      formData.append("expiration", "600");

      const uploadRes = await axios.post("https://api.imgbb.com/1/upload", formData);
      const imageUrl = uploadRes.data.data.display_url;

      const captionRes = await axios.post(`${import.meta.env.VITE_API_URL}/ai/generate-captions`, { imageUrl });
      const captions = captionRes.data.captions || [
        "When Monday hits harder than expected",
        "That feeling when the code finally works",
        "Nobody: | Me at 3am looking for snacks",
        "POV: You just realized tomorrow is Monday",
        "This is my spirit animal",
      ];
      setSuggestedCaptions(captions);
      setShowCaptions(true);
      toast.success("Captions generated successfully!");
    } catch (error) {
      console.error("Error generating captions:", error);
      toast.error("Failed to generate captions. Please try again.");
    } finally {
      setGeneratingCaption(false);
    }
  };

  const selectCaption = (caption) => {
    setName(caption);
    setUseAiCaption(true);
  };

  const handleImageUpload = async () => {
    if (!image) {
      toast.error("Please select an image!");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter a meme name!");
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 5));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("key", "a9d871de3adf0212696f54141e3b9709");

      const uploadRes = await axios.post("https://api.imgbb.com/1/upload", formData);
      const uploadedImageUrl = uploadRes.data.data.display_url;
      setImageUrl(uploadedImageUrl);
      setUploadProgress(100);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/memes/upload`,
        { name, category, url: uploadedImageUrl, isAiGenerated: useAiCaption, uploadedBy: userr?.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Meme uploaded successfully!");
      setTimeout(() => {
        setName("");
        setCategory("trending");
        setImage(null);
        setPreviewUrl("");
        setImageUrl("");
        setUploadProgress(0);
        setSuggestedCaptions([]);
        setShowCaptions(false);
        setUseAiCaption(false);
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed: You are not logged in");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setUploading(false), 500);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"} font-poppins`}>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable pauseOnFocusLoss />
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

      <div className="relative min-h-screen z-10 pb-16">
        <div className="container mx-auto pt-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full ${darkMode ? "bg-blue-500/20" : "bg-indigo-100"} ${darkMode ? "text-blue-400" : "text-indigo-500"} mb-4`}
              >
                <Upload size={24} />
              </motion.div>
              <h1 className={`text-3xl sm:text-4xl font-fredoka text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 `}>
                Upload a Meme
              </h1>
              <p className={`text-sm sm:text-base text-gray-200`}>
                Share your dankest memes with the MemeVerse community
              </p>
            </div>

            <div className={`p-6 sm:p-8 rounded-xl ${darkMode ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50" : "bg-white/80 shadow-xl border border-gray-200"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
                      <Tag size={16} />
                      Meme Name
                    </label>
                    <motion.input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700/30 backdrop-blur-md border border-gray-600 text-gray-200 placeholder-gray-400" : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"}`}
                      placeholder="Give your meme a catchy name"
                      whileFocus={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
                      <List size={16} />
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700/30 backdrop-blur-md border border-gray-600 text-gray-200" : "bg-gray-50 border border-gray-300 text-gray-900"}`}
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
                      <Image size={16} />
                      Upload Image / GIF
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 transition-all ${dragActive ? "border-blue-500 bg-blue-500/10" : darkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-400 hover:border-gray-500"}`}           onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <Image size={36} className={`mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                        <p className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Drag and drop your image here, or click to browse
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Supports JPG, PNG, and GIF (max 5MB)
                        </p>
                        <input ref={fileInputRef} type="file" onChange={handleFileChange} accept="image/*,video/gif" className="hidden" />
                      </div>
                    </div>
                  </div>
                  {previewUrl && (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: darkMode ? "0 0 15px rgba(147, 51, 234, 0.5)" : "0 0 15px rgba(139, 92, 246, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateCaptions}
                      disabled={generatingCaption || !image}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all ${generatingCaption || !image ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"}`}
                    >
                      {generatingCaption ? <RefreshCw className="animate-spin" size={20} /> : <Bot size={20} />}
                      <span>{generatingCaption ? "Generating Captions..." : "Generate AI Captions"}</span>
                    </motion.button>
                  )}
                </div>

                <div className={`flex flex-col items-center justify-center p-4 rounded-lg ${darkMode ? "bg-gray-700/30 backdrop-blur-md" : "bg-gray-50"}`}>
                  {previewUrl ? (
                    <div className="text-center w-full relative">
                      <div className="mb-3 relative">
                        <img
                          loading="lazy"
                          src={previewUrl}
                          alt="Meme Preview"
                          className="max-h-56 sm:max-h-64 max-w-full rounded-lg shadow-md mx-auto object-contain"
                        />
                      </div>
                      <h3 className={`text-lg font-fredoka ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        {name || "Your Meme Preview"}
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </p>
                      {showCaptions && suggestedCaptions.length > 0 && (
                        <div className="mt-4 w-full">
                          <h4 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            AI Suggested Captions:
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {suggestedCaptions.map((caption, index) => (
                              <motion.button
                                key={index}
                                onClick={() => selectCaption(caption)}
                                className={`w-full text-left p-2 rounded text-sm transition-all ${name === caption ? (darkMode ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-800") : darkMode ? "bg-gray-600 text-gray-200 hover:bg-gray-500" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {caption}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image size={64} className={`mb-3 mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                {uploading && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <motion.div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: darkMode ? "0 0 15px rgba(59, 130, 246, 0.5)" : "0 0 15px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${uploading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"}`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaLaughSquint className="animate-spin h-5 w-5" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload Meme"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-fredoka {
          font-family: "Fredoka One", cursive;
        }
        @media (max-width: 768px) {
          .grid-cols-1.md\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
          .max-h-56.sm\\:max-h-64 {
            max-height: 48vh;
          }
        }
      `}</style>
    </div>
  );
}