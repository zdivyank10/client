import React, { useEffect, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import './myblog.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';
import MiniNavbar from './myblog/MiniNavbar';

function Myblog() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);


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
    console.log('hello');

    const toggleLike = (postId) => {
        // Toggle like logic here
    };

    return (
        <div className="myblogcontainer">
            <MiniNavbar />

            <div className="row blogrow">
                {blogs.map((post, index) => {
                    const { _id, title, author_id, cover_img, content, tags, createdAt, username, permission } = post;
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
                                <hr />
                                <div className={`bg-${permission === 'true' ? 'success' : permission === 'false' ? 'danger' : 'warning'} text-light` } style={{ borderRadius: '5px' }}
>
                                <p >
                                    
                                    {permission == 'true'
                                        ? 'Approved'
                                        : permission == 'false'
                                        ? 'Not Approved'
                                        : 'Pending'
                                    }
                                </p>
                                    </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Myblog;
