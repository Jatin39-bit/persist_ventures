
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
import { useUser } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";
import { FaLaughSquint } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import cookies from "js-cookie";
import bgImage from "../assets/image1.png";

export default function SignupPage() {
  const { setLoggedIn, setUserr } = useUser();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({ email: "", name: "", password: "" });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setPasswordStrength(score);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setUser({ ...user, password: newPassword });
    checkPasswordStrength(newPassword);
  };

  async function signup(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, user);
      if (response.status === 200) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        cookies.set("token", response.data.token, { expires: 1 });
        localStorage.setItem("user", JSON.stringify(response.data.newUser));
        setLoggedIn(true);
        if (response.data.newUser) {
          setUserr(response.data.newUser);
        }
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoggedIn(false);
      cookies.remove("token");
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-black" : "bg-gray-100"} font-poppins`}>
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
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable pauseOnFocusLoss />

      <motion.div
        className={`relative z-10 w-full max-w-md mx-4 sm:mx-0 p-6 sm:p-8 rounded-xl ${darkMode ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50" : "bg-white/80 shadow-xl border border-gray-200"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full ${darkMode ? "bg-blue-500/20" : "bg-indigo-100"} ${darkMode ? "text-blue-400" : "text-indigo-500"} mb-4`}
          >
            <User size={24} />
          </motion.div>
          <h2 className={`text-2xl sm:text-3xl font-fredoka ${darkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500" : "text-gray-800"}`}>
            Join MemeVerse
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Create an account to share the dankest memes
          </p>
        </div>

        <form onSubmit={signup} className="space-y-5">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}
              htmlFor="name"
            >
              <User size={16} />
              Name
            </label>
            <motion.input
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              value={user.name}
              className={`w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700/30 backdrop-blur-md border border-gray-600 text-gray-200 placeholder-gray-400" : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"}`}
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
              whileFocus={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}
              htmlFor="email"
            >
              <Mail size={16} />
              Email
            </label>
            <motion.input
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              value={user.email}
              className={`w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700/30 backdrop-blur-md border border-gray-600 text-gray-200 placeholder-gray-400" : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"}`}
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              whileFocus={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}
              htmlFor="password"
            >
              <Lock size={16} />
              Password
            </label>
            <motion.input
              onChange={handlePasswordChange}
              value={user.password}
              className={`w-full px-4 py-3 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700/30 backdrop-blur-md border border-gray-600 text-gray-200 placeholder-gray-400" : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"}`}
              type="password"
              id="password"
              name="password"
              minLength={6}
              placeholder="Create a secure password"
              required
              whileFocus={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
            />
            {user.password && (
              <div className="mt-2">
                <div className="flex h-1 mt-2 overflow-hidden rounded bg-gray-300 dark:bg-gray-600">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength * 20}%` }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`${passwordStrength <= 1 ? "bg-red-500" : passwordStrength <= 3 ? "bg-yellow-500" : "bg-green-500"}`}
                  />
                </div>
                <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {passwordStrength <= 1 && "Weak password"}
                  {passwordStrength > 1 && passwordStrength <= 3 && "Moderate password"}
                  {passwordStrength > 3 && "Strong password"}
                </p>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: darkMode ? "0 0 15px rgba(59, 130, 246, 0.5)" : "0 0 15px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <FaLaughSquint className="animate-spin h-5 w-5 text-white" />
                Creating account...
              </span>
            ) : (
              "Sign Up"
            )}
          </motion.button>

          <div className="mt-4 text-center text-sm sm:text-base">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Already have an account?{" "}
              <Link to="/login" className={`font-medium ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-indigo-600 hover:text-indigo-500"}`}>
                Log in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>

      <style jsx>{`
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-fredoka {
          font-family: "Fredoka One", cursive;
        }
        @media (max-width: 640px) {
          .max-w-md {
            max-width: 100%;
            margin-left: 1rem;
            margin-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}