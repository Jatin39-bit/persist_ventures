"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, AlertCircle, RefreshCw } from 'lucide-react';

export default function NotFound() {
  const [memeIndex, setMemeIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [bounceHeight, setBounceHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

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
    { alt: "404 Tumbleweed", src: "https://media.giphy.com/media/Az33BHnpnRJYI/giphy.gif" }
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">MemeVerse</Link>
          <div className="flex items-center space-x-4">
            <Link href="/explore" className="text-gray-600 hover:text-indigo-600">Explore</Link>
            <Link href="/create" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Meme</Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-6 flex flex-col items-center relative overflow-hidden">
            <div 
              className="absolute top-4 right-4 bg-white text-indigo-600 font-bold text-2xl rounded-full h-12 w-12 flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ transform: `translateY(${bounceHeight}px)` }}
            >
              404
            </div>
            
            {isExpanded && (
              <div className="absolute top-16 right-4 bg-white text-xs p-2 rounded shadow-md z-10 max-w-xs">
                <p className="text-gray-700">You found the secret! 404 errors happen when a page can't be found on a server.</p>
              </div>
            )}
            
            <div className="relative h-60 w-full flex justify-center items-center p-2">
              <img 
                src={memeVisuals[memeIndex].src}
                alt={memeVisuals[memeIndex].alt}
                loading='lazy'
                className="max-h-full max-w-full object-contain rounded"
              />
            </div>
            
            <button 
              onClick={changeMeme}
              className="absolute bottom-4 right-4 bg-white text-indigo-600 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.5s ease' }}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Meme Not Found</h1>
            
            <p className="text-gray-600 mb-8 min-h-16">
              {funnyMessages[memeIndex % funnyMessages.length]}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/" 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors transform hover:-translate-y-1"
              >
                <Home className="h-5 w-5" />
                Back to Meme HQ
              </Link>
              
              <Link 
                href="/explore" 
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors transform hover:-translate-y-1"
              >
                <Search className="h-5 w-5" />
                Find Dank Memes
              </Link>
            </div>
          </div>
          
          <div className="px-8 pb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fresh memes to cure your disappointment:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((id) => (
                <Link href={`/meme/${id}`} key={id} className="block group">
                  <div className="relative rounded-lg overflow-hidden bg-gray-200 aspect-square">
                    <img 
                      src={`/api/placeholder/150/150`}
                      alt={`Trending meme ${id}`}
                      loading='lazy'
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      <span className="text-white text-opacity-0 group-hover:text-opacity-100 font-medium transition-all">
                        Much Wow
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center max-w-md">
          <p className="text-gray-500 italic cursor-pointer hover:text-indigo-500 transition-colors" onClick={changeMeme}>
            "When one meme URL dies, another is born. Such is the circle of internet life."
          </p>
        </div>
      </div>
      
      <footer className="bg-white shadow-md mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <Link href="/" className="text-xl font-bold text-indigo-600">MemeVerse</Link>
              <p className="text-gray-600 text-sm mt-1">Where memes come to live forever (except this one)</p>
            </div>
            <div className="flex gap-4">
              <Link href="/about" className="text-gray-600 hover:text-indigo-600">About</Link>
              <Link href="/privacy" className="text-gray-600 hover:text-indigo-600">Privacy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-indigo-600">Terms</Link>
              <Link href="/contact" className="text-gray-600 hover:text-indigo-600">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}