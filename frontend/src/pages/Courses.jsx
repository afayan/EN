import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'

function Courses() {

  const [courses, setCourses] = useState([])
  const [searchResults, setSearchResults] = useState([])
  
  const navigate = useNavigate()
  async function getAllCourses() {
    const r2 = await fetch('/api/allcourses')
    const d2 = await r2.json()

    console.log(d2);
    
    setCourses(d2.courses)
  }


  useEffect(()=>{
    getAllCourses()
  }, [])

  async function search(e) {

    const q = e.target.value

    // console.log(q);

    if (q.trim() == '' ) {
      setSearchResults([])
    }

    // console.log(!q);
    

    
    const r1 = await fetch('/api/search/'+q)

    const d1 = await r1.json()

    console.log(d1);
    setSearchResults(d1)
    setCourses(d1)
  }

  async function filter(query) {
    
    const r1 = await fetch('/api/search/'+query)

    const d1 = await r1.json()

    console.log(d1);
    setCourses(d1)
  }


  return (
    <div className='dashboard'>

<header className="dashboard-header">
  <h1>EduNite</h1>

  <div className="header-right">    
    <div className="user-profile">
      <span className="contactus" onClick={() => navigate('/dashboard')}>Dashboard</span>
      <span className="aboutus" onClick={() => navigate('/About')}>About Us</span>
      <span className="contactus" onClick={() => navigate('/Contact')}>Contact Us</span>
      <span className="username" onClick={() => navigate('/profile')}>My Profile</span>
    </div>
  </div>
</header>

      <input type="text" placeholder='search courses' className='searchbar' onChange={(e)=>search(e)}/>

      {
        
        searchResults.length ? <div className="searchresults">
         {searchResults.map((s)=>{
           return <div key={s.cname} onClick={()=>navigate('/description/'+s._id)} className='result'>{s.cname}</div>
         })}
       </div> : <></>
 
       }

       <section className='filters'>
                <div className='filterbutton' onClick={()=>getAllCourses()} id="all">All</div>
                <div className='filterbutton' onClick={()=>filter('technology')} id="technology">Technology & IT</div>
                <div className='filterbutton' onClick={()=>filter("business")} id="business">Business & Management</div>
                <div className='filterbutton' onClick={()=>filter("science")} id="science">Science & Engineering</div>
                <div className='filterbutton' onClick={()=>filter("arts")} id="arts">Arts & Humanities</div>
                <div className='filterbutton' onClick={()=>filter("design")} id="design">Design & Creativity</div>
                <div className='filterbutton' onClick={()=>filter("health")} id="health">Health & Medicine</div>
                <div className='filterbutton' onClick={()=>filter("finance")} id="finance">Finance & Accounting</div>
                <div className='filterbutton' onClick={()=>filter("personal_dev")} id="personal_dev">Personal Development</div>
       </section>


      <section className="more-courses-section">
        <h2>More Courses</h2>
        <div className="courses-container">
          {courses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-image">
              <img src={course?.image} alt={course.cname} />
              <div className="rating">★ {course.rating}</div>
              </div>
              <div className="course-info">
                <h3>{course.cname}</h3>
                <p className="instructor">Instructor: {course.faculty}</p>
                <p className="rating-text">Rating: {course.rating}/5.0</p>
                <button className="enroll-btn" onClick={() => navigate('/description/' + course._id)}>Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Courses