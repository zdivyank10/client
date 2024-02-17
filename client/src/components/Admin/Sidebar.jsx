import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { MdOutlineContactPhone } from "react-icons/md";
import { ImBlog } from "react-icons/im";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin"><RxDashboard /> Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/users"><FaUsers /> Users</Link>
        </li>
        <li>
          <Link to="/admin/contacts"><MdOutlineContactPhone /> Contact Us</Link>
        </li>

        <li>
          <Link to="/admin/blogs"><GiNotebook /> All Blogs Approval</Link>
        </li>
        <li>
          <Link to="/admin/pendingblogs"><ImBlog /> Pending Blogs</Link>
 
        </li>
        <li>
          <Link to="/admin/approvedblogs"><ImBlog className='text-success'/> Approved Blogs</Link>
        </li>
       
        <li>
          <Link to="/admin/notapprovedblogs"><ImBlog className='text-danger'/> Declined Blogs</Link>
 
        </li>
       
   
       
      </ul>
    </div>
  );
};

export default Sidebar;
