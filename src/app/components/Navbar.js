import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Menu, X, LogOut, Heart, Edit, Upload, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useUser } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router=useRouter()
  const { darkMode, toggleDarkMode } = useTheme();
  const { userr,setUserr , setLoggedIn} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLoggedIn(false);
      setUserr(null);
      router.push('/');
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 shadow-md transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                MemeVerse
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
                darkMode ? 'hover:bg-blue-600' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/explore" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
                darkMode ? 'hover:bg-blue-600' : ''
              }`}
            >
              Explore
            </Link>
            <Link 
              href="/upload" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
                darkMode ? 'hover:bg-blue-600' : ''
              }`}
            >
              Upload
            </Link>
            <Link 
              href="/leaderboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
                darkMode ? 'hover:bg-blue-600' : ''
              }`}
            >
              LeaderBoard
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button>
            
            {userr ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500">
                    <img 
                    loading='lazy'
                      src={userr.photoURL || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {userr.displayName || 'Profile'}
                  </span>
                </button>
                
                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                    darkMode ? 'bg-gray-700' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                    <Link
                      href="/profile"
                      className={`flex items-center px-4 py-2 text-sm ${
                        darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex w-full items-center px-4 py-2 text-sm text-red-500 ${
                        darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Login
              </Link>
            )}
            
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className={`px-2 pt-2 pb-3 space-y-1 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                darkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-gray-900 hover:bg-gray-200'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                darkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-gray-900 hover:bg-gray-200'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/upload"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                darkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-gray-900 hover:bg-gray-200'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
            <Link
              href="/leaderboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                darkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-gray-900 hover:bg-gray-200'
              }`}
              onClick={() => setIsOpen(false)}
            >
              LeaderBoard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}