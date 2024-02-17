import React from 'react';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";

function Adminblogs() {
  const { blog, AuthorizationToken } = useAuth();

  const updatePermission = async (blogId, permission) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/blog/${blogId}/permission`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AuthorizationToken,
        },
        body: JSON.stringify({ permission })
      });

      if (!response.ok) {
        throw new Error('Failed to update permission');
      }

      const updatedBlog = await response.json();
      console.log('Updated blog:', updatedBlog);
    } catch (error) {
      console.error('Error updating permission:', error);
      // Add UI feedback to inform the user about the error
    }
  };

  const handleApprove = (blogId) => {
    updatePermission(blogId, 'true'); // Set permission to 'approved'
  };

  const handleDecline = (blogId) => {
    updatePermission(blogId, 'false'); // Set permission to 'declined'
  };

  const handlePending = (blogId) => {
    updatePermission(blogId, 'pending'); // Set permission to 'pending'
  };

  return (
    <>
      <div className="row blogrow">
        {blog.map((currEle, index) => {
          const { _id: blogId, title, author_id, cover_img, content, tags, createdAt, username, permission } = currEle;
          const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the content
          let bgClass = 'bg-dark'; // Default background color
          let approvalStatus = 'pending'; // Default approval status
          
          // Set background color and approval status based on permission
          switch (permission) {
            case 'true':
              bgClass = 'bg-success';
              approvalStatus = 'approved';
              break;
            case 'false':
              bgClass = 'bg-danger';
              approvalStatus = 'declined';
              break;
            default:
              bgClass = 'bg-light';
              approvalStatus = 'pending';
          }

          return (
            <div data-aos="fade-up" className={`postcontainer col-md-5 ${bgClass}`} key={index}>
              <div className="postimg">
                <img src={`http://localhost:8000/uploads/${cover_img}`} height={200} className='banner_img' alt="Cover Image" />
              </div>

              <div className="postuserinfo">
                <FaUserAlt className='userpfp'/>
                <div className="info">
                  <p>{author_id.username}</p>
                  <p className='blogdate'>{createdAt}</p>
                </div>
              </div>
              <hr />

              <div className="blogcontent text-center">
                <h2>{title}</h2>
                <div className='content' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                <div className="tags">
                  {tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag"> {tag} </span> 
                  ))}
                </div>
                <hr />
              </div>
              <div className="actions text-center">
                {/* {permission === 'pending' && ( */}
                  {/* <> */}
                    <button className="btn btn-outline-dark m-3" onClick={() => handleApprove(blogId)}>Approve</button>
                    <button className="btn btn-outline-dark" onClick={() => handleDecline(blogId)}>Decline</button>
                  {/* </> */}
                {/* )} */}
              </div>
              <hr />
                <span className="approval-status text-center">{approvalStatus}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Adminblogs;
