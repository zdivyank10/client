import React from 'react';
import { useEffect } from 'react';

const Toast = ({ showToast, setShowToast }) => {
        // Auto-hide the toast after a delay
        useEffect(() => {
          const timer = setTimeout(() => {
            setShowToast(false);
          }, 3000); // Adjust the duration as needed
      
          return () => clearTimeout(timer);
        }, [showToast, setShowToast]);
      
  return (
    <>
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div className="toast-header">
      <img src="..." className="rounded me-2" alt="..."/>
      <strong className="me-auto">Bootstrap</strong>
      <small>Just Now</small>
      <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div className="toast-body">
      Thank You,For Registering Yourself
    </div>
  </div>
</div>
    </>
  )
}

export default Toast