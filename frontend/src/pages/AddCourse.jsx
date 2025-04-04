import React, { useRef, useState } from 'react';
import './AddCourse.css';
import useLogin from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

function AddCourse() {
    const cnameref = useRef(null);
    const facref = useRef(null);
    const subjectref = useRef(null);
    const descref = useRef(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [checking, userid, islogged, admin] = useLogin();
    const navigate = useNavigate();

    if (!checking && !admin) {
        navigate('/');
    }

    // Handle file selection
    const handleFileChange = (event) => {
        setThumbnail(event.target.files[0]); // Store the selected file
    };

    async function addCourse() {
        const formData = new FormData();
        formData.append('cname', cnameref.current.value);
        formData.append('category', subjectref.current.value);
        formData.append('faculty', facref.current.value);
        formData.append('description', descref.current.value);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail); // Append image file
        }

        try {
            const response = await fetch('/api/addcourse', {
                method: 'POST',
                body: formData, // Send as multipart/form-data
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error adding course:', error);
        }
    }

    return (
        <div className="inputform">
            <h1>Create Course</h1>
            <input ref={cnameref} type="text" placeholder="Course Name" />
            <input ref={facref} type="text" placeholder="Faculty Name" />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {thumbnail && <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail Preview" width="100" />}
            <select ref={subjectref}>
                <option value="">Select Course Subject</option>
                <option value="technology">Technology & IT</option>
                <option value="business">Business & Management</option>
                <option value="science">Science & Engineering</option>
                <option value="arts">Arts & Humanities</option>
                <option value="design">Design & Creativity</option>
                <option value="health">Health & Medicine</option>
                <option value="finance">Finance & Accounting</option>
                <option value="personal_dev">Personal Development</option>
            </select>
            <textarea ref={descref} rows={5} placeholder="Course Description"></textarea>
            <button onClick={addCourse}>Submit</button>
        </div>
    );
}

export default AddCourse;
