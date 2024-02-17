import React, { useState, useEffect } from 'react';
import { FaUserAlt } from "react-icons/fa";
import './fullblog.css';
import { AiFillHeart, AiFillMessage } from "react-icons/ai";
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { IoReturnDownBackOutline } from "react-icons/io5";


function FullBlog() {
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { blog_id } = useParams();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/blog/${blog_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data = await response.json();
        setBlogPost(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [blog_id]);

  console.log(blogPost);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blogPost) {
    return <div>Blog post not found</div>;
  }

  const { author_id,title, cover_img, content, tags, createdAt,username } = blogPost.eachblog;
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <>
    <div className="back text-center mt-5">

    <Link to='/blog' className='btn btn-dark '><IoReturnDownBackOutline size={25} />  Back</Link>
    </div>
    <div className="fullblogcontainer">
      <div className="authorinfo">
        <FaUserAlt className='userpfp'/>
        <p className='authorname'>{author_id}</p>
        <p className='authorname'>{createdAt}</p>
      </div>
      <div className="fullblogtitle">
        <hr />
        <h1>{title}</h1>
      </div>
      <div className="fullblogimg text-center">
        <img src={`http://localhost:8000/uploads/${cover_img}`} alt="" className='fullimg'/>
      </div>
      <div className="fullblogcontent">
        <div className='content' dangerouslySetInnerHTML={{ __html: sanitizedContent }}></div>

            <hr />
        <div className="tags text-center">
          {Array.isArray(tags) && tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
              ))}
              <hr />
        </div>
      </div>
      <div className="actions">
        <AiFillHeart size={25} className='fullblog_like'/>
        <p className='fullblog_likeinfo'>10 likes</p>
        <AiFillMessage size={25} className='fullpost_cmt'/>
      </div>
    </div>
    </>
  );
}

export default FullBlog;
