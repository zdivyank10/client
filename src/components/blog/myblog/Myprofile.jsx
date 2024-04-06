import React, { useEffect, useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import './myprofile.css';
import { useAuth } from '../../../store/auth';
import MiniNavbar from './MiniNavbar';
import { MdError } from "react-icons/md";
import { toast } from 'react-toastify';

function Myprofile() {
    const { user } = useAuth();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''
    });

    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
    };

    useEffect(() => {
        const getuserinfo = async () => {
            try {
                const response = await fetch(`${process.env.API_BASE_URL}api/auth/${user._id}/user`, {
                    method: 'GET',
                });
                const data = await response.json();
                console.log('Fetched user data:', data);
                setUserData(data[0]); // Access the first element of the array
            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        };
        getuserinfo();
    }, [user._id]);

    const handleSavePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            setPasswordMatchError(
                <div className="text-danger"><MdError />
                Both Passwords do not match</div>
            );
            return;
        }
    
        try {
            const response = await fetch(`${process.env.API_BASE_URL}api/auth/${user._id}/upgpass`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
              body: JSON.stringify({ password: newPassword }),
            });
            const res_data = await response.json();
            console.log("res from pass",res_data); 
            // console.log('response of new pass',JSON.stringify({ newPassword });
    
            if (!response.ok) {
                toast.error(res_data.extraDetails,{

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
                throw new Error('Failed to update password');
            }
    
            // Password successfully updated
            if (response.ok) {
                setNewPassword('');
                setConfirmNewPassword('');
                setShowPasswordFields(false);
                toast.success(res_data.message,{
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
          
            console.log('Password updated successfully');
        } catch (error) {
            console.error('Error updating password:', error);
            // Handle error (e.g., display error message to user)
        }
    };
    
    // console.log('User data state:', userData); 

    return (
        <>
            <MiniNavbar />
          
            <div className="myprofile_container ">
                <div className=" myprofile_left ">
                   <img src="../../img/4133820.jpg" alt="profile image"  className='profile_img'/>
                    {/* <FaUserAlt className='m-3' size={250} style={{ border: "2px solid black", borderRadius: "50%", padding: "5px" }} /> */}
                </div>
                <div className="myprofile_right col-md-3 ">
            <h1 className='text-center m-3'>My Profile</h1>
             
                    <div className="profile_text ">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" className="form-control " defaultValue={userData.username} disabled />
                    </div>
                    <div className="profile_text">
                        <label htmlFor="phone">Phone:</label>
                        <input type="number" id="phone" className="form-control" defaultValue={userData.phone} disabled />
                    </div>
                    <div className="profile_text">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" className="form-control" defaultValue={userData.email} disabled/>
                    </div>
                    <div className="profile_text">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" className="form-control" defaultValue={userData.password} disabled/>
                    </div>
                    <button className='btn btn-link' onClick={togglePasswordFields}>Change Password?</button>

                    {showPasswordFields && (
                        <>
                            <div className="profile_text">
                                <label htmlFor="newPassword">New Password:</label>
                                <input type="password" id="newPassword" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div className="profile_text">
                                <label htmlFor="confirmNewPassword">Re-enter New Password:</label>
                                <input type="password" id="confirmNewPassword" className="form-control" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                            </div>
                            {passwordMatchError && <div className="error">{passwordMatchError}</div>}
                            <div className="profile_text">
                                <button className='btn  btn-dark mb-3' onClick={handleSavePassword}>Save Password</button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </>
    );
}

export default Myprofile;
