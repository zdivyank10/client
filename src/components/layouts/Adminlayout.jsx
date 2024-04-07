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
    return (
      <>
      <div className="text-center">

      <img src="https://cdn.dribbble.com/userupload/6665658/file/original-a7d9005448729a1860ed9be4205b660b.gif" alt="" height={50} className='error_img mt-3 m-3' />
      </div>
      </>
  );
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