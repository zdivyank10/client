import React from 'react'
import './home.css'
function Section2() {
  return (
    <>
      <div className="section2container">

        <h1 data-aos="fade-up" className='home_h1 text-center'>How Ink Garden Works?</h1>

        <div className="steps text-center">

          <div data-aos="zoom-in" className="home_card ">

            <h3 className='home_h3 text-center'>step 1</h3>
            <p>Think Any Ideas That helps Niche</p>

          </div>

          <div data-aos="zoom-in" className="home_card ">

            <h3 className='home_h3 text-center'>step 2</h3>
            <p>portray the Ideas with valueable words
            </p>

          </div>
          {/* </div> */}

          {/* <div className="steps text-center"> */}


          <div data-aos="zoom-in" className="home_card ">

            <h3 className='home_h3 text-center'>step 3</h3>
            <p>Higher Authority Reviews the blogs</p>

          </div>
          <div data-aos="zoom-in" className="home_card ">

            <h3 className='home_h3 text-center'>step 4</h3>
            <p>Approved blogs will be shared with all users.</p>

          </div>

        </div>
      </div>
    </>
  )
}

export default Section2