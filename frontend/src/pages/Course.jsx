import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Video.css'

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
    <>
    
    <h1 className='head1'> Course</h1>

    <div className="videoflex">
    {
      videos.map((video)=>{
        return <div onClick={()=>navigate("/video/"+cid+"/"+video._id)}>{video.title}</div>
      })
    }
      
    </div>

    
    </>
  )
}

export default Course