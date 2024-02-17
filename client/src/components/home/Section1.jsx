import React, { useEffect } from 'react'
import { MdOutlineSearch } from "react-icons/md";

function Section1() {
  return (
    <>
    <div  className="home_container">
            <div  className="home_left">
                <h1 data-aos="fade-right" className='home_left_h1'>Welcome to Ink Garden</h1>
            
                <p data-aos="fade-right" className='home_left_p'>
                In our digital haven, every thought, idea, and emotion finds expression. Welcome to Ink Garden, where the power of words blossoms into captivating narratives. </p>
                  {/* <img src="../img/search.png" height='40px' className=""alt="serach log" /> */}
                  <MdOutlineSearch data-aos="fade-right" className='searchicon'/>
                  <input data-aos="fade-right" type="text" className='left_search' placeholder='search blog '/>
            </div>
        
            <div data-aos="fade-left" className="home_right">
              
                <img src="https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="image for homepage" className='home_img'/>
            </div>
            
        </div>
    </>
  )
}

export default Section1