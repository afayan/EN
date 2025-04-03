import React, { useEffect, useState } from 'react'
import useLogin from '../hooks/useLogin'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'


function Dashboard() {

  const [checking, userid, islogged, admin] = useLogin()

  const [courseProg, setCourseProgs] = useState([])
  const [mycourses, setMycourses] = useState([])
  const [morecourses, setmorecourses] = useState([])
  const [dloading, setdloading] = useState(true)
  const [popularCourses, setPC] = useState([])
  const [interestedCourses, setIC] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()
  const [isadmin, setisadmin] = useState(false)

  if (!checking && !islogged) {

    if (admin) {
      alert("admin")
    }

    alert("Not logged")
  }


  useEffect(()=>{

    if (!checking) {

      if (userid?.admin) {
        // alert("admin")
        setisadmin(true)

        console.log("its an admin");
        
      }
  
      // alert("Not logged")
    }
  


    if (sessionStorage.getItem('auth')){
      
      getcourses()
      getDashboardInfo(userid)

      console.log("user",userid, checking);
      
    }

    async function getcourses(){
      const r1 = await fetch('/api/showmycourses', {
        method: 'post',
        headers : {
          'Content-type' : 'application/json'
        },

        body: JSON.stringify({
          userid : JSON.parse(sessionStorage.getItem('auth'))._id,
          admin : isadmin
        })
      })

      const d1 = await r1.json()

      console.log(d1);
      setMycourses(d1.courses)

      const r2 = await fetch('/api/allcourses')
      const d2 = await r2.json()

      console.log(d2);
      setmorecourses(d2.courses)
      
    }


    async function getDashboardInfo(user) {
      try {
          const response = await fetch('/api/getdashboardinfo', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ user })
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log('Dashboard Info:', data);

          setPC(data?.popularCourses)
          setIC(data?.interestedCourses)

      } catch (error) {
          console.error('Error fetching dashboard info:', error);
      }
  }
  
    

  }, [userid])


  async function enroll(C_id) {

    const r1 = await fetch('/api/enroll', {
      method: 'post',
      headers : {
        'Content-type' : 'application/json'
      },

      body: JSON.stringify({
        userid : JSON.parse(sessionStorage.getItem('auth'))._id,
        courseid : C_id
      })
    })

    const d1 = await r1.json()

    console.log(d1);
    
  }

  async function search(e) {

    const q = e.target.value

    // console.log(q);

    if (q.trim() == '' ) {
      setSearchResults([])
    }

    // console.log(!q);
    

    
    const r1 = await fetch('/api/search/'+q)

    const d1 = await r1.json()

    // console.log(d1);
    setSearchResults(d1)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-profile" onClick={()=>navigate('/profile')}>
          <span className="username">My Profile</span>
          <div className="avatar-placeholder"></div>
        </div>
      </header>


      <input type="text" placeholder='search courses' className='searchbar' onChange={(e)=>search(e)}/>

      {
        
       searchResults.length ? <div className="searchresults">
        {searchResults.map((s)=>{
          return <div key={s.cname} className='result'>{s.cname}</div>
        })}
      </div> : <></>

      }

      <section className="charts-section">

        <span>

        <h2>Popular Courses</h2>
        <div className="charts-container">
          {popularCourses.map(course => (
            <div key={course.id} className="chart-item">
              {/* <div className="chart-circle">
                <div className="chart-value">{course.title}%</div>
              </div> */}
              <p className="chart-title">{course.cname}</p>
            </div>
          ))}
        </div>
        </span>


        <span>

          <h2>Interested courses</h2>
        <div className="charts-container">
          {interestedCourses.map(course => (
            <div key={course.id} className="chart-item">
              {/* <div className="chart-circle">
                <div className="chart-value">{course.title}%</div>
              </div> */}
              <p className="chart-title">{course.cname}</p>
            </div>
          ))}
        </div>
        </span>

        <span>
         {isadmin && <button onClick={()=>navigate('/addcourse')}>Add course</button>}
         {isadmin && <button onClick={()=>navigate('/upload')}>Upload</button>}

        </span>

      </section>

      <section className="my-courses-section">
        <h2>My Courses</h2>
        <div className="courses-container">
          {mycourses.map(course => (
            <div onClick={()=>navigate('/course/'+ course._id)} key={course._id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.cname} />
                <div className="progress-bar">
                  {/* <div 
                    className="progress-fill" 
                    style={{ width: `${course.completionRate}%` }}>
                  </div> */}
                </div>
              </div>
              <div className="course-info">
                <h3>{course.title}</h3>
                <p className="instructor">Instructor: {course.faculty}</p>
                <p className="completion">Completion: {course.completionRate}%</p>
                <button className="continue-btn">Continue Learning</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="more-courses-section">
        <h2>More Courses</h2>
        <div className="courses-container">
          {morecourses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.cname} />
                <div className="rating">★ {course.rating}</div>
              </div>
              <div className="course-info">
                <h3>{course.cname}</h3>
                <p className="instructor">Instructor: {course.faculty}</p>
                <p className="rating-text">Rating: {course.rating}/5.0</p>
                <button className="enroll-btn" onClick={()=>enroll(course._id)}>Enroll Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>© 2025 Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard
