import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import './myblog.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';

function Myblog() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

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

    const toggleLike = (postId) => {
        // Toggle like logic here
    };

    return (
        <div className="myblogcontainer">
            <div className="status col-md-6 ">
                <p className='status_info'>All blogs</p>
                <p className='status_info'>Approved</p>
                <p className='status_info'>Not Approved</p>
                <p className='status_info'>Pending</p>
            </div>

            <div className="row blogrow">
                {blogs.map((post, index) => {
                    const { _id, title, author_id, cover_img, content, tags, createdAt, username } = post;
                    const sanitizedContent = DOMPurify.sanitize(content);
                    

                    return (
                        <div key={index} className="postcontainer col-md-3 text-center">
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

                                {/* <div>
                                    <div onClick={() => toggleLike(_id)}>
                                        {isLiked ? (
                                            <AiFillHeart size={25} className="post_like" color="red" />
                                        ) : (
                                            <AiFillHeart size={25} color="blue" className="post_like" />
                                        )}
                                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                                        <Link to={`/blog/${_id}`}>
                                            <AiFillMessage size={25} className='post_cmt' />
                                        </Link>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Myblog;
