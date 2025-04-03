import React, { useEffect, useRef, useState } from 'react'
import './Video.css'

function Upload() {

  //take video name
  //take video file
  //take course

  const [video, setVideo] = useState(null)
  const [videoUrl, setVideoURL] = useState("")
  const [courses, setCourses] = useState([])
  const courseref = useRef()
  const titleref = useRef()
  const descref = useRef()
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{

    getCourses()

    async function getCourses() {
      const res = await fetch('/api/allcourses')
      const data = await res.json()

      console.log(data);
      setCourses(data.courses)
    }

  }, [])

  async function handleUpload(e) {
    setUploading(true)
    e.preventDefault()

    const courseid = courseref.current.value
    const title = titleref.current.value
    const description = descref.current.value

    if (!courseid || !title) {
      setUploading(false)
      return alert("Pls fill all fields")
    }

    const formdata = new FormData()
    formdata.append("video", video)
    formdata.append("courseid", courseid)
    formdata.append("title", title)
    formdata.append('description', description)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formdata,
      });

      const data = await response.json();
      if (data.success) {
        // setVideoUrl(data.url);
        console.log(data.url);
        setUploading(false)
        
      }
    } catch (err) {
      console.error("Error uploading video:", err);
      setUploading(false)
    }

  }


  return (
    <>
    <div className="uploadvideoform">
      <h1>Upload</h1>
      <input ref={titleref} type="text" placeholder='file name' />
      <input type="file" accept='video/*' onChange={(e) => setVideo(e.target.files[0])}/>

      <select ref={courseref}>
        <option value="">select a course</option>
        {
          courses.map((c) => {
            return <option key={c._id} value={c._id}>{c.cname}</option>
          })
        }
      </select>

        <textarea name="" ref={descref} id=""></textarea>

      <button onClick={handleUpload}>Upload</button>

    </div>

    {
      uploading && <p className='messagebox'>Loading</p>
    }
    </>
  )
}

export default Upload