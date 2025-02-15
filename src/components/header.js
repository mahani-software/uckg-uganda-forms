import React, { useState } from 'react';
import logo from "../images/rento-scanner-logo.png";
import { MdMenu } from 'react-icons/md';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-lime-600 text-white p-4 px-[5%]">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    {/* Logo and Company Name */}
                    <img src={logo} alt="Logo" className="h-10 w-18 mr-5" />
                    <div className="font-bold text-xl">rento-scanner</div>
                </div>
                <nav className="lg:flex hidden">
                    <a href="#" className="text-white mx-4">Home</a>
                    <a href="#" className="text-white mx-4">About</a>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
                        <MdMenu size={30} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full bg-lime-50 shadow-md">
                    <div className="flex flex-col items-center py-4">
                        <a href="#home" className="700 py-2 text-blue-600">Home</a>
                        <a href="#about" className="py-2 text-blue-600">About</a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
