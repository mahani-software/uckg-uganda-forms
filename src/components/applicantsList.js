import React, { useState, useEffect, useRef } from 'react';
import { useItemsListReaderQuery } from '../backend/api/sharedCrud';
import { useSelector } from 'react-redux';
import { selectList } from "../backend/features/sharedMainState";

import DEFAULT_AVATAR from "../images/userRounded.png";
import DEFAULT_AVATAR2 from "../images/user.png";

const ApplicantList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [page, setPage] = useState(1);
    const containerRef = useRef(null);
    const lastScrollTop = useRef(0);

    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useItemsListReaderQuery({ entity: "applicant", limit: 100, page });

    const applicants = useSelector(st => selectList(st, "applicant")) || [];

    const filtered = applicants.filter(applicant =>
        `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handlePrint = (applicant) => {
        const printWindow = window.open('', '_blank');
        const printable = `
            <html>
                <head>
                    <title>Applicant Details</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        h2 { margin-bottom: 16px; }
                        dt { font-weight: bold; margin-top: 10px; }
                        dd { margin-left: 10px; margin-bottom: 8px; }
                        img { width: 100px; border-radius: 10px; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <img src={DEFAULT_AVATAR} alt="Avatar" />
                    <h2>${applicant.firstName} ${applicant.lastName}</h2>
                    <dl>
                        <dt>Applicant ID</dt><dd>${applicant.applicantId}</dd>
                        <dt>Intake</dt><dd>${applicant.intakeGuid?.year} - ${applicant.intakeGuid?.month}</dd>
                        <dt>Gender</dt><dd>${applicant.gender}</dd>
                        <dt>Phone</dt><dd>${applicant.phone}</dd>
                        <dt>Email</dt><dd>${applicant.email}</dd>
                        <dt>Address</dt><dd>${applicant.physicalAddress}</dd>
                        <dt>Nationality</dt><dd>${applicant.nationality}</dd>
                        <dt>National ID</dt><dd>${applicant.nationalId}</dd>
                        <dt>Marital Status</dt><dd>${applicant.maritalStatus}</dd>
                        <dt>Date of Birth</dt><dd>${new Date(applicant.dateOfBirth).toISOString().split('T')[0]}</dd>
                        <dt>Challenge faced</dt><dd>${applicant.description}</dd>
                    </dl>
                </body>
            </html>
        `;
        printWindow.document.write(printable);
        printWindow.document.close();
        printWindow.print();
    };

    const renderDetails = (applicant) => {
        const details = {
            'Applicant ID': applicant.applicantId,
            'Intake': `${applicant.intakeGuid?.year} - ${applicant.intakeGuid?.month}`,
            'Gender': applicant.gender,
            'Phone': applicant.phone,
            'Email': applicant.email,
            'Address': applicant.physicalAddress,
            'Nationality': applicant.nationality,
            'National ID': applicant.nationalId,
            'Marital Status': applicant.maritalStatus,
            'Date of Birth': new Date(applicant.dateOfBirth).toISOString().split('T')[0],
            'Challenge faced': applicant.description,
        };

        return (
            <div className="bg-gray-50 px-3 py-4 rounded-b-md border-t border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                    <img src={DEFAULT_AVATAR2} alt="Avatar" className="w-16 h-16 rounded-xl border border-gray-300" />
                    <button
                        onClick={() => handlePrint(applicant)}
                        className="ml-auto bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        🖨️ Print
                    </button>
                </div>
                <dl className="space-y-2 text-sm text-gray-700">
                    {Object.entries(details).map(([key, value]) => (
                        <div key={key} className="flex flex-col sm:flex-row sm:justify-between">
                            <dt className="font-medium text-gray-600">{key}</dt>
                            <dd className="text-gray-800 ml-4"><b>{value}</b></dd>
                        </div>
                    ))}
                </dl>
            </div>
        );
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const goingDown = scrollTop > lastScrollTop.current;
            lastScrollTop.current = scrollTop;

            if (scrollTop + clientHeight >= scrollHeight - 50 && goingDown) {
                setPage(prev => prev + 1);
            } else if (scrollTop <= 50 && !goingDown && page > 1) {
                setPage(prev => prev - 1);
            }
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, [page]);

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg md:max-w-[500px]">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Applicant List</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
            </div>

            <div
                ref={containerRef}
                className="overflow-auto border border-gray-200 rounded-md max-h-[70vh]"
            >
                <table className="min-w-full table-auto">
                    <thead className="sticky top-0 bg-gray-100 z-10 bg-zinc-200">
                        <tr>
                            <th className="text-left px-4 py-3 border-b border-b-gray-600 font-medium text-gray-700">Photo</th>
                            <th className="text-left px-4 py-3 border-b border-b-gray-600 font-medium text-gray-700">First Name</th>
                            <th className="text-left px-4 py-3 border-b border-b-gray-600 font-medium text-gray-700">Last Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(applicant => (
                            <React.Fragment key={applicant.guid}>
                                <tr
                                    onClick={() => toggleExpand(applicant.guid)}
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-2 border-t border-t-gray-400">
                                        <img
                                            src={DEFAULT_AVATAR}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full border border-gray-300"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-t border-t-gray-600 text-sm text-gray-800">{applicant.firstName}</td>
                                    <td className="px-4 py-2 border-t border-t-gray-600 text-sm text-gray-800">{applicant.lastName}</td>
                                </tr>
                                {expandedId === applicant.guid && (
                                    <tr className="bg-white">
                                        <td colSpan="3">{renderDetails(applicant)}</td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {!filtered.length && !isLoading && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">No applicants found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {isLoading && (
                    <div className="text-center py-4 text-gray-500">Loading...</div>
                )}
                {isError && (
                    <div className="text-center py-4 text-red-500">
                        ❌ Error: {error?.message || 'Failed to load applicants.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicantList;
