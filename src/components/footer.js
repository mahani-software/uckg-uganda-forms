import React from 'react';
import logo from "../images/logo-horiz-transparent.png";
import bgimage1 from "../images/footer-shape-left.png";
import bgimage2 from "../images/footer-shape-right.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTelegramPlane } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-zinc-700 relative z-10 m-0 p-2">
            {/* Background shapes */}
            <div className="absolute left-0 top-0 opacity-10 h-full w-1/3">
                <img src={bgimage1} alt="Footer Left Shape" className="object-cover w-full h-full" />
            </div>
            <div className="absolute right-0 top-0 opacity-10 h-full w-1/3">
                <img src={bgimage2} alt="Footer Right Shape" className="object-cover w-full h-full" />
            </div>
            {/* Footer content container */}
            <div className="w-full">
                {/* Footer main widget */}
                <div className="py-18 lg:py-24 w-full px-[10%] lg:px-[15%] footer_widget pb-120">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-4">
                        {/* Left section - About */}
                        <div className="text-center lg:text-left">
                            <div className="footer_logo mb-6">
                                <a href="javascript:void(0)"><img src={logo} alt="Logo" className="max-w-[70%] mx-auto lg:mx-0" /></a>
                            </div>
                            <div className="footer_content">
                                <p className="text-white text-sm lg:text-base leading-relaxed">
                                    We deal in developing software systems, DevOps engineering, Networking, Cloud computing,
                                    Blockchain development, systems analysis and design, and more.
                                </p>
                            </div>
                        </div>

                        {/* Middle section - Quick Links */}
                        <div className="text-center lg:text-left lg:pl-20">
                            <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
                            <ul className="space-y-4">
                                <li><a href="javascript:void(0)" className="text-blue-200 hover:text-white underline">Company</a></li>
                                <li><a href="javascript:void(0)" className="text-blue-200 hover:text-white underline">Privacy Policy</a></li>
                                <li><a href="javascript:void(0)" className="text-blue-200 hover:text-white underline">About</a></li>
                            </ul>
                        </div>

                        {/* Right section - Location */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
                            <p className="text-white text-sm lg:text-base text-zinc-500 italic">
                                Ntare-Rwebikoona road, <br />
                                Opp. King of Kings Church, <br />
                                Mbarara city - Uganda. <br />
                                Tel: +256781224508 <br />
                                Email: <a href="mailto:engineering@mahanitech.com" className="hover:text-white">engineering@mahanitech.com</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer copyright */}
                <div className="border-t-2 border-solid border-white border-opacity-10 pt-6 pb-4 text-center">
                    <div className="flex pt-2 pb-3 mx-3 text-center items-center justify-center lg:justify-start">
                        <ul className="flex justify-center sm:justify-start">
                            <li className="mr-3">
                                <a href="https://www.linkedin.com/company/mahani-software-engineering/" aria-label="Facebook">
                                    <FaFacebookF className="text-white text-2xl hover:text-theme-color" />
                                </a>
                            </li>
                            <li className="mr-3">
                                <a href="https://www.linkedin.com/company/mahani-software-engineering/" aria-label="Twitter">
                                    <FaTwitter className="text-white text-2xl hover:text-theme-color" />
                                </a>
                            </li>
                            <li className="mr-3">
                                <a href="https://www.linkedin.com/company/mahani-software-engineering/" aria-label="Instagram">
                                    <FaInstagram className="text-white text-2xl hover:text-theme-color" />
                                </a>
                            </li>
                            <li className="mr-3">
                                <a href="https://www.linkedin.com/company/mahani-software-engineering/" aria-label="LinkedIn">
                                    <FaLinkedinIn className="text-white text-2xl hover:text-theme-color" />
                                </a>
                            </li>
                            <li className="mr-3">
                                <a href="https://www.linkedin.com/company/mahani-software-engineering/" aria-label="Telegram">
                                    <FaTelegramPlane className="text-white text-2xl hover:text-theme-color" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="py-2">
                        <p className="text-white text-sm">
                            &copy; {new Date().getFullYear()} <a href="https://mahanitech.com" className="text-white hover:text-theme-color" rel="nofollow">Mahani Software Engineering</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;