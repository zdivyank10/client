import React, { useState } from 'react';
import "./addpost.css";
import { useAuth } from "../../store/auth";
import { Link } from 'react-router-dom';
import MyQuillEditor from './MyDraftEditor';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoReturnDownBackOutline } from "react-icons/io5";


function Addpost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);

  const [blog, setBlog] = useState({
    username: "",
    cover_img: "",
    title: "",
    tag: [],
    author_id: "", // Include author ID in the state
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChange = (newTags) => {
    setTags(newTags);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !blog.title || !blog.content || tags.length === 0) {
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
    try {

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(`https://server-2ei1.onrender.com/api/blog/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (uploadResponse.ok) {
        const fileURL = uploadData.fileURL;
        console.log('file URL', uploadResponse.url);
        console.log('file URL', uploadData);

        // const fullurl = uploadResponse.url+'/'+uploadData
        // console.log('fulll url');
        const response = await fetch(`https://server-2ei1.onrender.com/api/blog/addblog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...blog,
            cover_img: uploadData,
            author_id: user._id, // Set author ID from the authenticated user
            tags: tags,
          }),
        });

        const res_data = await response.json();

        if (response.ok) {
          setBlog({
            username: "",
            cover_img: "",
            title: "",
            tag: [],
            author_id: "",
          });
          setTags([]);
          toast.success('Blog Posted successful!', {
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
          navigate('/blog');
        } else {
          toast.error(res_data.extraDetails, {
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
          console.log('Blog Posting failed');
        }
      } else {
        console.error('Failed to upload file:', uploadResponse.statusText);
      }
    } catch (error) {
      console.log('Error posting img', error);
    }
  }

  return (
    <>
      <div className="back text-center m-5">

        <Link to='/blog' className='btn btn-dark '><IoReturnDownBackOutline size={25} />  Back</Link>
      </div>
      <div className="addpostcontainer justify-content-center">
        {/* <div className="addpostleft">
          <div className="leftpreview">
            <img src="https://cdn-icons-png.flaticon.com/512/44/44948.png" alt="userlog" height={100} className='img--align-left' />
            <h1>{user.username}</h1>
            <p>Is writing</p>
          </div>
          <Link to='/blog' className='btn btn-primary'> Go Back</Link>
        </div> */}

        <div className="addpostright ">
          <h1 className='text-center m-4'>Write Blog</h1>
          <hr />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="formcontrol">
              <label htmlFor="username">Username :</label>
              <input type="text" name="username" id="username" className='form-control' value={user.username} disabled />
            </div>
            <div className="formcontrol">
              <label htmlFor="file">Add Picture :</label>
              <input type="file" name="file" id="file" className='form-control' onChange={handleFileChange} required  />
            </div>
            <div className="formcontrol">
              <label htmlFor="title">Title :</label>
              <input type="text" name="title" id="title" className='form-control ' value={blog.title} onChange={handleInput} required/>
            </div>
            <div className="formcontrol">
              <label htmlFor="title">Tags :</label>
              <TagsInput value={tags} onChange={handleChange} />
            </div>
            <div className="formcontrol">
              <label htmlFor="file">Write Blog :</label>
              <MyQuillEditor onEditorChange={handleEditorChange} />
            </div>
            <div className="formcontrol text-center">
              <button type='submit' className='btn btn-light'>Post Blog</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Addpost;
