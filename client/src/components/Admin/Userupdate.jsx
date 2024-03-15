import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';

function Userupdate({ _id }) {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const { id } = useParams();
  const { AuthorizationToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/admin/users/${id}`, {
          method: "GET",
          headers: {
            Authorization: AuthorizationToken,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(userData);
    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${id}/update`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: AuthorizationToken,
        },
        body: JSON.stringify(userData)

      });
   

      const data = await response.json();
      setUserData(data);
      if (response.ok) {
        
        // console.log('updated user:',userData);
        toast.success('User Updated successfully!!!', {
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
        navigate('/admin/users')
        
      }  else {
        // throw new Error('Failed to Update');
        toast.error(data.extraDetails, {
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
      console.log('Error  updating user:', error);
    }

    // Make your update request here
  };

  return (
    <>
      <h1 className='text-center'> Update The User</h1>

      <div className="right_container ">
        <div className="right_form ">
          <form onSubmit={handleSubmit}>
            <div className="form_div">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter Your Username"
                value={userData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form_div">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your email"
                value={userData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form_div">
              <label htmlFor="phone">Phone:</label>
              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="Enter Your phone"
                value={userData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form_div text-center">
              <button type="submit" onSubmit={handleSubmit}>Update</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Userupdate;
