import React, { useState } from 'react';
import './post.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaThumbsDown, FaThumbsUp, FaUserAlt } from 'react-icons/fa';
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function Post() {
  const { approvedblog } = useAuth();
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (postId) => {
    setLikedPosts((prevLikedPosts) => {
      if (prevLikedPosts.includes(postId)) {
        return prevLikedPosts.filter((id) => id !== postId);
      } else {
        return [...prevLikedPosts, postId];
      }
    });
  };

  return (
    <>
      <div className="row blogrow">
        {approvedblog &&
          approvedblog.map((post, index) => {
            const { _id, title, author_id, cover_img, content, tags, createdAt, username } = post;
            const sanitizedContent = DOMPurify.sanitize(content);
            const isLiked = likedPosts.includes(_id);

            return (
              <div key={index} data-aos="fade-up" className="postcontainer col-md-3">
                <Link to={`/blog/${_id}`} className="postimg">
                  <img src={`http://localhost:8000/uploads/${cover_img}`} height={200} className="banner_img" alt="Cover Image" />
                </Link>

                <Link to={`/blog/${_id}`} className="postuserinfo">
                  <FaUserAlt className="userpfp" />
                  <div className="info">
                    <p>{author_id.username}</p>
                    <p className="blogdate">{createdAt}</p>
                  </div>
                </Link>
                <hr />

                <Link to={`/blog/${_id}`} className="blogcontent">
                  <h2>{title}</h2>
                  <div className="content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                  <div className="tags">
                    {tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <hr />
                </Link>

                <div>
                  <div onClick={() => toggleLike(_id)}>
                    {isLiked ? (
                      <AiFillHeart size={25} className="post_like" color="red" />
                    ) : (
                      <AiFillHeart size={25} color="blue" className="post_like" />
                    )}
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                    {/* <AiFillMessage size={25} className="post_cmt" /> */}
                    <Link to={`/blog/${_id}`}>
                      
                        <AiFillMessage size={25} className='post_cmt' />
                      </Link>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Post;
