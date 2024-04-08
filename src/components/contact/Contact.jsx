import React,{ useState} from "react";
import "./contact.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../store/auth";
import { CONFIGS } from "../../../config";

function Contact() {
//   const navigate = useNavigate();
  
  const [userData,setuserData] = useState(true);
  const {user} = useAuth();
 
  const defaultContactForm = {
    username: "",
    email: "",
    message: "",

  }

    const [data,setData] = useState(defaultContactForm);

    const [contact,setContact] = useState({

      username: "",
      email: "",
      message: "",
    })

     
  if(userData && user)
  {
    setContact({
        username : user.username,
        email : user.email,
        message : "",
    })
    setuserData(false);
  }

    const handleInput = (e)=>{
      let name = e.target.name;
      let value = e.target.value;
      setContact({...contact,
      [name] : value,
    })
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(contact);
    
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/api/form/contact`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contact),
        });
    
        if (response.ok) {
          setData(defaultContactForm);
          const userData = await response.json();
          toast.success('Message Sent successfully!', {
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
    
          console.log("contact msg", userData);
        } else {
          const errorData = await response.json();
          toast.error(errorData.extraDetails || errorData.message, {
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
          console.log('contactus failed');
        }
      } catch (error) {
        console.error('Error from submitting data', error);
        toast.error('Failed to send message. Please try again later.', {
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
      }}
    
        
      
      
    
    
    return (
    <>
      
     
      <div className="reg_container">
            <div  className="left_container col-md-6 text-center">
               
              <h1 data-aos="fade-left">Having Doubts?</h1>
              <div data-aos="fade-right" className="mb-3"> 
             <p className="p_first"> <span className="usermsg">Hey {user.username} ,</span> Certainly! Feel free to express your doubts or questions, and We'll do my best to assist you. If you have a more detailed or long explanation, go ahead and provide the information, and We'll try to help you with whatever you need.</p>


            </div>
            </div>


            <div className="right_container col-md-6">
              <h1 data-aos="fade-up"  className="text-center left_h1">Contact Us</h1>


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
                      <label htmlFor="message">
                        Message:
                      </label>

                    <textarea  rows={5} placeholder="Enter message" name="message" className="txtarea" id="message" onChange={handleInput} value={user.message} required/>
                      {/* <input type="textarea" name="phone" id="phone" placeholder="Enter Your phone" onChange={handleInput} value={user.phone} required/> */}
                  </div>

                    <div className="form_div text-center">
                      <button type="submit">Send Message</button>
                    </div>
                </form>
              </div>
            </div>

      </div>
     
    </>
  )
}

export default Contact