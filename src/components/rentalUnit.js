import React, { useState } from "react";
import { FaSearchPlus } from "react-icons/fa"; // Importing the zoom icon

const RentalUnit = ({ unit }) => {
    // State hooks for main image, show contact button, and fullscreen mode
    const [mainImage, setMainImage] = useState(unit.mainImage);
    const [thumbnails, setThumbnails] = useState(unit.thumbnails);
    const [showContact, setShowContact] = useState(false);
    const [isZoomedIn, setIsZoomedIn] = useState(false); // State for fullscreen mode

    // Function to change the main image when a thumbnail is clicked
    const handleThumbnailClick = (image) => {
        setMainImage(image);
        // Move the old main image to thumbnails list
        setThumbnails([mainImage, ...thumbnails.filter((img) => img !== image)]);
    };

    // Toggle the visibility of contact information
    const toggleContact = () => {
        setShowContact(!showContact);
    };

    // Toggle zoom state to enter/exit fullscreen mode
    const toggleZoom = () => {
        setIsZoomedIn(!isZoomedIn); // Toggle the fullscreen state
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 p-4">
            <div className="flex flex-col">
                {/* Main Image */}
                <div className="relative w-full">
                    <img
                        src={mainImage}
                        alt="Main Image"
                        className={`w-full h-full object-cover rounded-lg shadow-md cursor-pointer ${isZoomedIn ? "fixed top-0 left-0 w-full h-full object-contain bg-black bg-opacity-80 z-50" : ""}`}
                        onClick={toggleZoom} // Click to toggle fullscreen mode
                    />
                    {/* Zoom In Icon */}
                    {!isZoomedIn && (
                        <div className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md cursor-pointer z-10">
                            <FaSearchPlus size={24} onClick={toggleZoom} />
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                <div className="w-full p-4 mt-4 lg:mt-0">
                    <div className="flex overflow-x-auto space-x-2">
                        {thumbnails.slice(0, 4).map((thumbnail, index) => (
                            <img
                                key={index}
                                src={thumbnail}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg mb-2 lg:mb-0 cursor-pointer transform hover:scale-105 transition duration-200"
                                onClick={() => handleThumbnailClick(thumbnail)}
                            />
                        ))}
                    </div>
                    {/* More images hidden message */}
                    {thumbnails.length > 4 && (
                        <div className="mt-2 text-xs text-gray-500">+{thumbnails.length - 4} more images</div>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-2xl font-semibold text-gray-800">{unit.title}</h2>
                <p className="text-gray-600">Location: {unit.location}</p>
                <p className="text-xl font-bold text-green-600">{unit.price}</p>
                <p className="text-gray-600 mt-2">{unit.description}</p>

                {/* Show contacts button */}
                <div className="mt-4">
                    {!showContact ? (
                        <button
                            onClick={toggleContact}
                            className="bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                            Show Contacts
                        </button>
                    ) : (
                        <div className="mt-2">
                            <p className="text-gray-700">Phone: {unit.contact.phone}</p>
                            <p className="text-gray-700">Email: {unit.contact.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RentalUnit;
