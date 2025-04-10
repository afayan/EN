import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Info.css';

function Info() {
  const { cid } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics/${cid}`);
        const data = await res.json();
        setAnalytics(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [cid]);

  if (loading) return <div className="info-container">Loading...</div>;

  if (!analytics) return <div className="info-container">No analytics available.</div>;

  return (
    <div className="info-container">
      <h2>Course Analytics</h2>
      <p><strong>Likes:</strong> {analytics.likes}</p>
      <p><strong>Dislikes:</strong> {analytics.dislikes}</p>
      <p><strong>Completions:</strong> {analytics.completions}</p>
      <p><strong>Comments:</strong> {analytics.comments ?? analytics.completions}</p>

      {analytics.perVideo?.length > 0 && (
        <>
          <h3>Per Video Stats</h3>
          <div className="video-stats-grid">
            {analytics.perVideo.map(video => (
              <div key={video.videoId} className="video-card" onClick={()=>navigate('/video/'+cid+'/'+video.videoId)}>
                <h4>{video.title}</h4>
                <p><strong>Likes:</strong> {video.likes}</p>
                <p><strong>Dislikes:</strong> {video.dislikes}</p>
                <p><strong>Completions:</strong> {video.completions}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Info;
