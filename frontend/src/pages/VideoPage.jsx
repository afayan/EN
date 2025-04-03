import React, { useEffect, useRef, useState } from "react";
import './VideoContainer.css'
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { SiTicktick } from "react-icons/si";


function VideoPage() {

    const {course, video} = useParams()
    const [comments, setComments] = useState([])
    const [loading, userid, islogged] = useLogin()
    const commentref = useRef()
    const navigate = useNavigate()
    const [vurl, setvurl] = useState(null)
    const [vdata, setvdata] = useState(null)
    const [title, settitle] = useState('Loading')
    const [videos, setvideos] = useState([])
    const [desc, setDesc] = useState('')
    

    useEffect((()=>{

        
        
        if (loading) {
            return
        }

        if (!loading && !islogged) {
            navigate('/login')
            return
        }

        if (!course || !video || !userid.email){
            return
        }
        // console.log(loading, islogged, course, video, userid);

        //work on course and video 
        // addComment(userid._id, video, "I love you")
        getcomments(video)
        getVideodata(video)
        getVideos(course)
        

    }), [course, video, islogged, loading])

    async function getVideos(cid) {
        // console.log(cid);

        if (!cid) {
            return console.log("No course ID")
        }
        
        const resp = await fetch('/api/getvideos/'+cid, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userid._id,
            })
        })
        const data = await resp.json()
        // console.log(data["videos"]);
        
        setvideos(data["videos"])
      } 

    async function getVideodata(video) {

        //need other videos in playlist
        //need data for video
        
        const response = await fetch('/api/video/'+video)
        const data = await response.json()

        // console.log(data);
        
        if (data.status) {
            setvurl(data.data[0].videoUrl)
            console.log(data.data[0]);
            settitle(data.data[0].title)
            setDesc(data.data[0].description)
            
        }

        else{
            navigate('/')
        }

    }


    async function getcomments(video) {
        const result = await fetch('/api/getcomments/'+video)
        const data = await result.json()
        if (data.status) {
            // console.log(data.updateddata);
            
            setComments(data.updateddata)
        }
    }

    async function addComment() {
        if (loading) {
            return
        }

        const user = userid._id
        const comment = commentref.current.value
        // const video = video

        if (!comment.trim()) {
            return
        }
    
        const result = await fetch('/api/addcomment', {
            method : 'post',
            headers : {
                'content-type' : 'Application/json'
            },
            body : JSON.stringify({
                user: user,
                video : video,
                comment : comment
            })
        })


        const data = await result.json()


        // console.log(data);

        commentref.current.value = ''

        getcomments(video)
        
    }
    

    async function handleAction(action) {

        // console.log(userid._id, video, action);
        

        try {
            const response = await fetch('/api/action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: userid._id,
                    video: video,
                    action: action
                })
            });
    
            const data = await response.json();
            console.log('Response:', data);

            getVideos(course)

        } catch (error) {
            console.error('Error:', error);
        }
    }
    


  return (
    <div className="videopage">

    <div className="leftside">

    <h1 className="head1">{title}</h1>

    <div className="videocontainer">
      <video src={vurl} controls></video>
    </div>

    <div className="buttonsdiv">
        <button onClick={()=>handleAction('l')}>Like</button>
        <button onClick={()=>handleAction('c')}>Complete</button>
        <button onClick={()=>handleAction('d')}>Dislike</button>
    </div>

    <p className="desc">
        {desc}
    </p>

    <div className="commentsdiv">

        <button onClick={()=>addComment()}>Post</button>
        <input type="text" name="" id="" ref={commentref}/>

        <div className="commentroll">
        {
            comments.map((c)=>{
                let d = new Date(c.date)
                return <div key={c._id} className="comment"><p>{c.user}</p> {c.comment}
                <p>{d.toDateString()}</p>
                </div>
            })
        }

        </div>

    </div>

    </div>

    <div className="playlistdiv">

        <h1>Others in the playlist</h1>

        {videos.map((v)=>{

            return <div onClick={()=>navigate('/video/' + course+"/" +v._id)} className={"playlistelement "+(v._id == video ? "selected" : '')} key={v.title}><p>{v.title}</p><p>{v.completed?<SiTicktick />
                : ''}</p></div>
        })}
    </div>
    </div>
  );
}

export default VideoPage;
