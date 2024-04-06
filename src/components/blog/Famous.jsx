import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import './famous.css'; // Import CSS file for custom styles
import Carousel from 'react-bootstrap/Carousel'; // Import the Carousel component
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization

function Famous() {

  const [popularblog, setPopularblog] = useState([]);

  const popular_blogs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}api/like/popular`, {
        method: "GET",
      });
      const data = await response.json();
      setPopularblog(data);
      console.log('Popular blog data:', data);
    } catch (error) {
      console.error('Error fetching popular blogs:', error);
    }
  };

  useEffect(() => {
    popular_blogs();
  }, []);

  return (
    <div className="popular_container">
      <Carousel data-bs-theme="light" className='pop_Carousel'>
        {/* Map over the popularblog state to dynamically render Carousel items */}
        {popularblog.map((blog, index) => (
          <Carousel.Item key={index}>
            <Link to={`/blog/${blog._id}`} className="postuserinfo">
              {/* <div className="darker">
                <img
                  className="d-block w-100 pop_img text-center"
                  src={`${process.env.REACT_APP_API_BASE_URL}uploads/${blog.cover_img}`}
                  alt={blog.title}
                />
              </div> */}
              <div className="img-gradient">
                <img className="pop_img"
                  src={`${process.env.REACT_APP_API_BASE_URL}uploads/${blog.cover_img}`} />
              </div>
              <Carousel.Caption className=' d-block'>
                <h1 className='text-light'>{blog.title}</h1>
                {/* <p className="pop_content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} /> */}
                {blog.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="tag text-dark">
                          {tag}
                        </span>
                      ))}
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Famous;
