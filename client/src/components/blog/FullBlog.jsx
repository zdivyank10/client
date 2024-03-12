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


function FullBlog() {
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const { blog_id } = useParams();
  const { user, AuthorizationToken } = useAuth();
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/comment/${blog_id}`, {
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
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/blog/blog/${blog_id}`);
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

  if (loading) {
    return <img src="https://cdn.dribbble.com/userupload/6665658/file/original-a7d9005448729a1860ed9be4205b660b.gif" alt="" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blogPost) {
    return <div>Blog post not found</div>;
  }

  const handleChange = (e) => {
    setComment(e.target.value);
  }

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
      const response = await fetch(`http://localhost:8000/api/comment/${blog_id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": AuthorizationToken,
        },
        body: JSON.stringify({ content: comment, userid: userId })
      });
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
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.log('error doing comment', error);
    }
  }

  const deleteComment = async (commentId) => {
    try {
      
      const userId = user._id;
  
      const response = await fetch(`http://localhost:8000/api/comment/${blog_id}/delete`, {
        method: 'DELETE',
        headers: {
          "Authorization": AuthorizationToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id:commentId, userid:userId })
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
  

  const { author_id, title, cover_img, content, tags, createdAt } = blogPost;
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <>
      <div className="fullblog_container">
        <div className="back text-center">
          <Link to='/blog' className='btn btn-dark '><IoReturnDownBackOutline size={25} />  Back</Link>
        </div>
        <div className="fullblogcontainer">
          <div className="authorinfo">
            <FaUserAlt className='userpfp' />
            <p className='authorname'>{author_id.username}</p>
            <p className='authorname'>{createdAt}</p>
          </div>
          <div className="fullblogtitle">
            <hr />
            <h1>{title}</h1>
          </div>
          <div className="fullblogimg text-center">
            <img src={`http://localhost:8000/uploads/${cover_img}`} alt="" className='fullimg' />
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
            <AiFillHeart size={25} className='fullblog_like' />
            <p className='fullblog_likeinfo'>10 likes</p>
            <AiFillMessage size={25} className='fullpost_cmt' onClick={() => window.location.href = '#comment'} />
          </div>
          <div className="comment_section text-center">
            <input type="text" className='form-control ' placeholder='Enter Comment' value={comment} name='content' onChange={handleChange} />
            <button className="btn btn-secondary m-3" type="button" onClick={handleSubmit}><IoMdSend /></button>
          </div>
          <hr />
          <h1>Comment Section</h1>
          <div className="comments" id='comment'>
            {Array.isArray(commentsList) && commentsList.length > 0 ? (
              commentsList.map((commentItem, index) => (
                <div key={index} className="comment">
                  <div className="comment-content">
                    <FaUserAlt className='userpfp' size={25} />
                    <p className='cmt_user'>{commentItem.userid.username}</p>
                    <p className='cmt_time mt-1'>{commentItem.createdAt}</p>
                    {/* <p className='cmt_time mt-1 ms-4 text-danger'><MdDeleteOutline size={25}/></p> */}
                    {user && user._id === commentItem.userid._id && (
                      <p className='cmt_time mt-1 ms-5 text-danger'>
                      <MdDeleteOutline size={25} onClick={() => deleteComment(commentItem._id)} />

                      </p>
                    )}
                  </div>
                  <div className="cmt_container">
                    <p className='cmt_content justify-content-center align-content-center'>{commentItem.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center'> No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FullBlog;
