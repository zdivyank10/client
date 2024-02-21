import React, { useState, useEffect } from 'react';
import { FaUserAlt } from "react-icons/fa";
import './fullblog.css';
import { AiFillHeart, AiFillMessage } from "react-icons/ai";
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { IoReturnDownBackOutline } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FullBlog() {
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { blog_id } = useParams();
  const { user } = useAuth();
  const navigate =useNavigate();
  // const [userId, setUserId] = useState(null);
  
  const [comment, setComment] = useState([]);


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


    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/comment/${blog_id}/comment`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed (e.g., Authorization header with token)
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
  
        const data = await response.json();
        setComment(data.comments); // Update comment state with array of comments
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to fetch comments. Please try again later.', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
    fetchBlogPost();
    fetchComments();
  }, [blog_id]);

  // console.log(blogPost);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blogPost) {
    return <div>Blog post not found</div>;
  }
  const handlechange = (e)=>{
    setComment(e.target.value);
  }
  
  const handleSubmit = async () => {
    try {
      if (!user) {
        // If user is not logged in, prevent commenting
        toast.error('Login First to comment',{
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
        console.log('login first');
        // return;
      }
      const userId = user._id;
      const response = await fetch(`http://localhost:8000/api/comment/${blog_id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : 'AuthorizationToken' , 
        }, 
        body: JSON.stringify({ content: comment, userid: userId })
      });
      if (response.ok) {
        toast.success('Comment Posted successfully!',{
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
        console.log('Comment posted successfully');
        setComment('');
        console.log('Comment state:', comment);
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.log('error doing comment', error);
    }
  }
  
  const { author_id, title, cover_img, content, tags, createdAt, username } = blogPost;
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <>
      <div className="back text-center mt-5">

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
        <input type="text" className='form-control ' placeholder='Enter Comment'  value={comment}  id='comment' name='content' onChange={handlechange}/>
        <button className="btn btn-secondary m-3 " type="button" onClick={handleSubmit}><IoMdSend />
</button>
{/* <IoMdSend size={35} className='send_icon'/> */}
      </div>
       
      </div>

              {comment.map((comment, index) => (
          <div key={index} className="comment">
            <FaUserAlt className='userpfp' />
            <p>{comment.content}</p>
            {/* Add more details if needed */}
          </div>
        ))}
      
    </>
  );
}

export default FullBlog;
