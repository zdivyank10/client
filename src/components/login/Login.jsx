import React,{useState} from "react";
// import React from 'react';

import {Link} from "react-router-dom";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../store/auth";
function Login() {

  const {userAuthentication ,storeTokenInLS} = useAuth();

  const URL = `https://server-2ei1.onrender.com/api/auth/login`;
     const navigate = useNavigate();
    const [user,setUser] = useState({
      email: "",
      password: "",
    });

    const handleInput = (e)=>{
      let name = e.target.name;
      let value = e.target.value;
      setUser({...user,
      [name] : value,
    });
    }

    const handleSubmit = async(e) =>{
      e.preventDefault();
      console.log(user);

      try 
      {
          const response = await fetch(URL,{
  
          method:"POST",
          headers : {
            "Content-Type" : "application/json",
          },
          body : JSON.stringify(user),
        });
        
        const res_data = await response.json();
        console.log("res from sever",res_data); 

        // console.log(res_data);
        if(response.ok)
       {
        storeTokenInLS(res_data.token);
             setUser({
              email: "",
              password: "",
            }); 
           
            // Show success toast
            toast.success('Login successful!',{
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
       
            navigate('/');
           
    
          } 
       
          else {

            toast.error(res_data.extraDetails || res_data.message,{

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
            console.log('Login failed');
          }
      
      }
      catch (error) {
        console.log("Error from catch",error);
      }

    }
    return (
      <>
      <div className="reg_container">
            <div className="left_container col-md-6 text-center">
              <h1 data-aos="fade-left">Welcome To Ink Garden!</h1>
              <div data-aos="fade-right"  className="mb-3"> {/* Add margin-bottom */}
              <p className="p_first">To stay connected with our community, register with your personal information. Unlock a world of possibilities and connections by becoming a part of our network. Your journey begins here!</p>
            {/* <img src="./public/img/vecteezy_man-entering-security-password_4689193-1.jpg" className="secImg text-center" alt="security img" height={"400px"}/> */}
             
              <div className="form_div text-center">

              <p> Don't Have An Account? Then Register Now </p>
              <Link to="/register">
                <button>Register</button></Link>
              </div>

            </div>
            </div>


            <div className="right_container col-md-6">
            <h1 data-aos="fade-up" className="text-center left_h1">Login</h1>


              <div data-aos="zoom-in" className="right_form">
                <form onSubmit={handleSubmit}>
                 


                  <div className="form_div">
                      <label htmlFor="email">
                        email:
                      </label>

                      <input type="email" name="email" id="email" placeholder="Enter Your email" onChange={handleInput} value={user.email} autoComplete="true" required/>
                  </div>


                

                     <div className="form_div">
                      <label htmlFor="password">
                        password:
                      </label>

                      <input type="password" name="password" id="password" placeholder="Enter Your password" onChange={handleInput} value={user.password} autoComplete="true" required/>
                    </div>

                    <div className="form_div text-center">
                      <button type="submit">Login</button>
                    </div>
                </form>
              </div>
            </div>

      </div>
    </>
  )
}

export default Login