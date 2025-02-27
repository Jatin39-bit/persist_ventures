
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { FaUpload, FaImage, FaTag, FaListAlt, FaRobot, FaSync } from "react-icons/fa";
import { toast } from "sonner";
import { useUser } from "../context/AuthContext";

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
  const [token,setToken] = useState(null);

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
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      console.log("Dropped file:", file);
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      
      setImage(file);
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
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
      

      const uploadRes = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData
      );
      const imageUrl = uploadRes.data.data.display_url;

      const captionRes = await axios.post("/api/generate-captions", {
        imageUrl: imageUrl
      });

      const captions = captionRes.data.captions || [
        "When Monday hits harder than expected",
        "That feeling when the code finally works",
        "Nobody: | Me at 3am looking for snacks",
        "POV: You just realized tomorrow is Monday",
        "This is my spirit animal"
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
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("key", "a9d871de3adf0212696f54141e3b9709");
      
      const uploadRes = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData, 
      );
  const uploadedImageUrl = uploadRes.data.data.display_url;
  setImageUrl(uploadedImageUrl);
  setUploadProgress(100);

      await axios.post("/api/memes/upload", {
        name,
        category,
        url: uploadedImageUrl,
        isAiGenerated: useAiCaption,
        uploadedBy: userr.email,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
      }
      }
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
      toast.error("Failed to upload meme. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploading(false);
      }, 500);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-900"}`}>
      <Navbar />

      <div className="container mx-auto pt-24 px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-500 mb-4"
            >
              <FaUpload size={24} />
            </motion.div>
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Upload a Meme
            </h1>
            <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Share your funniest memes with the MemeZone community
            </p>
          </div>

          <div className={`${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} p-8 rounded-xl shadow-xl`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side - Form */}
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <div className="flex items-center gap-2">
                      <FaTag size={14} />
                      <span>Meme Name</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                    placeholder="Give your meme a catchy name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <div className="flex items-center gap-2">
                      <FaListAlt size={14} />
                      <span>Category</span>
                    </div>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-200" 
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <div className="flex items-center gap-2">
                      <FaImage size={14} />
                      <span>Upload Image / GIF</span>
                    </div>
                  </label>
                  
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 transition-all ${
                      dragActive 
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                        : darkMode 
                          ? "border-gray-600 hover:border-gray-500" 
                          : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <FaImage size={36} className={`mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <p className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Drag and drop your image here, or click to browse
                      </p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Supports JPG, PNG, and GIF (max 5MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,video/gif"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {previewUrl && (
                  <div>
                    <button
                      onClick={generateCaptions}
                      disabled={generatingCaption || !image}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white font-medium transition-all ${
                        generatingCaption || !image
                          ? "bg-gray-400 cursor-not-allowed"
                          : darkMode
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      {generatingCaption ? <FaSync className="animate-spin" /> : <FaRobot />}
                      <span>{generatingCaption ? "Generating Captions..." : "Generate AI Captions"}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className={`flex flex-col items-center justify-center p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                {previewUrl ? (
                  <div className="text-center w-full">
                    <div className="mb-3">
                      <img 
                      loading="lazy"
                        src={previewUrl} 
                        alt="Meme Preview" 
                        className="max-h-56 max-w-full rounded-lg shadow-md mx-auto object-contain"
                      />
                    </div>
                    <h3 className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
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
                            <button
                              key={index}
                              onClick={() => selectCaption(caption)}
                              className={`w-full text-left p-2 rounded text-sm transition-all ${
                                name === caption
                                  ? darkMode
                                    ? "bg-indigo-600 text-white"
                                    : "bg-indigo-100 text-indigo-800"
                                  : darkMode
                                    ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                              }`}
                            >
                              {caption}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <FaImage size={64} className={`mb-3 mx-auto ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                    <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                      Preview will appear here
                    </p>
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
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImageUpload}
                disabled={uploading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                  uploading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Meme"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}