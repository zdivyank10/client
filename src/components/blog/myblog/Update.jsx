import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MyQuillEditor from '../MyDraftEditor';
import { useAuth } from '../../../store/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { IoReturnDownBackOutline } from 'react-icons/io5';
import { CONFIGS } from "../../../../config";
import { TagsInput } from '@mantine/core';
import '@mantine/core/styles.css';

// import 'react-tagsinput-component/dist/react-tagsinput-component.css'; 

function Update() {
    const { _id } = useParams();
    const { user, AuthorizationToken } = useAuth();
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [file, setFile] = useState(null);
    const [blog, setBlog] = useState({
        username: user.username,
        cover_img: "",
        title: "",
        content: "",
        tags: [],
    });

    useEffect(() => {
        const gettingDetails = async () => {
            try {
                const response = await fetch(`${CONFIGS.API_BASE_URL}/api/blog/blog/${_id}`);
                if (response.ok) {
                    const blogData = await response.json();
                    console.log('getting blog data', blogData);
                    setBlog(blogData);
                    // setTags(blogData.tags);
                    setTags(blogData.tags || []);
                } else {
                    console.error('Failed to fetch blog details:', response.statusText);
                }
            } catch (error) {
                console.log(error);
            }
        };

        gettingDetails();
    }, [_id]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setBlog({
            ...blog,
            [name]: value,
        });
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleEditorChange = (content) => {
        setBlog({
            ...blog,
            content: content,
        });
    };

    // Function to upload image
    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch(`${CONFIGS.API_BASE_URL}/api/blog/upload`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadResponse.json();

            if (uploadResponse.ok) {
                const fileURL = uploadData.fileURL;
                console.log('Uploaded File', uploadData);
                console.log('Image uploaded successfully:', uploadData);
                return uploadData;
            } else {
                console.error('Failed to upload image:', uploadResponse.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };



    // Function to handle updating blog content
    const handleUpdateBlog = async () => {
        try {
            let updatedCoverImg = blog.cover_img;

            // Check if a new image is selected
            if (file) {
                updatedCoverImg = await uploadImage(file);
                if (!updatedCoverImg) {
                    // Handle error if image upload fails
                    return;
                }
            }

            // Update blog content with updatedCoverImg
            const response = await fetch(`${CONFIGS.API_BASE_URL}/api/blog/${_id}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: AuthorizationToken,
                },
                body: JSON.stringify({
                    ...blog,
                    cover_img: updatedCoverImg,
                    title: blog.title,
                    content: blog.content,
                    tags: tags,
                }),
            });
            if (!blog.title || !blog.content ) {
                toast.error('Please fill in all required fields', {
                    style: {
                        background: '#212121',
                        color: 'white',
                    },
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
            if (response.ok) {
                const updatedBlog = await response.json();
                console.log('Blog updated successfully:', updatedBlog);
                setBlog({
                    username: "",
                    cover_img: "",
                    title: "",
                    tag: [],
                    author_id: "",
                });
                setTags([]);
                toast.success('Blog Updated successfully,Wait for Approval!', {
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
                navigate(`/myblog/${user._id}`);

            } else {
                console.error('Failed to update blog:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };


    const handleChange = (newTags) => {
        setTags(newTags);
    };

    return (
        <>
            {/* <div className="back text-center">
                <Link to={`/myblog/${user._id}`} className='btn btn-dark '><IoReturnDownBackOutline size={25} />  Back</Link>
            </div> */}

            <div data-aos="fade-in" className="back text-center m-5">

                <Link to={`/myblog/${user._id}`} className='btn btn-dark '><IoReturnDownBackOutline size={25} />  Back</Link>
            </div>

            <div  className="addpostcontainer justify-content-center">
                <div data-aos="zoom-in"   className="addpostright">
                    <h1 className='text-center'>Edit Blog</h1>
                    <hr />
                    <form encType="multipart/form-data">
                        <div className="formcontrol">
                            <label htmlFor="username">Username :</label>
                            <input type="text" name="username" id="username" className='form-control' value={user.username} disabled />
                        </div>
                        <div className="formcontrol">
                            <label htmlFor="file">Edit Picture :</label>
                            <input type="file" name="file" id="file" className='form-control' onChange={handleFileChange} />
                        </div>
                        <div className="formcontrol">
                            <label htmlFor="title">Edit Title :</label>
                            <input type="text" name="title" id="title" className='form-control' value={blog.title} onChange={handleInput}  placeholder='Add Title' required />
                        </div>
                        <div className="formcontrol">
                            <label htmlFor="title">Edit Tags :</label>


                            {/* <TagsInput

                                value={tags}
                                onChange={handleChange}
                                name="Tags"
                                placeHolder="Enter Tags"
                            /> */}


<TagsInput  placeholder="Enter Tags" value={tags} onChange={handleChange} />
                        </div>
                        <div className="formcontrol">
                            <label htmlFor="file">Edit Blog :</label>
                            <ReactQuill
                                theme="snow"
                                value={blog.content}
                                onChange={handleEditorChange}
                            />
                        </div>
                        <div className="formcontrol text-center">
                            <button type='button' className='btn btn-light' onClick={handleUpdateBlog}>Update Blog</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Update;
