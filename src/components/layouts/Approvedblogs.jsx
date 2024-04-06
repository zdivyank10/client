import React, { useEffect, useState } from 'react';
import "../blog/post.css";
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { formatDistanceToNow } from 'date-fns';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ImBlog } from 'react-icons/im';

function Approvedblogs() {
    const { approvedblog, AuthorizationToken, getApprovedBlogs } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    useEffect(() => {
        getApprovedBlogs();
    }, []);

    const updatePermission = async (blogId, permission) => {
        try {
            const response = await fetch(`${process.env.API_BASE_URL}api/admin/blog/${blogId}/permission`, {
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
            getApprovedBlogs();
        } catch (error) {
            console.error('Error updating permission:', error);
        }
    };

    const handleDecline = (blogId) => {
        setSelectedBlogId(blogId);
        setShowModal(true);
    };

    const handleConfirmation = () => {
        updatePermission(selectedBlogId, 'false'); // Set permission to 'false'
        setShowModal(false);
    };

    const formatDate1 = (dateString) => {
        const date1 = new Date(dateString);
        return formatDistanceToNow(date1, { addSuffix: true });
    };

    return (
        <>
            <div className=" row blogrow">
                <h1 className="home_left_h1 text-center"><ImBlog size={80} className='text-success'/>  Already Approved Blogs</h1>
                <hr />
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                    <Masonry columnsCount={3}>
                        {approvedblog && approvedblog.map((currEle, index) => {
                            const { title, author_id, cover_img, content, tags, createdAt, username, _id } = currEle;
                            const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the content
                            return (
                                <div className="maincontainer" key={index}>
                                    <div className="postcontainer text-center m-3">
                                        <div className="postimg">
                                        <img src={`${process.env.API_BASE_URL}uploads/${cover_img}`} height={200} className="banner_img" alt="Cover Image" />
                                        </div>
                                        <div className="postuserinfo blog-info">
                                            <FaUserAlt className='userpfp' />
                                            <div className="info">
                                                <p>{author_id?.username}</p>
                                                <p className="blogdate">{formatDate1(createdAt)}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="blogcontent text-center ">
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
                                            <button className="btn btn-danger" onClick={() => handleDecline(_id)}>Decline</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Masonry>
                </ResponsiveMasonry>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Decline</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Are You Sure You Want to decline?</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmation}>Decline</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Approvedblogs;
