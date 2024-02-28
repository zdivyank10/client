import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../src/components/home/Home";
import Contact from "../src/components/contact/Contact";
// import About from "./pages/About";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
// import Service from "./pages/Service";
import Blog from "./components/blog/Blog";
import Addpost from "./components/blog/Addpost";
import Navbar from "./components/navbar/Navbar";
import { Logout } from "./components/logout/Logout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../src/Style.css';
import Error from "./components/error/Error";
import Adminlayout from "./components/layouts/Adminlayout";
import AdminUsers from "./components/layouts/AdminUsers";
import Admincontacts from "./components/layouts/Admincontacts";
// import Adminblogs from "./components/layouts/ADminblogs";
import Adminblogs from "./components/layouts/Adminblogs";
import AdminDashboard from "./components/layouts/AdminDashboard";
import Userupdate from "./components/Admin/Userupdate";
// animations
import 'aos/dist/aos.css';
import Aos from 'aos';
import Singlepost from "./components/blog/Singlepost";
import Approvedblogs from "./components/layouts/Approvedblogs";
import NotApprovedblogs from "./components/layouts/NotApprovedblogs";
import Pendingblogs from "./components/layouts/Pendingblogs";
import FullBlog from "./components/blog/FullBlog";
import Myblog from "./components/blog/Myblog";
import MyApprovedblogs from "./components/blog/myblog/MyApprovedblogs";
import MyNotapprovedblogs from "./components/blog/myblog/MyNotapprovedblogs";
import MypPendingblogs from "./components/blog/myblog/MypPendingblogs";




function App() {
  useEffect(() => {
    Aos.init({duration : 1500});
  }, [])
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/contact" element={<Contact />} />

          {/* <Route path="/about" element={<About/>} />  */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/addpost" element={<Addpost />} />
          <Route path="/eachpost" element={<Singlepost />} />
          <Route path="/blog/:blog_id" element={<FullBlog />} />
          <Route path='/myblog/:_id' element={<Myblog />} />
          <Route path='/myblog/:_id/approved' element={<MyApprovedblogs />} />
          <Route path='/myblog/:_id/notapproved' element={<MyNotapprovedblogs />} />
          <Route path='/myblog/:_id/pending' element={<MypPendingblogs />} />
          {/* <Route path="/myblog" element={<Myblog />} /> */}
          <Route path="*" element={<Error />} />


          {/* admin */}
          <Route path='/admin' element={<Adminlayout />}>
                <Route path ='' element={<AdminDashboard/>} />
                <Route path ='users'element={<AdminUsers/>} />
                <Route path ='contacts'element={<Admincontacts/>} />
                <Route path ='blogs'element={<Adminblogs/>} />
                <Route path ={`users/:id/edit` }element={<Userupdate/>} />
                <Route path ='approvedblogs' element={<Approvedblogs/>} />
                <Route path ='notapprovedblogs' element={<NotApprovedblogs/>} />
                <Route path ='pendingblogs' element={<Pendingblogs/>} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App