import React from 'react'
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../store/auth';




function MiniNavbar() {
    const { user } = useAuth();
  return (
    <div className="status col-md-6 ">
          
    <NavLink to={`/myblog/${user._id}`} className='staus_info'><p className='status_info'>All blogs</p></NavLink>
    <NavLink to= {`/myblog/${user._id}/approved`} className='staus_info'><p className='status_info'>Approved blogs</p></NavLink>
    <NavLink to= {`/myblog/${user._id}/notapproved`}  className='staus_info'><p className='status_info'>Not Approved blogs</p></NavLink>
    <NavLink to= {`/myblog/${user._id}/pending`} className='staus_info'><p className='status_info'>Pending blogs</p></NavLink>

</div>
  )
}

export default MiniNavbar