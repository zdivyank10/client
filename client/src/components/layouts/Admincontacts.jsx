import React, { useState, useEffect } from 'react';
import './admincontact.css';
import { useAuth } from '../../store/auth';
import { FaUserAlt } from 'react-icons/fa';

function Admincontacts() {
  const { AuthorizationToken } = useAuth();
  const [contact, setContact] = useState([]);

  useEffect(() => {
    getContact();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  const getContact = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/form/contact", {
        method: 'GET',
        headers: {
          Authorization: AuthorizationToken,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contact data');
      }

      const data = await response.json();
      setContact(data);
    } catch (error) {
      console.log('Error getting contacts:', error);
    }
  };

  return (
    <>
    <h1 className='text-center'>All ContactUs Forms</h1>
    <hr />
      <div className="row ">
  {contact.map((curr, index) => (
    <div className="col-lg-4 " key={index}>
      <div className="contactcontainer">
        <div className="userinformation">
          <FaUserAlt className='userpfp m-2'/>
          <h1>{curr.username}</h1>
          <p className='useremail'>{curr.email}</p>
        </div>
        <hr />
        <p className='contactmsg text-center mt-3'>{curr.message}</p>
      </div>
    </div>
  ))}
</div>


    </>
  );
}

export default Admincontacts;
