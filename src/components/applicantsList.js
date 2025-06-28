import React, { useState, useEffect, useRef } from 'react';
import { useItemsListReaderQuery } from '../backend/api/sharedCrud';
import { useSelector } from 'react-redux';
import { selectList } from "../backend/features/sharedMainState";
// import html2canvas from 'html2canvas';

import DEFAULT_AVATAR from "../images/userRounded.png";
import DEFAULT_AVATAR2 from "../images/user.png";
import CompanyLogo from '../images/vyg-uganda.jpeg';

const ApplicantList = () => {
    const [searchTerm, setSearchTerm] = useState("");
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

    const filtered = applicants.filter(applicant => `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

    const toggleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const renderPrintable = (applicant) => {
        if (!applicant) return null;

        return (
            <div>
                <div className="flex justify-between items-center mb-6 gap-4">
                    <img src={CompanyLogo} alt="Company Logo" className="w-24 h-auto" />
                    <div className="gap-4">
                        <div className="text-5xl font-bold"> Free short courses </div>
                        <div className="text-3xl text-right"> Admission </div>
                    </div>
                </div>

                <div className="w-full mt-10 py-2 text-md text-justify">
                    You have been offered a place to study for free and learn hands-on skills
                    in the skilling program organised by the Universal Church of the Kingdom of God (UCKG) in Uganda,
                    through the Victory Youth Group (VYG). The details below will be used to track your attendance
                    and to help you benefit best. For any inquiry, please contanct us on mobile: <b> +256 701 219644 </b>
                </div>

                <div className="border border-gray-100 mt-6 rounded-lg">
                    <div className="flex flex-row justify-between mb-4 p-4 bg-lime-100 rounded-t-lg">
                        <h1 className="text-4xl font-bold my-auto">{applicant.firstName} {applicant.lastName}</h1>
                        <img src={applicant.photo?.url ? `${applicant.photo?.url}` : DEFAULT_AVATAR2} alt="Av" className="w-24 h-24 rounded-lg border" />
                    </div>

                    <dl className="space-y-2 p-4">
                        <div className="flex flex-row justify-between">
                            <span className="text-lg"> Applicant ID: </span>
                            <span className="text-lg font-bold"> {applicant.applicantId} </span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-lg"> Intake: </span>
                            <span className="text-lg font-bold"> {applicant.intakeGuid?.year} - {applicant.intakeGuid?.month} </span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-lg"> Phone: </span>
                            <span className="text-lg font-bold"> {applicant.phone} </span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-lg"> Gender: </span>
                            <span className="text-lg font-bold"> {applicant.gender} </span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-lg"> Email: </span>
                            <span className="text-lg font-bold"> {applicant.email} </span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-lg"> Address: </span>
                            <span className="text-lg font-bold"> {applicant.physicalAddress} </span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="text-lg"> Nationality: </span>
                            <span className="text-lg font-bold"> {applicant.nationality} </span>
                        </div>
                    </dl>
                </div>
                <div className="w-full py-4">
                    {applicant.courses?.length && (
                        <div className="w-full"> Your chosen courses: </div>
                    )}
                    {applicant.courses?.map((course, index) => (
                        <div key={index + 1} className="flex flex-row sm:flex-row justify-start gap-6">
                            <span className="font-medium text-gray-600">{index + 1}</span>
                            <span className="text-gray-800 ml-4"><b>{course.courseGuid?.courseName}</b></span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handlePrint = (applicant) => {
        setExpandedId(applicant.guid);
        setTimeout(() => window.print(), 100);
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

        console.log("applicant =", applicant)

        return (
            <>
                <div className="bg-gray-50 px-3 py-4 rounded-b-md border-t border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={applicant.photo?.url ? `${applicant.photo?.url}` : DEFAULT_AVATAR2} alt="Av" className="w-16 h-16 rounded-xl border border-gray-300" />
                        <button
                            onClick={() => handlePrint(applicant)}
                            className="ml-auto bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            🖨️ Print
                        </button>
                    </div>
                    <dl className="space-y-2 text-sm text-gray-700">
                        {Object.entries(details).map(([key, value]) => (
                            <div key={key} className="flex flex-row justify-between">
                                <dt className="font-medium text-gray-600">{key}</dt>
                                <dd className="text-gray-800 ml-4"><b>{value}</b></dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <div className="w-full p-3">
                    <div className="w-full"> Courses:</div>
                    {applicant.courses?.map((course, index) => (
                        <div key={index + 1} className="flex flex-row sm:flex-row justify-start gap-6">
                            <span className="font-medium text-gray-600">{index + 1}</span>
                            <span className="text-gray-800 ml-4"><b>{course.courseGuid?.courseName}</b></span>
                        </div>
                    ))}
                </div>
                <div id="printable-section" className="hidden print:block bg-white p-6 text-sm">
                    {expandedId && renderPrintable(applicants.find(a => a.guid === expandedId))}
                </div>
            </>
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
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Applicants List</h2>

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
                                            src={applicant.photo?.url ? `${applicant.photo?.url}` : DEFAULT_AVATAR}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-t border-t-gray-600 text-sm text-gray-800"> {applicant.firstName} </td>
                                    <td className="px-4 py-2 border-t border-t-gray-600 text-sm text-gray-800"> {applicant.lastName} </td>
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
