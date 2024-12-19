import React, { useState } from 'react';
import logo from "../images/mahani-logo-horiz.png";

import { MdMenu } from 'react-icons/md';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md fixed w-full top-0 z-50">
            <nav className="container flex items-center justify-between py-4">
                <a href="/" className="text-xl font-bold">
                    <img src={logo} alt="Logo" className="h-12" />
                </a>

                <div className="hidden lg:flex space-x-8">
                    <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
                    <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
                    <a href="#services" className="text-gray-700 hover:text-blue-600">Services</a>
                    {/* <a href="#work" className="text-gray-700 hover:text-blue-600">Projects</a> */}
                    <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
                </div>

                <div className="lg:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
                        <MdMenu size={30} />
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="lg:hidden bg-white shadow-md">
                    <div className="flex flex-col items-center py-4">
                        <a href="#home" className="text-gray-700 py-2 hover:text-blue-600">Home</a>
                        <a href="#about" className="text-gray-700 py-2 hover:text-blue-600">About</a>
                        <a href="#services" className="text-gray-700 py-2 hover:text-blue-600">Services</a>
                        {/* <a href="#work" className="text-gray-700 py-2 hover:text-blue-600">Projects</a> */}
                        <a href="#contact" className="text-gray-700 py-2 hover:text-blue-600">Contact</a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;