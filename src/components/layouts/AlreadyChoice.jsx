import React, { useEffect, useState } from 'react';
import '../blog/adminblog.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { GiImperialCrown } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { IoReturnDownBack } from "react-icons/io5";



function AlreadyChoice() {
    const { approvedblog, AuthorizationToken, getApprovedBlogs } = useAuth();
    const [choice, setChoice] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        getApprovedBlogs();
        getChoice(); // Fetch editor's choice blogs
    }, []);

    useEffect(() => {
        console.log('choice blog:', choice); // Log choice when it changes
    }, [choice]); // Run this effect whenever choice changes

    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = choice.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const getChoice = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}api/admin/alreadychoice`, {
                method: "GET",
                headers: {
                    Authorization: AuthorizationToken
                }
            });
            const edtrchoice = await response.json();
            setChoice(edtrchoice);
            console.log('choice blog:', edtrchoice);
            console.log('choice blog:', choice);
        } catch (error) {
            console.log('Error getting Choice', error);
        }
    }

    const makeEditorsChoice = async (blogId) => {
        console.log("Making blog with ID", blogId, "an editor's choice...");
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}api/admin/choice`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'Application/json',
                    Authorization: AuthorizationToken,
                },
                body: JSON.stringify({ blogid: blogId, choice: "false" }) // Set choice to true
            });
            const edtrchoice = await response.json();
            console.log('choice blog:', edtrchoice);
            // After making the blog an editor's choice, you might want to update the state to reflect the change
            getChoice(); // Fetch editor's choice blogs again to update the state
        } catch (error) {
            console.log('Error Making editors choice', error);
        }
    };

    return (
        <>
            <Link to={`/admin/editor`} className='btn btn-dark'><IoReturnDownBack /> BACK</Link>
            <h1 className='home_left_h1 text-center'><GiImperialCrown size={80} /> List of Editor's Choice Blogs</h1>
            <div className="pagination-container align-items-center justify-content-center">
                <hr />
                <table className="table  table-hover ">
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Username</th>
                            <th scope="col">Image</th>
                            <th scope="col">Tags</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((curEle, index) => {
                            // Filter out blogs based on permission and choice
                            // if (curEle.permission && choice.find(choiceBlog => choiceBlog._id === curEle._id && choiceBlog.choice === true)) {
                            return (
                                <tr key={index} className='p-3'>
                                    <td>{curEle.title}</td>
                                    <td>{curEle.author_id?.username}</td>
                                    <td>
                                        <img src={`${process.env.REACT_APP_API_BASE_URL}uploads/${curEle.cover_img}`} height={80} width={120} alt="Cover Image" />
                                    </td>
                                    <td>
                                        {/* Display tags */}
                                        {curEle.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="tag"> {tag} </span>
                                        ))}
                                    </td>
                                    <td>
                                        {/* Dropdown button for actions */}
                                        <DropdownButton id={`dropdown-button-${index}`} title={<HiOutlineDotsVertical />} className='text-light'>
                                            <Dropdown.Item onClick={() => makeEditorsChoice(curEle._id)}><GiImperialCrown size={20} />Remove from Editor's Choice</Dropdown.Item>
                                            {/* Add more actions as needed */}
                                        </DropdownButton>
                                    </td>
                                </tr>
                            );
                            // } else {
                            //     return null; // If permission or choice condition is not met, don't render the blog
                            // }
                        })}
                    </tbody>
                </table>
                {/* Pagination component */}
                <Pagination>
                    {choice.length > itemsPerPage && (
                        <Pagination.Prev
                            onClick={() => handlePageChange(activePage - 1)}
                            disabled={activePage === 1}
                        />
                    )}
                    {Array.from({ length: Math.ceil(choice.length / itemsPerPage) }).map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === activePage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    {choice.length > itemsPerPage && (
                        <Pagination.Next
                            onClick={() => handlePageChange(activePage + 1)}
                            disabled={activePage === Math.ceil(choice.length / itemsPerPage)}
                        />
                    )}
                </Pagination>

            </div>
        </>
    );
}

export default AlreadyChoice;
