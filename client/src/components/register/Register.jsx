import React,{ useState,useEffect} from "react";
import {Link} from "react-router-dom";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../store/auth";

function Register() {
  const navigate = useNavigate();
  const {storeTokenInLS} = useAuth();
  
  // const [showToast, setShowToast] = useState(false);

    const [user,setUser] = useState({

      username: "",
      email: "",
      phone: "",
      password: "",
    })
    const handleInput = (e)=>{
      let name = e.target.name;
      let value = e.target.value;
      setUser({...user,
      [name] : value,
    })
    }

    const handleSubmit = async(e) =>{
      e.preventDefault();
      console.log(user);

      try 
      {
          const response = await fetch('http://localhost:8000/api/auth/register',{
          method:"POST",
          headers : {
            "Content-Type" : "application/json",
          },
          body : JSON.stringify(user),
        });

        const res_data = await response.json();
        console.log("res from sever",res_data); 
        console.log("res from sever",res_data.extraDetails
        ); 
        if(response.ok)
       {
        storeTokenInLS(res_data.token);

             setUser({
              username: "",
              email: "",
              phone: "",
              password: "",
            }); 
            // Show success toast
            toast.success('Registration successful!',{
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
       
            navigate('/');
          } else {
            // alert(res_data.extraDetails);
            toast.error(res_data.extraDetails? res_data.extraDetails : res_data.message,{
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
            console.log('Registration failed');
          }
      
      }
      catch (error) {
        console.log("Error from catch",error);
      }

    }
    return (
    <>
      
       {/* Render the ToastContainer at the top level */}
       {/* <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}

      <div className="reg_container">
            <div className="left_container col-md-6 text-center">
              <h1 data-aos="fade-left" >Welcome To Ink Garden</h1>
              <div data-aos="fade-right" className="mb-3"> {/* Add margin-bottom */}
              <p className="p_first">To stay connected with our vibrant community, log in using your personalized credentials. If you're already part of our community, simply proceed to log in now. Your journey awaits, and we're thrilled to have you with us!</p>
            
             
              <div className="form_div text-center">

              <p className="p_second">To Already Have An Account? Then Login Now </p>
              <Link to="/login">
                <button>Login</button></Link>


              </div>

            </div>
            </div>


            <div className="right_container col-md-6">
              <h1 data-aos="fade-up" className="text-center left_h1">register</h1>


              <div data-aos="zoom-in" className="right_form ">
                <form onSubmit={handleSubmit}>
                  <div className="form_div">
                      <label htmlFor="username">
                        Username:
                      </label>

                      <input type="text" name="username" id="username" placeholder="Enter Your Username" onChange={handleInput} value={user.username} required/>
                  </div>


                  <div className="form_div">
                      <label htmlFor="email">
                        email:
                      </label>

                      <input type="email" name="email" id="email" placeholder="Enter Your email" onChange={handleInput} value={user.email} required/>
                  </div>


                  <div className="form_div">
                      <label htmlFor="phone">
                        phone:
                      </label>

                      <input type="number" name="phone" id="phone" placeholder="Enter Your phone" onChange={handleInput} value={user.phone} required/>
                  </div>


                     <div className="form_div">
                      <label htmlFor="password">
                        password:
                      </label>

                      <input type="password" name="password" id="password" placeholder="Enter Your password" onChange={handleInput} value={user.password} required/>
                    </div>

                    <div className="form_div text-center">
                      <button type="submit">Register</button>
                    </div>
                </form>
              </div>
            </div>

      </div>
     
    </>
  )
}

export default Register