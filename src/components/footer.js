/* eslint-disable */
import React from 'react';
import mahaniLogo from "../images/logo-horiz-transparent.png";

const Footer = () => {
    return (
        <footer className="bg-lime-400 text-white p-4">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                <p className="text-center lg:text-left">&copy; 2025 UCKG Uganda Forms</p>
                <div className="flex items-center text-center lg:text-right mt-4 lg:mt-0">
                    <p className="flex items-center whitespace-nowrap">
                        Powered by <span className="mx-3">|</span>
                        <a href="https://www.mahanitech.com">
                            <img src={mahaniLogo} alt="Mahani Software engineering" className="h-6 mx-2" />
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
