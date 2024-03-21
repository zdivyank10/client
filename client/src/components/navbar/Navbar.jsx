import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../store/auth";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'; // Add this import statement
import { FaUserAlt } from "react-icons/fa";



const Navbar = () => {

  const { isLoggedIn, user } = useAuth();
  const [showNav, setShowNav] = useState(false);

  console.log('hello user admin', user.isAdmin)
  const toggleNav = () => {
    // console.log("hello");
    setShowNav(!showNav);
  };

  const closeNav = () => {
    setShowNav(false);
  };


  return (
    <>
      <header>
        <div className={`navcontainer ${showNav ? "show-nav" : ""}`}>
          <div className="logo-brand">
            <ul>
              <li>
                <NavLink to="/" >Ink Garden</NavLink>
              </li>
            </ul>
          </div>

          <nav>

            <ul className={showNav ? "show" : ""}>
              <li className="nav_li"><NavLink to="/" onClick={closeNav}>Home</NavLink></li>
              <li className="nav_li"><NavLink to="/blog" onClick={closeNav}>Blog</NavLink></li>
              <li className="nav_li"><NavLink to="/about" onClick={closeNav}>About</NavLink></li>
              <li className="nav_li"><NavLink to="/contact" onClick={closeNav}>Contact</NavLink></li>
              <li className="nav_li"><NavLink to="/editorschoice" onClick={closeNav}>Editor's Choice</NavLink></li>

              {user.isAdmin ? <li className="nav_li">
                <NavLink to="/admin" onClick={closeNav}>Admin Dashboard</NavLink>
              </li>
                :
                null

              }
              {isLoggedIn ?



                <ButtonGroup>

                  {/* <FaUserAlt /> */}

                  <DropdownButton as={ButtonGroup} title={<>
                    <FaUserAlt className="me-2"/>   {user.username}
                  </>} id="bg-nested-dropdown" variant="outline-light">
                    <Dropdown.Item eventKey="1">
                   
                      <NavLink to= {`/myblog/${user._id}/profile`} onClick={closeNav}>My Profile</NavLink>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">
                      <NavLink to={`/myblog/${user._id}`}  className='text-dark' onClick={closeNav}>My Blogs</NavLink>
                    
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="3">
                      <NavLink to="/logout"  className='text-dark' onClick={closeNav}>Logout</NavLink>
                    </Dropdown.Item>
                  </DropdownButton>
                </ButtonGroup>


                :
                <>
                  <li className="nav_li"><NavLink to="/login" onClick={closeNav}>Login</NavLink></li>
                  <li className="nav_li"><NavLink to="/register" onClick={closeNav}>Register</NavLink></li>


                </>

              }

            </ul>
          </nav>

          <div className="nav-toggle" onClick={toggleNav}>
            &#9776; {/* Unicode character for hamburger icon */}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar