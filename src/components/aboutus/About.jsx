import React from 'react'
import './about.css'
import { AiOutlineInstagram } from 'react-icons/ai'
import { FaSquareXTwitter } from 'react-icons/fa6'
import { SiFacebook } from 'react-icons/si'
import { Link } from 'react-router-dom'
function About() {
    return (
        <>
            <div className="about_container">
                <h1 className='home_left_h1 text-center'>Welcome to Ink Garden</h1>
                {/* <h1 className='about_head  text-center'>Welcome to Ink Garden</h1> */}
                <img src="../img/logo.jpeg" alt="" className='about_logo mt-5 mb-5' />
                <hr />

                <div className="ourmission text-center">
                    <h1>Our Mission</h1>
                    <p className='mission  justify-content-center align-items-center'>
                        Our mission at Ink Garden is to provide a nurturing space where individuals can freely express themselves through the written word. We strive to cultivate a community where every voice is valued and every story is celebrated. By offering a platform for creative expression, we aim to inspire, connect, and empower individuals from all walks of life. Through storytelling, we seek to foster understanding, empathy, and positive change in the world. Our ultimate goal is to build a vibrant community of writers and readers who share a passion for storytelling and a commitment to making a difference in the world.</p>

                </div>

                <hr /><br />

                <div className="about2">


                    <div className="left_about">
                        <div className="about_content ">

                            <h1>
                                What We Offer
                            </h1>
                            <ul className='about_ul'>
                                <li className='about_li'>A Platform for Expression:</li><p>
                                    We provide a user-friendly platform where writers can easily create and publish their blogs on a variety of topics.
                                </p>
                                <li className='about_li'>Community Engagement:</li><p>
                                    Our community of writers and readers is actively engaged in providing feedback, support, and encouragement to one another.
                                </p>
                                <li className='about_li'>Opportunities for Growth:</li><p>
                                    Whether you're a seasoned writer or just starting out, we offer resources and support to help you grow as a writer and reach a wider audience.
                                </p>
                                <li className='about_li'>Quality Content: </li><p>
                                    We strive to maintain high standards of quality for the content published on our platform, ensuring that readers have access to valuable and engaging stories.
                                </p>

                            </ul>
                        </div>
                    </div>
                    <div className="right_about">
                        <img src="../img/6502432.jpg" alt="" className='aboutimg' />
                        {/* <img src="https://img.freepik.com/free-vector/product-presentation-concept-illustration_114360-8196.jpg?w=996&t=st=1709324213~exp=1709324813~hmac=ad81937dc9db36f3ca471bb88396dd43a6da4b375d04822b5c0743007a8a5f91" alt="" className='aboutimg' /> */}

                    </div>
                </div>
                <hr />

                <div className="vision_container text-center">


                    <div className="vision">
                        <h1>Our Vision</h1>
                        <p>Our vision is to be the premier destination for bloggers of IT backgrounds and interests to share their stories, engage with a vibrant community, and make a difference in the world. By continuously evolving and innovating our platform, we strive to provide the best possible experience for our users and create a lasting impact in the online blogging landscape.
                        </p>
                    </div>

                    <div className="vision">
                        <h1>Join Us on Our Mission</h1>
                        <p>
                            We invite you to join us on our mission to celebrate the power of storytelling, embrace diversity, and build a more connected and empathetic world. Whether you're a seasoned blogger, aspiring writer, or passionate reader, there's a place for you in our community. Together, let's share, connect, and inspire change through the art of blogging.
                        </p>
                    </div>

                    <div className="vision">
                        <h1>Join Our Community</h1>
                        <p>Connect with us on social media to stay updated on the latest blog posts, community events, and more:

                            <div
                                style={{
                                    backgroundColor: '#000',
                                    borderRadius: '15px',
                                }}
                                className='m-3'
                            >

                                <Link to='https://www.facebook.com/divyank.zaveri/'>
                                    <SiFacebook
                                        style={{
                                            color: '#59e4a8',
                                        }} size={25}
                                        className='m-3'
                                    />
                                </Link>


                                <Link to='https://www.instagram.com/zdivyank/'>
                                    <AiOutlineInstagram style={{
                                        color: '#59e4a8',
                                    }} size={30} className='m-3'
                                    />
                                </Link>

                                 <Link to='https://twitter.com/DivyankZaveri?t=VMloUue7kwtwdNCmkCAsTg'>
                                <FaSquareXTwitter
                                    style={{
                                        color: '#59e4a8',
                                    }} size={25} className='m-3'
                                    />
                                    </Link>



                            </div>




                        </p>
                    </div>
                    <div className="vision">
                        <h1>Our Team</h1>
                        <p>
                            Divyank-Frontend,Backend,Database <br />
                            Sahil-Frontend<br />
                            Nikita-Frontend<br />
                            Siddhi-Frontend<br />
                        </p>

                    </div>

                </div>

                <hr />

                <div className="about2">
                    <div className="about_left2">

                        <h1>
                            community Gueidline Rules
                        </h1>
                        <ul className='about_ul'>
                            <li className='about_li'>Respectful Behavior:</li><p>
                                Treat others with kindness and empathy, avoiding harassment or personal attacks.
                            </p>
                            <li className='about_li'>No Offensive Content:</li><p>
                                Refrain from posting or sharing offensive, obscene, or inappropriate content that promotes violence or discrimination.
                            </p>
                            <li className='about_li'>Privacy and Safety:</li><p>
                                Respect the privacy of others, refrain from sharing personal information without consent, and report abusive behavior.
                            </p>
                            <li className='about_li'>Use of Language: </li><p>
                                Use appropriate language and tone, avoiding offensive or derogatory language and respecting cultural differences.
                            </p>
                            <li className='about_li'>Content Moderation: </li><p>
                                Respect moderation decisions, refrain from circumventing measures, and report violations promptly.
                            </p>

                        </ul>
                    </div>

                    <div className="">
                        <img src="../img/7542093.jpg" alt="" className='about_img2' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default About