import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/auth';
import { Button } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import DeleteConfirmationModal from '../Admin/DeleteConfirmationModal';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const { AuthorizationToken,API_BASE_URL } = useAuth();

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

  const getAllUsersData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}api/admin/users`, {
        method: 'GET',
        headers: {
          Authorization: AuthorizationToken,
        },
      });
      const data = await response.json();
      console.log(`users ${data}`);
      setUsers(data);
    } catch (error) {
      console.log(error);
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
          </tr>
        </thead>
        <tbody>
          {users.map((curEle, index) => (
            <tr key={index}>
              <td>{curEle.username}</td>
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
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirmDelete={handleDeleteUser}
      />
    </>
  );
}

export default AdminUsers;
