import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import VideoPage from './pages/VideoPage'
import ProfilePage from './pages/ProfilePage';
import AddCourse from './pages/AddCourse'
import Upload from './pages/Upload'
import Course from './pages/Course'
import AdminLogin from './pages/AdminLogin'
import Dummy from './pages/Dummy'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
      <Route path='*' element={<Landing/>} />
      <Route path='/' element={<Landing/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/landing' element={<Landing/>} />
      <Route path='/video/:course/:video' element={<VideoPage/>}/>
      <Route path='/profile' element={<ProfilePage/>} />
      <Route path='/addcourse' element={<AddCourse/>} />
      <Route path='/upload' element={<Upload/>} />
      <Route path='/course/:cid' element={<Course/>} />
      <Route path='admin' element={<AdminLogin/>} />
      </Routes>
    </>
  )
}

export default App
