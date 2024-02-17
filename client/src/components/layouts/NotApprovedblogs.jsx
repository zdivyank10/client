import React from 'react';
import "../blog/post.css";
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";

function NotApprovedblogs() {
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
    updatePermission(blogId, 'true'); // Set permission to 'true'
  };

  return (
    <>
      <div className="row blogrow">
        {blog.map((currEle, index) => {
          const { title, author_id, cover_img, content, tags, createdAt, username, _id, permission } = currEle;
          const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the content

          // Display only non-approved blogs
          if (permission == 'false') {
            return (
              <div data-aos="fade-up" className="postcontainer bg-danger col-md-5" key={index}>
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
                  <button className="btn btn-success" onClick={() => handleApprove(_id)}>Approve</button>
                </div>
              </div>
            );
          } else {
            return null; // Don't render if blog is approved
          }
        })}
      </div>
    </>
  );
}

export default NotApprovedblogs;
