import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap'; 
import './admincontact.css';
import { useAuth } from '../../store/auth';
import { FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Admincontacts() {
  const { AuthorizationToken,API_BASE_URL } = useAuth();
  const [contact, setContact] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    getContact();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  const getContact = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/form/contact`, {
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

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contact.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <>
      <h1 className='text-center'>List of Contact us</h1>
      <div className="pagination-container align-items-center justify-content-center"> {/* Center the pagination */}
      <hr />
      <table className="table  table-hover ">
        <thead>
          <tr>
            <th scope="col">UserName</th>
            <th scope="col">Email</th>
            <th scope="col">Contact Us Message</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((curEle, index) => (
            <tr key={index} className='p-3'>
              <td>{curEle.username}</td>
              <td>{curEle.email}</td>
              <td>{curEle.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination>
        {contact.length > itemsPerPage && (
          <Pagination.Prev
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
        )}
        {Array.from({ length: Math.ceil(contact.length / itemsPerPage) }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === activePage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        {contact.length > itemsPerPage && (
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === Math.ceil(contact.length / itemsPerPage)}
          />
        )}
      </Pagination>
    </div>
    </>
  );
}

export default Admincontacts;
