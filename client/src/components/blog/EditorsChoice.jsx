import React, { useState, useEffect } from 'react';
import './post.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaThumbsDown, FaThumbsUp, FaUserAlt } from 'react-icons/fa';
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function EditorsChoice() {
  const { approvedblog, AuthorizationToken, API_BASE_URL, getApprovedBlogs } = useAuth();
  const [choice, setChoice] = useState([]);
 

  useEffect(() => {
      getApprovedBlogs();
      getChoice(); // Fetch editor's choice blogs
  }, []);

  useEffect(() => {
      console.log('choice blog:', choice); // Log choice when it changes
  }, [choice]); // Run this effect whenever choice changes

  const getChoice = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}api/admin/alreadychoice`, {
            method: "GET",
            headers: {
                Authorization: AuthorizationToken
            }
        });
        const edtrchoice = await response.json();
        setChoice(edtrchoice);
        console.log('choice blog:', edtrchoice);
        console.log('choice blog:', choice);
    } catch (error) {
        console.log('Error getting Choice', error);
    }
}

  const [likedPosts, setLikedPosts] = useState([]);
  const [totalComments, setTotalComments] = useState({});

  const totalcmts = async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}api/comment/${blogId}/count`, {
        method: "GET"
      });
      const responseData = await response.json();
      setTotalComments((prevTotalComments) => ({
        ...prevTotalComments,
        [blogId]: responseData.count // Store count in an object with blogId as key
      }));
    } catch (error) {
      console.log('Error getting total comments:', error);
    }
  };

  useEffect(() => {
    // Iterate through each approved blog post and fetch total comments
    approvedblog.forEach((post) => {
      totalcmts(post._id);
    });
  }, [approvedblog]); // Fetch comments whenever approvedblog changes

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
          <h1 className='text-center'>Editor's Choice</h1>
        {choice &&
          choice.map((post, index) => {
            const { _id, title, author_id, cover_img, content, tags, createdAt, username } = post;
            const sanitizedContent = DOMPurify.sanitize(content);
            const isLiked = likedPosts.includes(_id);
            const totalcmt = totalComments[_id] || 0; // Get total comments count from totalComments object

            return (
                <div data-aos="fade-up" className="maincontainer col-md-3" key={index}>
                <div className="postcontainer text-center m-3">
                  <Link to={`/blog/${_id}`} className="postimg">
                    <img src={`${API_BASE_URL}uploads/${cover_img}`} height={200} className="banner_img" alt="Cover Image" />
                  </Link>

                  <Link to={`/blog/${_id}`} className="postuserinfo">
                    <FaUserAlt className="userpfp" />
                    <div className="info">
                      <p>{author_id?.username}</p>
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
                    <div className="like_cmt text-center" onClick={() => toggleLike(_id)}>
                      {isLiked ? (
                        <AiFillHeart size={25} className="post_like" color="red" />
                      ) : (
                        <AiFillHeart size={25} className="post_like text-dark" />
                      )}
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                      <Link to={`/blog/${_id}`}>
                        <div className='post_cmt'>
                          <p>
                            {totalcmt}<AiFillMessage size={25} />
                          </p>
                        </div>

                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default EditorsChoice;
