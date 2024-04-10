import React, { useState, useEffect } from 'react';
import { Link,useNavigate ,useParams } from 'react-router-dom';
import { CONFIGS } from '../../../config';
import './blogbyuser.css'; // Import the CSS file
import { FaUserAlt } from 'react-icons/fa';
import { IoReturnDownBackOutline } from 'react-icons/io5';
// import { Link, , useParams } from 'react-router-dom';

function Blogbyuser() {
  const { username } = useParams(); // Get the username from the URL params
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch blogs by the user from the backend
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/api/blog/${username}/blogbyuser`);
        if (response.ok) {
          const data = await response.json();
          console.log('>>>>>>>>>>>>>>>>>>>>', data);
          setBlogs(data);
        } else {
          console.error('Failed to fetch blogs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs(); // Call the fetchBlogs function when the component mounts
  }, [username]); // Re-run the effect when the username changes

  return (
    <>



<div className="dashboard_admin">

    <h1 className='text-center blog_user'><FaUserAlt className="user_pfp"/> {username}</h1>
  
</div>


    <div className="container">

    <div className="blogbyuser_container p-4 m-3">
      <div className="row">
        {blogs.length > 0 ? (
          blogs.map(blog => (
            <div key={blog._id} className="col-md-4 mb-3">
               <Link to={`/blog/${blog._id}`} className="">
                
              <div className="blog-card text-center">
                <img src={blog.cover_img} alt={blog.title}  />
                <h1 className="blog-title text-center">{blog.title}</h1>
              </div>
               </Link>
            </div>
          ))
        ) : (
          <p className="text-center">No blogs found for {username}</p>
        )}
      </div>
    </div>
    </div>
        </>
  );
}

export default Blogbyuser;
