import React from 'react';
import aboutUsIllustration from "../images/about.svg";

const About = () => {
    return (
        <section id="about" className="container py-16">
            <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2">
                    <img src={aboutUsIllustration} alt="About" className="w-full" />
                </div>
                <div className="lg:w-1/2 lg:pl-12 mt-8 lg:mt-0">
                    <h5 className="font-semibold text-base leading-6 text-red-500 mt-4 md:text-lg md:leading-7">
                        Why Choose Us
                    </h5>
                    <h4 className="font-bold font-nunito text-xl leading-8 mt-4 md:text-3xl md:leading-10 mb-4 text-zinc-700">
                        Your Goal is Our Achievement
                    </h4>
                    <p className="mt-4">
                        Whatever your goal is, we can develop a software system (or support you to develop one
                        yourself) and automate the journey to achieving that goal.
                    </p>
                    <ul className="mt-6">
                        <li className="flex items-center mt-4">
                            <span className="text-green-500">✔</span>
                            <p className="ml-3">We have systems available for immediate deployment.</p>
                        </li>
                        <li className="flex items-center mt-4">
                            <span className="text-green-500">✔</span>
                            <p className="ml-3">We specialize in handling the most technical aspects of software engineering.</p>
                        </li>
                        <li className="flex items-center mt-4">
                            <span className="text-green-500">✔</span>
                            <p className="ml-3">We cherish integrity, trust, and excellence.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default About;