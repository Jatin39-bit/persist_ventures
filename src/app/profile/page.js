"use client"

import { useRouter } from 'next/navigation';
import React,{ useEffect, useState } from 'react';
import {toast} from 'sonner';
import Link from 'next/link';
import axios from 'axios';
import { Edit, Heart, Clock, ThumbsUp, Share, Save, User } from 'lucide-react';
import { useUser } from '../context/AuthContext';
import { FaComment } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const ProfilePage = ({params}) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('uploaded');
    const [uploadedMemes, setUploadedMemes] = useState([]);
    const [likedMemes, setLikedMemes] = useState([]);
    const {userr, setUserr} = useUser();
    const [name, setName] = useState(userr?.name);
    const [bio, setBio] = useState(userr?.bio);
    const {darkMode} = useTheme();
    

    async function getProfile(){
        try {
            const response= await axios.get(`/api/user/profile`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.status===200){
                setUserr(response.data.user);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    async function handleProfileEdit(){
        try {
            const response= await axios.put(`/api/user/profile`,{
                name,
                bio
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.status===200){
                toast.success(response.data.message);
                getProfile();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    async function getLikedMemes(){
        try {
            const response= await axios.get(`/api/user/liked`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.status===200){
                console.log(response);
                setLikedMemes(response.data.memes);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    async function getUploadedMemes(){
        try {
            const response= await axios.get(`/api/memes/uploaded`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.status===200){
                console.log(response);
                setUploadedMemes(response.data.memes);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
    getProfile();
    getUploadedMemes();
    getLikedMemes()
    }, []);


    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar/>

      <div className={`${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'} mt-4 rounded-lg max-w-6xl mx-auto`}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img 
              loading='lazy'
                src={userr?.avatar? userr.avatar : 'https://picsum.photos/200'} 
                alt={userr?.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600" 
              />
              <button className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold capitalize">{userr?.name}</h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{userr?.bio}</p>
              
              <div className="flex justify-center md:justify-start gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={() => setActiveTab('edit')}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex">
            <button
              className={`flex-1 py-4 font-medium text-center ${
                activeTab === 'uploaded' 
                  ? 'text-indigo-500 border-b-2 border-indigo-500' 
                  : `${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`
              }`}
              onClick={() => setActiveTab('uploaded')}
            >
              My Uploaded Memes
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center ${
                activeTab === 'liked' 
                  ? 'text-indigo-500 border-b-2 border-indigo-500' 
                  : `${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`
              }`}
              onClick={() => setActiveTab('liked')}
            >
              Liked Memes
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center ${
                activeTab === 'edit' 
                  ? 'text-indigo-500 border-b-2 border-indigo-500' 
                  : `${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`
              }`}
              onClick={() => setActiveTab('edit')}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto my-6 px-4">
        {activeTab === 'uploaded' && (
          <div>
            <h2 className="text-xl font-bold mb-4">My Uploaded Memes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedMemes.map(meme => (
                <div key={meme.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                  <div className="relative">
                    <img src={meme.url} alt={meme.name} className="w-full h-64 object-cover" loading='lazy' />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button className={`p-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} rounded-full shadow-md`}>
                        <Edit className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{meme.name}</h3>
                    <div className={`flex justify-between items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(meme.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`flex justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-3`}>
                      <div className="flex space-x-4">
                        <button className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`}>
                          <Heart className="h-5 w-5 mr-1" />
                          {meme.likes}
                        </button>
                        <button className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'}`}>
                          <ThumbsUp className="h-5 w-5 mr-1" />
                          {meme.comments}
                        </button>
                      </div>
                      <div>
                        <button className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>
                          <Share className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Memes You've Liked</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedMemes.map(meme => (
                <div key={meme.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                  <div className="relative">
                    <img src={meme.url} alt={meme.name} className="w-full h-64 object-cover" loading='lazy' />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{meme.name}</h3>
                    <div className={`flex justify-between items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Anonymous
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(meme.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`flex justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-3`}>
                      <div className="flex space-x-4">
                        <button className="flex items-center text-red-500">
                          <Heart className="h-5 w-5 mr-1 fill-current" />
                          {meme.likes}
                        </button>
                        <button className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <FaComment className="h-5 w-5 mr-1" />
                          {meme.comments}
                        </button>
                      </div>
                      <div>
                        <button className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>
                          <Share className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className="text-xl font-bold mb-6">Edit Profile Information</h2>
            
            <form className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center">
                  <img 
                    src={userr?.avatar? userr.avatar : 'https://picsum.photos/200'} 
                    alt={userr?.name} 
                    loading='lazy'
                    className={`w-40 h-40 rounded-full object-cover ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-4 mb-4`} 
                  />
                  <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Change Avatar
                  </button>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <label htmlFor="username" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="username"
                      className={`w-full px-4 py-2 border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                          : 'bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      } rounded-lg`}
                      defaultValue={userr.name}
                      onChange={(e)=>setName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows="4"
                      className={`w-full px-4 py-2 border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                          : 'bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      } rounded-lg`}
                      defaultValue={userr?.bio}
                      onChange={(e)=>setBio(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button 
                      type="button" 
                      className={`px-4 py-2 border ${
                        darkMode 
                          ? 'border-gray-600 hover:bg-gray-700' 
                          : 'border-gray-300 hover:bg-gray-100'
                      } rounded-lg`}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={()=>handleProfileEdit()} 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
    );
};

export default ProfilePage;