import React, { useEffect, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import './myblog.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';
import MiniNavbar from './myblog/MiniNavbar';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Myblog() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const getMyBlogs = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/blog/${user._id}`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await response.json();
                setBlogs(data); // Assuming data is an array of blog objects
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        getMyBlogs();
    }, [user._id]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/blog/${deleteId}/delete`, {
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
            } else {
                // Handle error, e.g., display an error message
            }
            setShowModal(false);
        } catch (error) {
            // Handle error, e.g., display an error message
            console.error('Error deleting blog:', error);
        }
    };

    const toggleModal = (id) => {
        setDeleteId(id);
        setShowModal(!showModal);
    };

    return (
        <div className="myblogcontainer">
            <MiniNavbar />

            <div className="row blogrow">
                {blogs.map((post, index) => {
                    const { _id, title, author_id, cover_img, content, tags, createdAt, username, permission } = post;
                    const sanitizedContent = DOMPurify.sanitize(content);

                    return (
                        <div className="maincontainer col-md-3" key={index}>
                            <div className="postcontainer text-center m-3">
                                <div data-aos="fade-up" className="">
                                    <Link to={`/blog/${_id}`} className="postimg">
                                        <img src={`http://localhost:8000/uploads/${cover_img}`} height={200} className="banner_img" alt="Cover Image" />
                                    </Link>

                                    <Link to={`/blog/${_id}`} className="postuserinfo">
                                        <FaUserAlt className="userpfp" />
                                        <div className="info">
                                            <p>{author_id.username}</p>
                                            <p className="blogdate">{createdAt}</p>
                                        </div>
                                    </Link>
                                    <hr />

                                    <Link to={`/blog/${_id}`} className="blogcontent">
                                        <h2>{title}</h2>
                                        <div className="content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                                        <hr />
                                        <div className="tags">
                                            {tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                    </Link>
                                    <hr />
                                    <div className={`bg-${permission === 'true' ? 'success' : permission === 'false' ? 'danger' : 'warning'} text-light`} style={{ borderRadius: '5px' }}>
                                        <p>
                                            {permission == 'true'
                                                ? 'Approved'
                                                : permission == 'false'
                                                ? 'Not Approved'
                                                : 'Pending'}
                                        </p>
                                    </div>
                                </div>

                                <hr />
                                <div className="blog_function">
                                    <Link to={`/myblog/${_id}/update`} className='me-3 primary-links'><FaRegEdit size={25}/> Edit</Link>
                                    <Link className='text-danger primary-links' onClick={() => toggleModal(_id)}><MdDeleteOutline size={25}/> Delete</Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Blog Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to permanently delete this blog post  ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Myblog;