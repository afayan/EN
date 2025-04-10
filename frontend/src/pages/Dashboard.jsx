import React, { useEffect, useState } from 'react'
import useLogin from '../hooks/useLogin'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

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
  const [gdata, setgdata] = useState({})

  if (!checking && !islogged) {
    if (admin) {
      alert("admin")
    }
    alert("Not logged")
  }

  useEffect(() => {
    if (!checking) {
      if (userid?.admin) {
        setisadmin(true)
        console.log("its an admin");
      }
    }

    if (sessionStorage.getItem('auth')) {
      getcourses()
      getDashboardInfo(userid)
      fetchSpiderGraphData()
      console.log("user", userid, checking);
    }

    async function getcourses() {
      const authUser = JSON.parse(sessionStorage.getItem('auth'));
      const isUserAdmin = authUser?.admin || false;
      setisadmin(isUserAdmin);

      const r1 = await fetch('/api/showmycourses', {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          userid: authUser._id,
          admin: isUserAdmin
        })
      })

      const d1 = await r1.json()
      setMycourses(d1.courses)

      if (!isUserAdmin) {
        const r2 = await fetch('/api/allcourses')
        const d2 = await r2.json()
        setmorecourses(d2.courses)
      } else {
        setmorecourses(d1.courses)  // admin sees created courses here
      }
    }

    async function fetchSpiderGraphData() {
      try {
        const response = await fetch('/api/graphinfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        setgdata(data)
      } catch (error) {
        console.error('Error fetching spider graph data:', error);
      }
    }

    async function getDashboardInfo(user) {
      try {
        const response = await fetch('/api/getdashboardinfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
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
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        userid: JSON.parse(sessionStorage.getItem('auth'))._id,
        courseid: C_id
      })
    })

    const d1 = await r1.json()
    console.log(d1);
  }

  async function search(e) {
    const q = e.target.value
    if (q.trim() === '') setSearchResults([])
    const r1 = await fetch('/api/search/' + q)
    const d1 = await r1.json()
    setSearchResults(d1)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-right">
          {isadmin && (
            <div className="button-group">
              <button onClick={() => navigate('/addcourse')}>Add Course</button>
              <button onClick={() => navigate('/upload')}>Upload Video</button>
            </div>
          )}
          <div className="user-profile">
            <span className="contactus" onClick={() => navigate('/courses')}>Home</span>
            <span className="aboutus" onClick={() => navigate('/About')}>About Us</span>
            <span className="contactus" onClick={() => navigate('/Contact')}>Contact Us</span>
            <span className="username" onClick={() => navigate('/profile')}>My Profile</span>
          </div>
        </div>
      </header>

      <input type="text" placeholder='search courses' className='searchbar' onChange={(e) => search(e)} />
      {
        searchResults.length > 0 && (
          <div className="searchresults">
            {searchResults.map((s) => (
              <div key={s.cname} onClick={() => navigate('/description/' + s._id)} className='result'>{s.cname}</div>
            ))}
          </div>
        )
      }

      <section className="charts-section">
        <span>
          <h2>Popular Courses</h2>
          <div className="charts-container">
            {popularCourses.map(course => (
              <div key={course._id} className="chart-item" onClick={() => navigate('/description/' + course._id)}>
                <p className="chart-title">{course.cname}</p>
              </div>
            ))}
          </div>
        </span>

        <span>
          <h2>Interested Courses</h2>
          <div className="charts-container">
            {interestedCourses.map(course => (
              <div key={course._id} className="chart-item" onClick={() => navigate('/description/' + course._id)}>
                <p className="chart-title">{course.cname}</p>
              </div>
            ))}
          </div>
        </span>

        <span className='graphdiv'>
          <RadarChart outerRadius={90} width={430} height={250} data={gdata}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 8]} />
            <Radar name="Enrollments" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </span>
      </section>

      {/* My Courses Section - only for non-admins */}
      {!isadmin && (
        <section className="my-courses-section">
          <h2>My Courses</h2>
          <div className="courses-container">
            {mycourses.map(course => (
              <div onClick={() => navigate('/course/' + course._id)} key={course._id} className="course-card">
                <div className="course-image">
                  <img src={course?.image} alt={course.cname} />
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.completion.completionPercentage}%` }}>
                    </div>
                  </div>
                </div>
                <div className="course-info">
                  <h3>{course.cname}</h3>
                  <p className="instructor">Instructor: {course.faculty}</p>
                  <p className="completion">Completion: {course.completion.completionPercentage}%</p>
                  <button className="continue-btn">Continue Learning</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* More Courses / Created Courses Section */}
      <section className="more-courses-section">
        <h2>{isadmin ? "Created Courses" : "More Courses"}</h2>
        <div className="courses-container">
          {morecourses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-image">
                <img src={course?.image} alt={course.cname} />
                <div className="rating">★ {course.rating}</div>
              </div>
              <div className="course-info">
                <h3>{course.cname}</h3>
                <p className="instructor">Instructor: {course.faculty}</p>
                <p className="rating-text">Rating: {course.rating}/5.0</p>
                {!isadmin && (
                  <button className="enroll-btn" onClick={() => navigate('/description/' + course._id)}>Learn More</button>
                )}
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
