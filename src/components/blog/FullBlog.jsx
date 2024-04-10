import React, { useState, useEffect } from 'react';
import { FaUserAlt } from "react-icons/fa";
import './fullblog.css';
import { AiFillHeart, AiFillMessage } from "react-icons/ai";
import { Link, useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { IoReturnDownBackOutline } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteOutline } from "react-icons/md";
import { Modal, Button } from 'react-bootstrap';
import { CONFIGS } from "../../../config";
import { formatDistanceToNow } from 'date-fns';

function FullBlog() {
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [commentToDelete, setCommentToDelete] = useState(null); // Comment to delete
  const [totalComments, setTotalComments] = useState({});
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [totalLikes, setTotalLikes] = useState({});


  const { blog_id } = useParams();
  const { user, AuthorizationToken } = useAuth();
  const navigate = useNavigate();

  // Fetch comments function

  const totalcmts = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/api/comment/${blog_id}/count`, {
        method: "GET"
      });
      const responseData = await response.json();
      console.log(responseData);
      setTotalComments(responseData)
    } catch (error) {
      console.log('Error getting total comments:', error);
    }
  };

  useEffect(() => {
    totalcmts();
  }, [blog_id])


  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/api/like/${blog_id}/${user._id}/liked`);
        if (response.ok) {
          const likedPosts = await response.json();
          // console.log(likedPosts.isLiked);
          setIsLikedByUser(likedPosts.isLiked);
        } else {
          console.error('Failed to fetch liked posts');
        }
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    };

    if (user) {
      fetchLikedPosts();
    }
  }, [user, blog_id, likedPosts]);

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

      await fetch(`${CONFIGS.API_BASE_URL}/api/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blog: blogId, user: user._id, liked }),
      });
      // Refresh liked posts after like/dislike
      const updatedLikedPosts = liked ? [...likedPosts, blogId] : likedPosts.filter(id => id !== blogId);
      setLikedPosts(updatedLikedPosts);
      // Update isLikedByUser state
      setIsLikedByUser(liked);
      // Update total likes
      setTotalLikes((prevTotalLikes) => ({
        ...prevTotalLikes,
        [blogId]: liked ? prevTotalLikes[blogId] + 1 : prevTotalLikes[blogId] - 1
      }));
    } catch (error) {
      console.log('Error liking post:', error);
    }
  };


  const fetchComments = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/api/comment/${blog_id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.log('no comments');
      }

      const data = await response.json();
      setComment('');
      setCommentsList(data.message);
    } catch (error) {
      console.error('No Comments found:', error);
    }
  };

  // Fetch blog post function
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/api/blog/blog/${blog_id}`, {

        });
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
    fetchComments();
  }, [blog_id]);


  useEffect(() => {

    const fetchTotalLikes = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/api/like/totallike`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blog: blog_id }),
        });
        const responseData = await response.json();
        setTotalLikes((prevTotalLikes) => ({
          ...prevTotalLikes,
          [blog_id]: responseData.totalLikes
        }));
        // Check if the user liked the post and add to likedPosts array if liked
        if (responseData.userLiked) {
          setLikedPosts(prevLikedPosts => [...prevLikedPosts, blog_id]);
        }
      } catch (error) {
        console.log('Error fetching total likes:', error);
      }
    };
    fetchTotalLikes();

  }, [totalLikes, likedPosts]);

  // Loading state
  if (loading) {
    return (

      <>
        <div className="text-center">

          <img src="https://cdn.dribbble.com/userupload/6665658/file/original-a7d9005448729a1860ed9be4205b660b.gif" className='error_img m-3' height={50} alt="" />
        </div>

      </>
    )
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Blog post not found
  if (!blogPost) {
    return <div>Blog post not found</div>;
  }

  // Handle comment input change
  const handleChange = (e) => {
    setComment(e.target.value);
  }

  // Handle comment submission
  const handleSubmit = async () => {
    try {
      if (!user) {
        toast.error('Login First to comment', {
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
      const userId = user._id;
      const response = await fetch(`${CONFIGS.API_BASE_URL}/api/comment/${blog_id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": AuthorizationToken,
        },
        body: JSON.stringify({ content: comment, userid: userId })
      });

      const res_data = await response.json();
      console.log("cmt from sever", res_data);
      if (response.ok) {
        toast.success('Comment Posted successfully!', {
          style: {
            background: '#212121',
            color: 'white',
          },
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setComment('');
        fetchComments();
      } else {
        toast.error(res_data.extraDetails, {
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

        // console.error('Failed to post comment');
      }
    } catch (error) {

      console.log('error doing comment', error);
      // return;
    }
  }

  // Delete comment function
  const deleteComment = async (commentId) => {
    try {
      const userId = user._id;
      const response = await fetch(`${CONFIGS.API_BASE_URL}/api/comment/${blog_id}/delete`, {
        method: 'DELETE',
        headers: {
          "Authorization": AuthorizationToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: commentId, userid: userId })
      });

      if (response.ok) {
        // Handle successful deletion
        toast.success('Comment deleted successfully!', {
          style: {
            background: '#212121',
            color: 'white',
          },
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchComments();
      } else {
        // Handle error response
        console.error('Failed to delete comment');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error deleting comment:', error);
    }
  };

  // Handle opening the modal for deleting a comment
  const handleShowModal = (commentId) => {
    setCommentToDelete(commentId);
    setShowModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setCommentToDelete(null);
    setShowModal(false);
  };


  const { _id, author_id, title, cover_img, content, tags, createdAt } = blogPost;
  const sanitizedContent = DOMPurify.sanitize(content);
  const isLiked = likedPosts.includes(_id);

  // Function to format date to "dd/mm/yyyy"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

        
  const formatDate1 = (dateString) => {
    const date1 = new Date(dateString);
    return formatDistanceToNow(date1, { addSuffix: true });
  }
  return (
    <>
      <div className="fullblog_container">
        {/* <div className="back text-center">
        
        </div> */}
        <div className="fullblogcontainer">
          <div className="authorinfo">
            <button className='btn btn-dark back_btn' onClick={() => navigate(-1)}>
              <IoReturnDownBackOutline size={25} /> Back
            </button>
            <hr />
            <FaUserAlt className='userpfp' />
            {/* <Link to={`/blog/${author_id}/${_id}/blogbyuser`} > */}
            <Link to={`/blog/${author_id.username}/blogbyuser` } className='text-dark'>

            <p className='authorname'>{author_id?.username}</p>
              </Link>
            <p className='authorname'>{formatDate1(createdAt)}</p> {/* Format date here */}
          </div>
          <div className="fullblogtitle">
            <hr />
            <h1>{title}</h1>
          </div>
          <div className="fullblogimg text-center">
            <img src={`${CONFIGS.API_BASE_URL}/uploads/${cover_img}`} alt="" className='fullimg' />
          </div>
          <div className="fullblogcontent text-center">
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
            {/* {isLikedByUser && isLiked ? ( */}
            <div className="like_cmt">

              {!isLikedByUser === true ? (
                <>
                  {/* <AiFillHeart size={25} className="post_like" color="red" onClick={() => like(_id,false)} /> */}
                  <AiFillHeart size={25} className="post_like" color="black" onClick={() => like(_id, true)} />
                  <p className='fullblog_likeinfo'>{totalLikes[blog_id]} likes</p>
                </>
              ) : (
                <>
                  {/* <AiFillHeart size={25} className="post_like" color="black" onClick={() => like(_id,true)} /> */}
                  <AiFillHeart size={25} className="post_like" color="red" onClick={() => like(_id, false)} />
                  <p className='fullblog_likeinfo'>{totalLikes[blog_id]} likes</p>
                </>
              )}
              {/* <p className='fullblog_likeinfo'>{totalLikes[blog_id]} likes</p> */}
            </div>
            {/* <AiFillHeart size={25} className='fullblog_like' />
            <p className='fullblog_likeinfo'>10 likes</p> */}
            <p className='blog_cmt'>
              <AiFillMessage size={25} className='ms-3' onClick={() => window.location.href = '#comment'} /><p className='ms-3'>
                {totalComments.count}

              </p>
            </p>
          </div>
          <div className="comment_section text-center">

            <input type="text" className='form-control ' placeholder='Enter Comment' value={comment} name='content' onChange={handleChange} required />
            <button className="btn btn-secondary m-3" type="button" onClick={handleSubmit}><IoMdSend /></button>
          </div>
          <hr />



          <h1>Comment Section</h1>

          {/* <div className="comment_container">

            {Array.isArray(commentsList) && commentsList.length > 0 ? (
              commentsList.map((commentItem, index) => (

                <div className="each_comment">

                  <div className="each_comment_info">

                    <FaUserAlt className='' size={25} />
                    <h2>{commentItem.userid?.username}</h2>

                    <div className="date_delete">

                      <p> {formatDate(commentItem.createdAt)}</p>
                 

                      {user && user._id && commentItem.userid && commentItem.userid._id && user._id === commentItem.userid._id && (
                        <div className='comment_delete_icontext-danger'>
                          <p>

                            <MdDeleteOutline size={25} onClick={() => handleShowModal(commentItem._id)} />
                          </p>
                        </div>

                      )}


                    </div>
                    <hr />
                    <p>{commentItem.content}</p>
                  </div>

                </div>
              ) : (
              <p className='text-center'> No comments yet.</p>
            )}
          </div> */}


<div className="comment_container">
  {Array.isArray(commentsList) && commentsList.length > 0 ? (
    commentsList.map((commentItem, index) => (
      <div className="each_comment" key={index}>
        <div className="each_comment_info">

          <div className="logo_username">

          <FaUserAlt className='userpfp' size={25} />

          <h2 className='comment_user'>{commentItem.userid?.username}</h2>
          </div>
          <div className="date_delete">
            <p className='comment_data'> {formatDate1(commentItem.createdAt)}</p>
            {user && user._id && commentItem.userid && commentItem.userid._id && user._id === commentItem.userid._id && (
              <div className='comment_delete_icon text-danger'>
                <p>
                  <MdDeleteOutline size={25} onClick={() => handleShowModal(commentItem._id)} />
                </p>
              </div>
            )}
          </div>
          {/* <hr /> */}
          <p className='comment_content'>{commentItem.content}</p>
        </div>
      </div>
    ))
  ) : (
    <p className='text-center'> No comments yet.</p>
  )}
</div>

        </div>
      </div>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this comment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            deleteComment(commentToDelete);
            handleCloseModal();
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FullBlog;
