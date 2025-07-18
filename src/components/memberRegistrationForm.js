import React, { useState, useRef } from 'react';

import { FloatingLabelInput } from "./floatingLabelInput"

const MenberRegistrationForm = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [photoLabel, setPhotoLabel] = useState('Profile Photo');

    const fileInputRef = useRef(null);

    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbykm0lNGJzPfmgOI44rnv02uydBKtIf9SrCij8dFQO_qpX5j1LWD1x2YKY-hI4XeVay/exec";
    const API_KEY = "mahanitechuckgugandaformssecret";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setLoading(true);

        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const file = formData.get('photo');

        if (!name || !email || !file) {
            setStatus('Please fill out all fields.');
            setLoading(false);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result?.split(',')[1];

            const payload = {
                name,
                email,
                phone,
                photoBase64: base64,
                photoName: file.name
            };

            try {
                const res = await fetch(WEB_APP_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY
                    },
                    body: JSON.stringify(payload)
                });

                const text = await res.text();
                setStatus(`✅ ${text}`);
                setPreview(null);
                setPhotoLabel('Profile Photo');
            } catch (err) {
                console.error(err);
                setStatus('❌ Submission failed.');
            } finally {
                setLoading(false);
                e.target.reset();
            }
        };

        reader.readAsDataURL(file);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setPhotoLabel('Change Photo');
        } else {
            setPreview(null);
            setPhotoLabel('Profile Photo');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800"> Register member </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FloatingLabelInput label="Name" name="name" required />
                </div>
                <div>
                    <FloatingLabelInput label="Email" name="email" type="email" required />
                </div>
                <div>
                    <FloatingLabelInput label="Phone" name="phone" required />
                </div>

                {/* Preview Image */}
                {preview && (
                    <div>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full max-h-48 object-cover rounded-xl border border-lime-400"
                        />
                    </div>
                )}

                {/* Custom Photo Input */}
                <div>
                    <div
                        onClick={triggerFileInput}
                        className="cursor-pointer inline-block border border-lime-400 hover:bg-blue-200 text-blue-600 text-sm font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        {photoLabel}
                    </div>

                    {/* Hidden actual file input */}
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        required
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        className="hidden"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-8 py-2 px-4 rounded-md text-white font-medium ${loading
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>

            {status && (
                <p className="mt-4 text-center text-sm font-medium text-gray-700">{status}</p>
            )}
        </div>
    );
};

export default MenberRegistrationForm;
