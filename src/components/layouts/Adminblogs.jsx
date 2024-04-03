import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../blog/post.css';

function Adminblogs() {
  const { blog, AuthorizationToken, API_BASE_URL, getBlogs } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [action, setAction] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [showModal1, setShowModal1] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10; // Number of items per page



  const sortedBlogs = blog.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    getBlogs();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowModal1(false);
    setSelectedBlogId(null);
    setAction(null);
  };

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
      await getBlogs();
    } catch (error) {
      console.error('Error updating permission:', error);
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/blog/${deleteId}/delete`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Blog Deleted successfully', {
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
        // Handle success, e.g., remove the blog post from the list
        setBlogs(blogs.filter(blog => blog._id !== deleteId));
        getBlogs();
      } else {
        toast.error('Error Deleting Blog  ', {
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

      }
      setShowModal1(false);
    } catch (error) {
      // Handle error, e.g., display an error message
      console.error('Error deleting blog:', error);
    }
  };

  const toggleModal1 = (id) => {
    setDeleteId(id);
    setShowModal1(!showModal1);
  };

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBlogs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const formatDate1 = (dateString) => {
    const date1 = new Date(dateString);
    return formatDistanceToNow(date1, { addSuffix: true });
  };

  return (
    <div className="container">
      <h1 className="text-center">All Blogs</h1>
      <Table striped bordered hover >
        <thead>
          <tr className="table table-dark">
            <th>Cover_Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>CreatedAt</th>
            <th>Actions</th>
            <th>Approval Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((currEle, index) => {
            const { _id, title,createdAt, author_id, permission, cover_img } = currEle;
            let bgClass = ''; // Default background color
            let approvalStatus = 'Pending'; // Default approval status

            switch (permission) {
              case 'true':
                bgClass = 'bg-success';
                approvalStatus = 'Approved';
                break;
              case 'false':
                bgClass = 'bg-danger';
                approvalStatus = 'Declined';
                break;
              case 'pending':
                bgClass = 'bg-warning';
                approvalStatus = 'Pending';
                break;
              default:
                bgClass = 'bg-warning';
                approvalStatus = 'Pending';
            }

            return (
              <tr key={index}>
                <td>
                  <Link to={`/blog/${_id}`} className="postimg">
                    <img src={`${API_BASE_URL}uploads/${cover_img}`} height={100} alt="" />
                  </Link>
                </td>
                <td>
                  <Link to={`/blog/${_id}`} className="admin-title text-dark">
                    {title}
                  </Link>
                </td>
                <td>{author_id?.username}</td>
                <td><p className="blogdate">{formatDate1(createdAt)}</p></td>
                <td>
                  <Button variant="outline-dark me-2" onClick={() => handleApprove(_id)}>Approve</Button>
                  <Button variant="outline-dark me-2" onClick={() => handleDecline(_id)}>Decline</Button>
                  <Button variant="outline-dark mt-2" onClick={() => handlePending(_id)}>Pending</Button>
                </td>
                <td>
                  <span className={`approval-status ${bgClass} text-light text-center m-3`} style={{ borderRadius: '5px', padding: '5px', margin: '5px' }}>{approvalStatus}</span>
                </td>
                <td><MdDelete className='text-danger text-center m-3' onClick={() => toggleModal1(_id)} /></td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination>
        {blog.length > itemsPerPage && (
          <Pagination.Prev
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
        )}
        {Array.from({ length: Math.ceil(blog.length / itemsPerPage) }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === activePage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        {blog.length > itemsPerPage && (
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === Math.ceil(blog.length / itemsPerPage)}
          />
        )}
      </Pagination>

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
      <Modal show={showModal1} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to Delete this blog?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleDelete}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Adminblogs;
