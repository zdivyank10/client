import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyQuillEditor from '../MyDraftEditor';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { useAuth } from '../../../store/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Delta from 'quill-delta';

function Update() {
    const { _id } = useParams();
    const { user, AuthorizationToken } = useAuth();
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
                const response = await fetch(`http://localhost:8000/api/blog/blog/${_id}`);
                if (response.ok) {
                    const blogData = await response.json();
                    console.log('geetting blog data',blogData);
                    setBlog(blogData);
                    setTags(blogData.tags);
                } else {
                    console.error('Failed to fetch blog details:', response.statusText);
                }
            } catch (error) {
                console.log(error);
            }
        };

        gettingDetails();
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setBlog({
            ...blog,
            [name]: value,
        });
    };

    const handleEditorChange = (content) => {
        setBlog({
            ...blog,
            content: content,
        });
    };

    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/blog/${_id}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: AuthorizationToken,
                },
                body: JSON.stringify({
                    title: blog.title,
                    cover_img: blog.cover_img,
                    content: blog.content,
                    tags: tags,
                }),
            });
            if (response.ok) {
                const updatedBlog = await response.json();
                console.log('Blog updated successfully:', updatedBlog);
            } else {
                console.error('Failed to update blog:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    return (
        <>
            <div className="addpostcontainer justify-content-center">
                <div className="addpostright">
                    <h1 className='text-center'>Write Blog</h1>
                    <hr />
                    <form encType="multipart/form-data">
                        <div className="formcontrol">
                            <label htmlFor="username">Username :</label>
                            <input type="text" name="username" id="username" className='form-control' value={user.username} disabled />
                        </div>
                        <div className="formcontrol">
                            <label htmlFor="file">Add Picture :</label>
                            <input type="file" name="file" id="file" className='form-control' />
                        </div>
                        <div className="formcontrol">
                            <label htmlFor="title">Title :</label>
                            <input type="text" name="title" id="title" className='form-control' value={blog.title} onChange={handleInput} />
                        </div>
                        <div className="formcontrol">
                            <label htmlFor="title">Tags :</label>
                            <TagsInput value={tags} />
                        </div>
                        <div className="formcontrol">
                            <label htmlFor="file">Write Blog :</label>
                            <ReactQuill
                                theme="snow"
                                // value={new Delta(JSON.parse(blog.content))}
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
