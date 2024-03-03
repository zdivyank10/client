import React, { useState } from 'react';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Adminblogs() {
  const { blog, AuthorizationToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [action, setAction] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBlogId(null);
    setAction(null);
  };

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
    handleCloseModal();
  };

  const handleApprove = (blogId) => {
    setSelectedBlogId(blogId);
    setAction('approve');
    setShowModal(true);
  };

  const handleDecline = (blogId) => {
    setSelectedBlogId(blogId);
    setAction('decline');
    setShowModal(true);
  };

  const handlePending = (blogId) => {
    setSelectedBlogId(blogId);
    setAction('pending');
    setShowModal(true);
  };

  const handleConfirmation = () => {
    if (selectedBlogId && action) {
      switch (action) {
        case 'approve':
          updatePermission(selectedBlogId, 'true');
          break;
        case 'decline':
          updatePermission(selectedBlogId, 'false');
          break;
        case 'pending':
          updatePermission(selectedBlogId, 'pending');
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <div className="row blogrow">
      <h1 className="text-center">All Blogs</h1>
              <hr />
        {blog.map((currEle, index) => {
          const { _id: blogId, title, author_id, cover_img, content, tags, createdAt, username, permission } = currEle;
          const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the content
          let bgClass = 'bg-light'; // Default background color
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
            case 'pending':
              bgClass = 'bg-warning';
              approvalStatus = 'pending';
              break;
            default:
              bgClass = 'bg-warning';
              approvalStatus = 'pending';
          }

          return (
                
            <div className="maincontainer col-md-4" key={index}>
              <div className="postcontainer text-center m-3">
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
                  <button className="btn btn-outline-dark me-3" onClick={() => handleApprove(blogId)}>Approve</button>
                  <button className="btn btn-outline-dark me-3" onClick={() => handleDecline(blogId)}>Decline</button>
                  <button className="btn btn-outline-dark " onClick={() => handlePending(blogId)}>Pending</button>
                </div>

                <hr />
                <span className={`approval-status text-center ${bgClass} text-light`} style={{ borderRadius: '5px' }}>{approvalStatus}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm {action === 'approve' ? 'Approval' : action === 'decline' ? 'Decline' : 'Pending'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {action === 'approve' ? 'approve' : action === 'decline' ? 'decline' : 'set as pending'} this blog?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmation}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Adminblogs;
