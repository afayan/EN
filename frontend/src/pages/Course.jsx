import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Course.css'
import { FaPlay, FaCheckCircle, FaClock, FaHourglassHalf } from 'react-icons/fa'

function Course() {

  const {cid} = useParams()
  const [videos, setvideos] = useState([])
  const navigate = useNavigate()

    useEffect(()=>{

    if (!cid) {
      return 
    }

    getVideos(cid)

    async function getVideos(cid) {
      console.log(cid);
      
      const resp = await fetch('/api/getvideos/'+cid)
      const data = await resp.json()
      console.log(data["videos"]);
      
      setvideos(data["videos"])
    } 



  }, [cid])

  // <Route path='/video/:course/:video' element={<VideoPage/>}/>


  return (
    <div className="course-container">
      <div className="course-header">
        <h1>Course Videos</h1>
        <p>Watch and learn at your own pace. Click on any video to start learning.</p>
      </div>

      <div className="video-grid">
        {videos.map((video) => {
          // Determine video status (placeholder - you would need to implement actual status logic)
          const videoStatus = video.completed ? 'completed' : 'not-started';
          
          return (
            <div 
              className="video-card" 
              key={video._id}
              onClick={() => navigate("/video/" + cid + "/" + video._id)}
            >
              <div className="video-thumbnail">
                {/* Placeholder for video thumbnail - you can replace with actual thumbnails if available */}
                <div 
                  style={{
                    backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16),
                    width: '100%',
                    height: '100%',
                    opacity: 0.7
                  }}
                ></div>
                <div className="play-icon">
                  <FaPlay />
                </div>
              </div>
              
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                  <div className="video-duration">
                    <FaClock /> {video.duration || '10:00'}
                  </div>
                  
                  <div className="video-status">
                    {videoStatus === 'completed' ? (
                      <><FaCheckCircle className="completed" /> Completed</>
                    ) : videoStatus === 'in-progress' ? (
                      <><FaHourglassHalf className="in-progress" /> In Progress</>
                    ) : (
                      <><FaClock className="not-started" /> Not Started</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Course