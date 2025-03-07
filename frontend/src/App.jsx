
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Home from  './pages/Home'
import Explore from  './pages/Explore'
import Profile from  './pages/Profile'
import Login from  './pages/Login'
import Signup from  './pages/Signup'
import Upload from  './pages/Upload'
import Not_Found from  './pages/Not_Found'
import MemeId from  './pages/MemeId'
import LeaderBoard from  './pages/LeaderBoard'
import GifsOnly from './pages/GifsOnly'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/gifs" element={<GifsOnly />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/meme/:id" element={<MemeId />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="*" element={<Not_Found />} />
      </Routes>
    </>
  )
}

export default App
