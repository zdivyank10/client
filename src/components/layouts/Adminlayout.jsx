import React, { useEffect } from 'react'
import Sidebar from '../Admin/Sidebar'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../store/auth';

function Adminlayout() {
  const { user,isLoading } = useAuth();
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 5000);

  //   return () => clearTimeout(delay);

  // }, []);
  if (isLoading) {
    return <img src="../img/Ellipsis-1s-217px.gif"height={600} alt="Loading" />
  }

  if (!user.isAdmin) {
    return <Navigate to='/'/>
  }
  return (
    <>
    <Sidebar />
    <div className="main-content">
    <Outlet />
    </div>
    </>
  )
}

export default Adminlayout