import React from 'react'
import Post from './Post'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../store/auth';
// import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './blog.css'
import { AiFillPlusCircle } from "react-icons/ai";


function Blog() {

    const navigate = useNavigate();
    const {user,API_BASE_URL} = useAuth();
    const checkuser= async() => {
            try {
                if (user) {
                   navigate('/addpost');
                }
                else
                {
                    toast.error('Login First to write Blog!',{
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
                    navigate("/login");
                }
                
            } catch (error) {
                console.error("Error Form Post",error);
            }
        }
   
  return (
    <>
        <div className="blogcontainer pt-4 text-center">
        <button data-aos="fade-right" to="/addpost" className='btn btn-dark' onClick={checkuser}><AiFillPlusCircle size={25}/>    Add Your Blog</button>
        <hr />
        <Post />
        </div>

    </>
  )
}

export default Blog