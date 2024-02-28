import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../store/auth';
import MiniNavbar from './MiniNavbar';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';

function MyApprovedblogs() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
 

    useEffect(() => {
        const getMyBlogs = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/blog/${user._id}/approved`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await response.json();
                setBlogs(data); // Assuming data is an array of blog objects
                setLoading(false);

            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        getMyBlogs();
    }, [user._id]);

    if (loading) {
        return (
            <>
            <div className="text-center">

            <img src="https://cdn.dribbble.com/userupload/6665658/file/original-a7d9005448729a1860ed9be4205b660b.gif" alt="" height={450} />
            </div>
            </>
        );
    }

    if (blogs.length === 0) {
        return (
            <>
             <MiniNavbar />
            <div className="text-center">

            <img src="https://cdn.dribbble.com/users/3008811/screenshots/7090670/media/5a61f4778d6a527572a773c1f69001b8.gif" alt="" height={450} className='mt-3 m-3' />

            <h3 className='m-3'>- No Pending blogs found-</h3>
            <Link to={`/myblog/${user._id}`} className='btn btn-dark'> Go back</Link> 
            </div>
            </>
        )
    }
    return (
        <div className="myblogcontainer">
           <MiniNavbar />

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

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


export default MyApprovedblogs