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
import Description from './pages/Description'
import Landing2 from './pages/Landing2'
import About from './pages/About'
import Contact from './pages/Contact'
import Dummy from './pages/Dummy'
import Courses from './pages/Courses'
import Info from './pages/Info'
import FloatingChatWidget from './components/chatbot/FloatingChatWidget'
import QuizGenerator from './components/chatbot/QuizGenerator'
// import CoursePage from './pages/Description'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <FloatingChatWidget />

      <Routes>
      <Route path='*' element={<Landing2/>} />
      <Route path='/' element={<Landing2/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/landing' element={<Landing2/>} />
      <Route path='/video/:course/:video' element={<VideoPage/>}/>
      <Route path='/profile' element={<ProfilePage/>} />
      <Route path='/addcourse' element={<AddCourse/>} />
      <Route path='/upload' element={<Upload/>} />
      <Route path='/course/:cid' element={<Course/>} />
      <Route path='admin' element={<AdminLogin/>} />
      <Route path='/description/:cid' element={<Description/>}/>
      <Route path='/about' element={<About/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/courses' element={<Courses/>} />
      <Route path='/info/:cid' element={<Info/>} />
      </Routes>
    </>
  )
}

export default App
