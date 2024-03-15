import React, { useState } from 'react';
import "../blog/post.css";
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function NotApprovedblogs() {
  const { blog, AuthorizationToken,API_BASE_URL } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const updatePermission = async (blogId, permission) => {
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/blog/${blogId}/permission`, {
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
    setSelectedBlogId(blogId);
    setShowModal(true);
  };

  const handleConfirmation = () => {
    updatePermission(selectedBlogId, 'true'); // Set permission to 'true'
    setShowModal(false);
  };

  return (
    <>
      <div className="row blogrow">
      <h1 className="text-center">Already Declined Blogs</h1>
              <hr />
        {blog.map((currEle, index) => {
          const { title, author_id, cover_img, content, tags, createdAt, username, _id, permission } = currEle;
          const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the content

          // Display only non-approved blogs
          if (permission == 'false') {
            return (
              <div className="maincontainer col-md-4" key={index}>
                <div  className="postcontainer  text-center m-3">
                  <div className="postimg">
                    <img src={`${API_BASE_URL}uploads/${cover_img}`} height={200} className='banner_img' alt="Cover Image" />
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
              </div>
            );
          } else {
            return null; // Don't render if blog is approved
          }
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to approve this blog?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleConfirmation}>Approve</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NotApprovedblogs;
