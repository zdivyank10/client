import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/auth';
import { Button, Dropdown, DropdownButton, Pagination } from 'react-bootstrap'; // Import Pagination component
import { RiAdminLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import DeleteConfirmationModal from '../Admin/DeleteConfirmationModal';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { GiImperialCrown } from 'react-icons/gi';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const { AuthorizationToken, API_BASE_URL, user } = useAuth();
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/users/delete/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: AuthorizationToken,
        },
      });
      const data = await response.json();
      console.log(`Deleted users ${data}`);
      // Refresh user list after deletion
      getAllUsersData();
    } catch (error) {
      console.log(error);
    }
    // Hide the confirmation modal after deletion
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    getAllUsersData();
  }, []);

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem); // Change 'contact' to 'users'

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const getAllUsersData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/users`, {
        method: 'GET',
        headers: {
          Authorization: AuthorizationToken,
        },
      });
      const data = await response.json();
      // console.log(`users ${data}`);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeAdmin = async (userId) => {
    console.log("Removing admin role for user with ID:", userId);
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/remove/${userId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: false })
      });
      const removedAdmin = await response.json();
      console.log('Removed admin role:', removedAdmin);
      // After removing admin role, you might want to refresh the list of users
      getAllUsersData();
    } catch (error) {
      console.log('Error removing admin role:', error);
    }
  };

  const makeAdmin = async (userId) => {
    console.log("Making user with ID:", userId, "an admin...");
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/${userId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: true })
      });
      const newAdmin = await response.json();
      console.log('Made user admin:', newAdmin);
      // After making the user an admin, you might want to refresh the list of users
      getAllUsersData();
    } catch (error) {
      console.log('Error making user admin:', error);
    }
  };

  return (
    <>
      <h1 className='text-center'>List of Ink Garden Users</h1>
      <hr />
      <table className="table  table-hover ">
        <thead>
          <tr>
            <th scope="col">UserName</th>
            <th scope="col">Email</th>
            <th scope="col">Contact No</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((curEle, index) => (
            <tr key={index}>
                <td>
        {curEle.isAdmin && <GiImperialCrown className="admin-logo" />} {/* Display admin logo if user is admin */}
        {curEle.username} {/* Display username */}
      </td>
              <td>{curEle.email}</td>
              <td>{curEle.phone}</td>
              <td><Link to={`/admin/users/${curEle._id}/edit`} className='btn btn-warning'>Update</Link></td>
              <td>
                <Button
                  className='btn btn-danger'
                  onClick={() => {
                    setUserIdToDelete(curEle._id);
                    setShowConfirmationModal(true);
                  }}
                >
                  Delete
                </Button>
              </td>
              <td>
                {(user.isAdmin && user._id !== curEle._id) ? (
                  <DropdownButton id={`dropdown-button-${index}`} title={<HiOutlineDotsVertical className='' />} className='text-dark' >
                    {curEle.isAdmin ? (
                      <Dropdown.Item onClick={() => removeAdmin(curEle._id)}><RiAdminLine size={20} /> Remove Admin</Dropdown.Item>
                    ) : (
                      <Dropdown.Item onClick={() => makeAdmin(curEle._id)}><RiAdminLine size={20} /> Make Admin</Dropdown.Item>
                    )}
                  </DropdownButton>
                ) : (
                  <DropdownButton id={`dropdown-button-${index}`} title={<HiOutlineDotsVertical className='' />} className='text-dark' disabled>
                    <Dropdown.Item ><RiAdminLine size={20} /> Can't Remove Yourself</Dropdown.Item>
                  </DropdownButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirmDelete={handleDeleteUser}
      />

      <Pagination>
        {users.length > itemsPerPage && (
          <Pagination.Prev
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
        )}
        {Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === activePage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        {users.length > itemsPerPage && (
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === Math.ceil(users.length / itemsPerPage)}
          />
        )}
      </Pagination>
    </>
  );
}

export default AdminUsers;
