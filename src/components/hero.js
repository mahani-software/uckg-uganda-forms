/* eslint-disable */
import React from 'react';
import bannerImage from "../images/bgimage01.webp";
import logoImage from '../images/logo-advert-transparent2.png';

const Hero = () => {

    return (
        <div
            id="home"
            style={{ backgroundImage: `url(${bannerImage})`, backgroundRepeat: "no-repeat", backgroundSize: "100%", backgroundPositionY: "0", backgroundPositionX: "0" }}
            className={`flex relative z-10 lg:flex justify-between flex-col lg:flex-row lg:gap-2 bg-no-repeat mt-[70px] bg-[100%] lg:bg-[75%]`}
        >
            <div className="w-full lg:w-[40%] mt-200">
                <div className="w-full p-[5%] pr-0 items-center">
                    <div
                        className="p-[5%] rounded w-full pt-100"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px' }}
                    >
                        <h2 className="hero_title text-2xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-3xl font-extrabold">
                            We are experts in <br /> <span className="text-theme-color">software engineering</span>
                        </h2>
                        <p className="mt-8 lg:mr-8">
                            We deal in developing software systems, DevOps engineering,
                            Networking, Cloud computing, Blockchain development,
                            systems analysis and design, and more.
                        </p>
                        {/* 
                        <div className="hero_btn mt-10">
                            <a className="main-btn" href="#work"><b>See our projects</b></a>
                        </div> 
                        */}
                    </div>
                </div>
            </div>

            <div className="relative items-center pt-[50px] overflow-hidden p-8 pr-0 w-full lg:w-[50%]">
                <div class="absolute inset-0 bg-blue-50 transform -skew-x-[15deg] z-0 ml-[10%] w-[200%]"></div>
                <div className="relative image z-50 pl-[10%]">
                    <img src={logoImage} alt="" />
                </div>
            </div>
        </div>
    );
};

export default Hero;