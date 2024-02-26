import React,{ useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../store/auth";

 const Navbar = () => {

  const {isLoggedIn , user} = useAuth();
  const [showNav, setShowNav] = useState(false);

  console.log('hello user info',user.isAdmin)
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
              <li className="nav_li"><NavLink to="/"  onClick={closeNav}>Home</NavLink></li>
              <li  className="nav_li"><NavLink to="/blog" onClick={closeNav}>Blog</NavLink></li>
              <li  className="nav_li"><NavLink to="/about" onClick={closeNav}>About</NavLink></li>
              <li  className="nav_li"><NavLink to="/contact" onClick={closeNav}>Contact</NavLink></li>

              {user.isAdmin ? <li  className="nav_li">
                  <NavLink to="/admin" onClick={closeNav}>Admin Dashboard</NavLink>
                  </li>
                   :
                null
                
              }
              {isLoggedIn ? <li  className="nav_li">
                  <NavLink to="/logout" onClick={closeNav}>Logout</NavLink>
                  </li>
                   :
                 <>
                <li  className="nav_li"><NavLink to="/login" onClick={closeNav}>Login</NavLink></li>
                <li  className="nav_li"><NavLink to="/register" onClick={closeNav}>Register</NavLink></li>

              
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