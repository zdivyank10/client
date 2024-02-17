import React, { useState, useEffect } from 'react';
import "./post.css";
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";

function Singlepost({ postId }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/blog/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const postData = await response.json();
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const { cover_img, author_id, createdAt, title, content, tags } = post;
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <>
      <div data-aos="fade-up" className="postcontainer col-md-3">
        <div className="postimg">
          <img src={`http://localhost:8000/uploads/${cover_img}`} height={200} className='banner_img' alt="Cover Image" />
        </div>

        <div className="postuserinfo">
          <FaUserAlt className='userpfp' />
          <div className="info">
            <p>{author_id}</p>
            <p className='blogdate'>{createdAt}</p>
          </div>
        </div>
        <hr />

        <div className="blogcontent">
          <h2>{title}</h2>
          <div className='content' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          <div className="tags">
            {tags.map((tag, tagIndex) => (
              <span key={tagIndex} className="tag"> {tag} </span>
            ))}
          </div>
          <hr />
        </div>
        <div className="actions">
          <button className="like-button">Like</button>
          <button className="comment-button">Comment</button>
        </div>
      </div>
    </>
  );
}

export default Singlepost;
