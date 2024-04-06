import React from 'react'
import { Link } from 'react-router-dom';
import './error.css';

function Error() {
  return (
    <>
    <div className="error_container">

        <h1 className='error_main'>404</h1>
        <p>Page not Found</p>
        <div className="btns_err">
        <Link to={"/"} className='btn_error btn btn-outline-success '>Return To HomePage</Link>
        <Link to={"/contact"} className='btn_error btn btn-outline-danger '>Any Doubt?</Link>

        </div>
    </div>
    </>
  )
}

export default Error