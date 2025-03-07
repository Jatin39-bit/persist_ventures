

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { Sun, Moon, LogOut, LogIn, Film } from "lucide-react";
import cookies from "js-cookie";
import house from "../assets/3d-house.png";
import compass from "../assets/compass.png";
import podium from "../assets/podium.png";
import profile from "../assets/profile.png";
import upload from "../assets/upload.png";

export default function Navbar() {
  const sidebarRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const { userr, setUserr, setLoggedIn } = useUser();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      cookies.remove("token");
      setLoggedIn(false);
      setUserr(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed z-50 rounded bg-gray ${
        isMobile
          ? "bottom-0 left-0 right-0 h-16 w-full flex-row justify-around border-t border-gray-200 dark:border-gray-700"
          : "left-0 top-0 h-full w-16 flex-col border-r border-gray-200 dark:border-blue-500/30"
      } flex items-center ${
        isMobile ? "py-1 px-2" : "py-4 space-y-6"
      } shadow-lg ${darkMode ? "bg-black" : "bg-gray-200 text-gray-900"}`}
    >
      <NavLink
        to="/"
        className="icon-button"
        activeClassName="active"
        aria-label="Home"
        data-tooltip="Home"
      >
        <img src={house} className="w-5 h-5 md:w-6 md:h-6" alt="Home" />
      </NavLink>

      <NavLink
        to="/explore"
        className="icon-button"
        activeClassName="active"
        aria-label="Explore"
        data-tooltip="Explore"
      >
        <img src={compass} className="w-5 h-5 md:w-6 md:h-6" alt="Explore" />
      </NavLink>

      <NavLink
        to="/gifs"
        className="icon-button"
        activeClassName="active"
        aria-label="GIFs"
        data-tooltip="GIFs"
      >
        <Film className="w-5 h-5 md:w-6 md:h-6" />
      </NavLink>

      <NavLink
        to="/upload"
        className="icon-button"
        activeClassName="active"
        aria-label="Upload"
        data-tooltip="Upload"
      >
        <img src={upload} className="w-5 h-5 md:w-6 md:h-6" alt="Upload" />
      </NavLink>

      <NavLink
        to="/leaderboard"
        className="icon-button"
        activeClassName="active"
        aria-label="Leaderboard"
        data-tooltip="Leaderboard"
      >
        <img src={podium} className="w-5 h-5 md:w-6 md:h-6" alt="Leaderboard" />
      </NavLink>

      <button
        onClick={toggleDarkMode}
        className={`p-2 md:p-3 rounded-full transition-transform duration-200 ${
          darkMode
            ? "border-2 border-blue-400 text-blue-400"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        aria-label="Toggle dark mode"
        data-tooltip={darkMode ? "Light Mode" : "Dark Mode"}
      >
        {darkMode ? (
          <Sun className="w-5 h-5 md:w-6 md:h-6" />
        ) : (
          <Moon className="w-5 h-5 md:w-6 md:h-6" />
        )}
      </button>

      {userr ? (
        <>
          <NavLink
            to="/profile"
            className="icon-button"
            activeClassName="active"
            aria-label="Profile"
            data-tooltip="Profile"
          >
            <img src={profile} className="w-5 h-5 md:w-6 md:h-6" alt="Profile" />
          </NavLink>
          <button
            onClick={handleLogout}
            className="icon-button"
            aria-label="Logout"
            data-tooltip="Logout"
          >
            <LogOut className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
          </button>
        </>
      ) : (
        <NavLink
          to="/login"
          className="icon-button"
          activeClassName="active"
          aria-label="Login"
          data-tooltip="Login"
        >
          <LogIn className="w-5 h-5 md:w-6 md:h-6" />
        </NavLink>
      )}

      <style>{`
        .icon-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: transform 0.2s ease-in-out;
        }

        .icon-button:hover img,
        .icon-button:hover svg {
          transform: scale(1.1);
          transition: transform 0.2s ease-in-out;
        }

        .active {
          background-color: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
        }

        @media (min-width: 768px) {
          .icon-button {
            width: 50px;
            height: 50px;
          }

          .icon-button[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 8px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
          }

          .icon-button:hover::after {
            opacity: 1;
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
}