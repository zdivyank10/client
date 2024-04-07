import React, { useState, useEffect } from 'react';
import './post.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { formatDistanceToNow } from 'date-fns';

function Post() {
  const { user, approvedblog } = useAuth();
  const [likedPosts, setLikedPosts] = useState([]);
  const [totalComments, setTotalComments] = useState({});
  const [totalLikes, setTotalLikes] = useState({});
  const navigate = useNavigate();

  const totalcmts = async (blogId) => {
    try {
      const response = await fetch(`https://server-2ei1.onrender.com/api/comment/${blogId}/count`);
      const responseData = await response.json();
      setTotalComments((prevTotalComments) => ({
        ...prevTotalComments,
        [blogId]: responseData.count,
      }));
    } catch (error) {
      console.log('Error getting total comments:', error);
    }
  };

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`https://server-2ei1.onrender.com/api/like/${user._id}/liked`);
        const data = await response.json();
        console.log('user liked data:', data);

        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [data];

        const likedPostIds = dataArray.map((like) => like.blog);
        console.log(likedPostIds);
        setLikedPosts(likedPostIds);
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };

    fetchLikedPosts();
  }, [user._id]);

  const like = async (blogId, liked) => {
    if (!user) {
      // If user is not logged in, prompt them to log in or redirect to login page
      toast.error('Login First to do Like', {
        style: {
          background: '#212121',
          color: 'white',
        },
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/login');
      return;
    }
    try {
      await fetch(`https://server-2ei1.onrender.com/api/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blog: blogId, user: user._id, liked }),
      });
      // Refresh liked posts after like/dislike
      const updatedLikedPosts = liked
        ? [...likedPosts, blogId]
        : likedPosts.filter((id) => id !== blogId);
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
          const response = await fetch(`https://server-2ei1.onrender.com/api/like/totallike`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blog: blogId }),
          });
          const responseData = await response.json();
          setTotalLikes((prevTotalLikes) => ({
            ...prevTotalLikes,
            [blogId]: responseData.totalLikes,
          }));
          // Check if the user liked the post and add to likedPosts array if liked
          if (responseData.userLiked) {
            setLikedPosts((prevLikedPosts) => [...prevLikedPosts, blogId]);
          }
        } catch (error) {
          console.log('Error fetching total likes:', error);
        }
      };
      fetchTotalLikes();
    });
  }, [approvedblog, likedPosts]);

  const formatDate1 = (dateString) => {
    const date1 = new Date(dateString);
    return formatDistanceToNow(date1, { addSuffix: true });
};
  return (
    <>
      <div className="blogrow">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 4 }}>
          <Masonry columnsCount={3}>
            {approvedblog &&
              approvedblog.map((post, index) => {
                const { _id, title, author_id, cover_img, content, tags, createdAt } = post;
                const sanitizedContent = DOMPurify.sanitize(content);
                const totalcmt = totalComments[_id] || 0;
                const totalLike = totalLikes[_id] || 0;
                const isLiked = likedPosts.includes(_id);

                return (
                  <div data-aos="fade-up" className="maincontainer small-width-post" key={index}>
                    <div className="postcontainer">
                      <Link to={`/blog/${_id}`} className="postimg">
                        <img src={`https://server-2ei1.onrender.com/uploads/${cover_img}`} height={200} className="banner_img" alt="Cover Image" />
                      </Link>

                      <Link to={`/blog/${_id}`} className="postuserinfo">
                        <FaUserAlt className="userpfp" />
                        <div className="info">
                          <p>{author_id?.username}</p>
                          <p className="blogdate">{formatDate1(createdAt)}</p>
                          {/* <p className="blogdate">{createdAt}</p> */}
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
                              <p className="post_like m-2"> {totalLike} Likes</p>
                              <AiFillHeart size={25} className="post_like" color="red" onClick={() => like(_id, false)} />
                            </>
                          ) : (
                            <>
                              <p className="post_like m-2"> {totalLike} Likes</p>
                              <AiFillHeart size={25} className="post_like" color="black" onClick={() => like(_id, true)} />
                            </>
                          )}
                          <Link to={`/blog/${_id}`}>
                            <div className="post_cmt">
                              <p>
                                {totalcmt}
                                <AiFillMessage size={25} />
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </>
  );
}

export default Post;
