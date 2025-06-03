import React, { useState } from 'react';

const CoursesIntakeForm = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

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
            const base64 = reader.result.split(',')[1];

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

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Register Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        required
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading
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

export default CoursesIntakeForm;
