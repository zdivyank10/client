import React, { useEffect, useState } from 'react';

function Userupdate({ id }) {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`http://localhost:8000/admin/users/${id}`);
        const userData = await response.json();
        console.log('response:',response);
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData);

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
              <button type="submit">Update</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Userupdate;
