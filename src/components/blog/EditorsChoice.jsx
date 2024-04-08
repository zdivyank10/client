import React, { useState, useEffect } from 'react';
import './post.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaThumbsDown, FaThumbsUp, FaUserAlt } from 'react-icons/fa';
import { AiFillHeart, AiFillMessage } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { CONFIGS } from "../../../config";



function EditorsChoice() {
  const { approvedblog, AuthorizationToken, getApprovedBlogs } = useAuth();
  const [choice, setChoice] = useState([]);

  useEffect(() => {
    getApprovedBlogs();
    getChoice(); // Fetch editor's choice blogs
  }, []);

  useEffect(() => {
    console.log('choice blog:', choice); // Log choice when it changes
  }, [choice]); // Run this effect whenever choice changes

  const getChoice = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/api/admin/alreadychoice`, {
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
  };

  const [likedPosts, setLikedPosts] = useState([]);
  const [totalComments, setTotalComments] = useState({});

  const totalcmts = async (blogId) => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/api/comment/${blogId}/count`, {
        method: "GET"
      });
      const responseData = await response.json();
      setTotalComments((prevTotalComments) => ({
        ...prevTotalComments,
        [blogId]: responseData.count // Store count in an object with blogId as key
      }));
    } catch (error) {
      console.log('Error getting total comments:', error);
    }
  };

  useEffect(() => {
    // Iterate through each approved blog post and fetch total comments
    approvedblog.forEach((post) => {
      totalcmts(post._id);
    });
  }, [approvedblog]); // Fetch comments whenever approvedblog changes

  const toggleLike = (postId) => {
    setLikedPosts((prevLikedPosts) => {
      if (prevLikedPosts.includes(postId)) {
        return prevLikedPosts.filter((id) => id !== postId);
      } else {
        return [...prevLikedPosts, postId];
      }
    });
  };

  return (
    <>
      <div className="blogcontainer">


        <div className="row blogrow">


          <h1 className='home_left_h1 text-center'>Editor's Choice</h1>
          <hr />
          {choice &&
            choice.map((post, index) => {
              const { _id, title, author_id, cover_img, content, tags, createdAt, username } = post;
              const sanitizedContent = DOMPurify.sanitize(content);
              const isLiked = likedPosts.includes(_id);
              const totalcmt = totalComments[_id] || 0; // Get total comments count from totalComments object

              return (
                // <div data-aos="fade-up" className="maincontainer col-md-3  m-3" key={index}>
                <div className="maincontainer col-lg-3 col-md-5 col-sm-6  m-3 " key={index}>
              
                  <Link to={`/blog/${_id}`} className="">
                     <Box
                    sx={{
                      perspective: '1000px',
                      transition: 'transform 0.4s',
                      '& > div, & > div > div': {
                        transition: 'inherit',
                        // overflowX:'hidden'
                      },
                      '&:hover': {
                        '& > div': {
                          transform: 'rotateY(30deg)',
                          boxShadow: '0px 0px 20px 2px #59E4A8',
                          // boxShadow: '0px 0px 20px 5px #000000',
                          '& > div:nth-child(2)': {
                            transform: 'scaleY(0.9) translate3d(20px, 30px, 40px)',
                        
                          },
                          '& > div:nth-child(3)': {
                            transform: 'translate3d(45px, 50px, 40px)',
                            boxShadow: '0px 0px 20px 5px #FFFFFF',
                            
                          },
                        },
                      // Add glow effect on hover
                      },
                    }}
                  >

                    <Card
                      variant="outlined"
                      sx={{
                        minHeight: '200px',
                        boxShadow: '0px 4px 10px rgba(0, 10, 9, 1)',
                        width: 320,
                        backgroundColor: '#fff',
                        borderColor: '#59E4A8',
                        borderRadius: '15px',

                      }}
                    >
                      <Typography  fontSize="" textColor="#000">
                      <p className='' style={{ marginTop: "-10px" }}>{title}</p>

                      </Typography>
                      <CardCover
                        sx={{
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                          border: '1px solid',
                          borderRadius: '15px',
                          borderColor: '#59E4A8',
                          backdropFilter: 'blur(1px)',
                        }}
                      >
                        <Typography level="h2" fontSize="lg" textColor="#fff"

                          sx={{

                            backdropFilter: 'blur(1px)',
                          }}
                        >

                          <img src={`${CONFIGS.API_BASE_URL}/uploads/${cover_img}`} alt="" className='fullimg' />
                        </Typography>
                      </CardCover>
                      <CardContent
                        sx={{
                          alignItems: 'self-end',
                          justifyContent: 'flex-end',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.3), rgba(0,0,0,0.3))',
                          border: '1px solid white',
                          borderRadius: '15px',
                          // borderColor: '#000',
                          backdropFilter: 'blur(2px)',
                        }}
                      >
                        <Typography  fontSize="xl" textColor="#fff" m={2}>

                          {/* {tags.map((tag, index) => (
                          <span key={index} className='m-3'>{tag}</span>
                        ))} */}
                          <p className=''>
                            
                            <FaUserAlt className='userpfp' /> {author_id?.username}
                            </p>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                  </Link> 
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default EditorsChoice;
