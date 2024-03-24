import React, { useState, useEffect } from 'react';
import './post.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function Post() {
  const { user, approvedblog, API_BASE_URL } = useAuth();
  const [likedPosts, setLikedPosts] = useState([]);
  const [totalComments, setTotalComments] = useState({});
  const [totalLikes, setTotalLikes] = useState({});

  const totalcmts = async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}api/comment/${blogId}/count`);
      const responseData = await response.json();
      setTotalComments((prevTotalComments) => ({
        ...prevTotalComments,
        [blogId]: responseData.count
      }));
    } catch (error) {
      console.log('Error getting total comments:', error);
    }
  };

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/like/${user._id}/liked`);
        const data = await response.json();
        const likedPostIds = data.map(like => like.blog);
        setLikedPosts(likedPostIds);
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };

    fetchLikedPosts();
  }, [user._id, API_BASE_URL]);



  const like = async (blogId, liked) => {
    try {
      await fetch(`${API_BASE_URL}api/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blog: blogId, user: user._id, liked }),
      });
      // Refresh liked posts after like/dislike
      const updatedLikedPosts = liked ? [...likedPosts, blogId] : likedPosts.filter(id => id !== blogId);
      setLikedPosts(updatedLikedPosts);
    } catch (error) {
      console.log('Error liking post:', error);
    }
  };

  useEffect(() => {
    approvedblog.forEach((post) => {
      totalcmts(post._id);
    });
  }, [approvedblog]);

  useEffect(() => {
    approvedblog.forEach((post) => {
      const blogId = post._id;
      const fetchTotalLikes = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}api/like/totallike`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ blog: blogId }),
          });
          const responseData = await response.json();
          setTotalLikes((prevTotalLikes) => ({
            ...prevTotalLikes,
            [blogId]: responseData.totalLikes
          }));
          // Check if the user liked the post and add to likedPosts array if liked
          if (responseData.userLiked) {
            setLikedPosts(prevLikedPosts => [...prevLikedPosts, blogId]);
          }
        } catch (error) {
          console.log('Error fetching total likes:', error);
        }
      };
      fetchTotalLikes();
    });
  }, [approvedblog,likedPosts]);

  return (
    <>
      <div className="row blogrow">
        {approvedblog &&
          approvedblog.map((post, index) => {
            const { _id, title, author_id, cover_img, content, tags, createdAt } = post;
            const sanitizedContent = DOMPurify.sanitize(content);
            const totalcmt = totalComments[_id] || 0;
            const totalLike = totalLikes[_id] || 0;
            const isLiked = likedPosts.includes(_id);

            return (
              <div data-aos="fade-up" className="maincontainer col-md-3" key={index}>
                <div className="postcontainer m-3">
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
                    <div className="like_cmt text-center">
                      {isLiked ? (
                        <>
                          <p className='post_like m-2'> {totalLike} Likes</p>
                          <AiFillHeart size={25} className="post_like" color="red" onClick={() => like(_id, false)} />
                        </>
                      ) : (
                        <>
                          <p className='post_like m-2'> {totalLike} Likes</p>
                          <AiFillHeart size={25} className="post_like" color="black" onClick={() => like(_id, true)} />
                        </>
                      )}
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

export default Post;
