import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../store/auth";
import { MdErrorOutline } from "react-icons/md";


function Register() {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    otp: "" // Add otp field to user state
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerified, setVerified] = useState(false);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({ ...user, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If email is not verified, return
    if (!isEmailVerified) {
      toast.error('Please verify your email first.', {
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
    
    // If OTP is not verified, return
    if (!isVerified) {
      toast.error('Please verify your OTP first.', {
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
      // Proceed with registration
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();
      console.log("res from server", res_data);
      console.log("res from server", res_data.extraDetails);

      if (response.ok) {
        storeTokenInLS(res_data.token);
        setUser({
          username: "",
          email: "",
          phone: "",
          password: "",
          otp: "" // Clear otp field after successful registration
        });

        toast.success('Registration successful!', {
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
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message, {
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

    } catch (error) {
      console.log("Error from catch", error);
    }
  }

  const verifyEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/auth/sendmail', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }), // Send only email
      });

      const res_data = await response.json();
      console.log("res from server", res_data);
      console.log("res from server", res_data.extraDetails);

      if (response.ok) {
        setIsEmailVerified(true);
        toast.success('Verification email sent!', {
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
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message, {
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
        console.log('Email verification failed');
      }

    } catch (error) {
      console.log("Error from catch", error);
    }
  }

  const verifyOTP = async (e) => {
    e.preventDefault();

    try {
      // Perform OTP verification
      const otpResponse = await fetch('http://localhost:8000/api/auth/verify', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, otp: user.otp }), // Send OTP for verification
      });

      console.log('otp which is sending', user.otp);
      const otpResData = await otpResponse.json();
      console.log("OTP verification response", otpResData);

      if (otpResponse.ok) {
        // If OTP verification succeeds
        setVerified(true);
        toast.success('OTP verified successfully!', {
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
      } else {
        // If OTP verification fails
        toast.error('Incorrect OTP. Please try again.', {
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
      }
    } catch (error) {
      console.log("Error from catch", error);
    }
  }

  return (
    <>
      <div className="reg_container">
        {/* Left container code here */}
        <div className="left_container col-md-6 text-center">
          <h1 data-aos="fade-left">Welcome To Ink Garden</h1>
          <div data-aos="fade-right" className="mb-3">
            <p className="p_first">To stay connected with our vibrant community, log in using your personalized credentials. If you're already part of our community, simply proceed to log in now. Your journey awaits, and we're thrilled to have you with us!</p>
            <div className="form_div text-center">
              <p className="p_second">Already Have An Account? Then Login Now</p>
              <Link to="/login">
                <button>Login</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="right_container col-md-6">
          <h1 data-aos="fade-up" className="text-center left_h1">Register</h1>
          <div data-aos="zoom-in" className="right_form">
            <form onSubmit={handleSubmit}>
              <div className="form_div">
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" placeholder="Enter Your Username" onChange={handleInput} value={user.username} required />
              </div>
              <div className="form_div">
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" placeholder="Enter Your Email" onChange={handleInput} value={user.email} required />
              </div>
              <div className="form_div">
                <label htmlFor="phone">Phone:</label>
                <input type="number" name="phone" id="phone" placeholder="Enter Your Phone" onChange={handleInput} value={user.phone} required />
              </div>
              {!isEmailVerified && (
                <div className="form_div text-center">
                  <button type="submit" onClick={verifyEmail}>Verify Email</button>
                </div>
              )}
              {isEmailVerified && !isVerified && (
                <>
                  <div className="form_div">
                    <label htmlFor="otp">OTP:</label>
                    <input type="number" name="otp" id="otp" placeholder="Enter OTP" onChange={handleInput} value={user.otp} required />
                    <p className="mt-3 text-center text-danger"><MdErrorOutline />  Check spam if You can't see mail in your inbox</p>
                  </div>
                  <div className="form_div text-center">
                    <button onClick={verifyOTP}>Verify OTP</button>
                  </div>
                </>
              )}
              {isVerified && (
                <>
                  <div className="form_div">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" placeholder="Enter Your Password" onChange={handleInput} value={user.password} required />
                  </div>
                  <div className="form_div text-center">
                    <button type="submit">Register</button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register;
