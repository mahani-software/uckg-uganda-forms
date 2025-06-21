import React, { useState, useRef } from 'react';

const FloatingLabelInput = ({ label, name, type = "text", required = false }) => {
    const [value, setValue] = useState("");

    const isFloating = value.length > 0;

    return (
        <div className="relative w-full">
            <input
                type={type}
                name={name}
                required={required}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="peer w-full border-b border-gray-300 bg-transparent text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 py-2"
                placeholder={label}
            />
            <label
                className={`
                    absolute left-0 
                    ${isFloating ? "-top-2 text-sm text-blue-600" : "top-2 text-base text-gray-400"} 
                    transition-all peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600
                `}
            >
                {label}
            </label>
        </div>
    );
};

export { FloatingLabelInput }