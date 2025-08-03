import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useItemsListReaderQuery, useItemsListReadrMutation, useItemFieldsUpdaterMutation } from '../backend/api/sharedCrud';
import { useSelector } from 'react-redux';
import { selectList } from "../backend/features/sharedMainState";
import DEFAULT_AVATAR from "../images/userRounded.png";
import DEFAULT_AVATAR2 from "../images/user.png";
import CompanyLogo from '../images/vyg-uganda.jpeg';
import DocumentList from './ui/documentList';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useReactToPrint } from "react-to-print";
import { PDFDocument } from 'pdf-lib';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ModuleRegistry.registerModules([AllCommunityModule]);

const ApplicantList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedCourseName, setSelectedCourseName] = useState("All applicants - not filtered");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [page, setPage] = useState(1);
    const [inputPage, setInputPage] = useState("1");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editCourses, setEditCourses] = useState([]);
    const containerRef = useRef(null);
    const lastScrollTop = useRef(0);
    const componentRef = useRef();

    // Build query filters
    const filters = useMemo(() => {
        const filterObj = {};
        if (selectedCourse) {
            filterObj.courseGuid = selectedCourse;
        }
        if (selectedSemester) {
            const [year, month] = selectedSemester.split('-');
            filterObj.intakeGuid = { year, month };
        }
        return filterObj;
    }, [selectedCourse, selectedSemester]);

    const [fetchApplicantsFn, {
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    }] = useItemsListReadrMutation();

    const [previousCourseFilter, setPreviousCourseFilter] = useState(undefined)
    const [previousPage, setPreviousPage] = useState(0)
    useEffect(() => {
        if(selectedCourse !== previousCourseFilter){
            fetchApplicantsFn({ entity: "applicant", limit: 50, page, filters })
            setPreviousCourseFilter(selectedCourse)
        }
        if(page !== previousPage){
            fetchApplicantsFn({ entity: "applicant", limit: 50, page, filters })
            setPreviousPage(page)
        }
    },[selectedCourse, page])

    const {
        isLoading: coursesLoading,
        isSuccess: coursesSuccess,
        isError: coursesError,
        error: coursesErrorMsg
    } = useItemsListReaderQuery({ entity: "course" });

    const [updateApplicant, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] = useItemFieldsUpdaterMutation();

    const applicants = useSelector(st => selectList(st, "applicant")) || [];
    const courses = useSelector(st => selectList(st, "course")) || [];

    // Extract unique semesters from applicants
    const semesters = [...new Set(
        applicants.map(applicant => 
            applicant.intakeGuid ? `${applicant.intakeGuid.year}-${applicant.intakeGuid.month}` : null
        ).filter(Boolean)
    )].sort();

    // Filter applicants by search term (all fields), course, and semester
    const filtered = applicants.filter(applicant => {
        const searchLower = searchTerm.toLowerCase();
        const fieldsToSearch = [
            applicant.firstName || '',
            applicant.lastName || '',
            applicant.applicantId || '',
            applicant.email || '',
            applicant.phone || '',
            applicant.gender || '',
            applicant.nationality || '',
            applicant.physicalAddress || '',
            applicant.intakeGuid ? `${applicant.intakeGuid.year}-${applicant.intakeGuid.month}` : '',
            applicant.courses
                ?.filter(crs => crs.courseGuid)
                .map(crs => crs.courseGuid.courseName)
                .join(', ') || '',
            new Date(applicant.dateOfBirth)?.toISOString()?.split('T')[0] || '',
            applicant.maritalStatus || '',
            applicant.nationalId || '',
            applicant.description || ''
        ];
        const matchesSearch = !searchTerm || fieldsToSearch.some(field => 
            field.toLowerCase().includes(searchLower)
        );
        const matchesCourse = !selectedCourse || applicant.courses?.some(course => course.courseGuid?.guid === selectedCourse);
        const matchesSemester = !selectedSemester || (applicant.intakeGuid && `${applicant.intakeGuid.year}-${applicant.intakeGuid.month}` === selectedSemester);
        return matchesSearch && matchesSemester;
    });

    const toggleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
        setEditingId(null); // Close edit mode when collapsing
    };

    const startEditing = (applicant) => {
        setEditingId(applicant.guid);
        setEditForm({
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            phone: applicant.phone,
            email: applicant.email,
            physicalAddress: applicant.physicalAddress,
            nationality: applicant.nationality,
            maritalStatus: applicant.maritalStatus,
            dateOfBirth: new Date(applicant.dateOfBirth)?.toISOString()?.split('T')[0],
            description: applicant.description,
        });
        setEditCourses(applicant.courses?.map(course => course.courseGuid?.guid) || []);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCourseChange = (courseGuid) => {
        setEditCourses(prev =>
            prev.includes(courseGuid)
                ? prev.filter(id => id !== courseGuid)
                : [...prev, courseGuid]
        );
    };

    const handleSave = async (applicantId) => {
        try {
            await updateApplicant({
                entity: "applicant",
                guid: applicantId,
                data: {
                    ...editForm,
                    courses: editCourses
                }
            }).unwrap();
            setEditingId(null);
            setEditCourses([]);
        } catch (err) {
            console.error("Failed to update applicant:", err);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
        setEditCourses([]);
    };

    const handlePageInputChange = (e) => {
        const value = e.target.value;
        setInputPage(value);
        if (value === "" || isNaN(value) || parseInt(value) < 1) return;
        const newPage = parseInt(value);
        setPage(newPage);
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
                    and to help you benefit best. For any inquiry, please contact us on mobile: <b> +256 701 219644 </b>
                </div>

                <div className="border border-gray-100 mt-6 rounded-lg">
                    <div className="flex flex-row justify-between mb-4 p-4 bg-lime-100 rounded-t-lg">
                        <h1 className="text-4xl font-bold my-auto">{applicant.firstName} {applicant.lastName}</h1>
                        <img src={applicant.photo?.url ? `${applicant.photo?.url}` : DEFAULT_AVATAR2} alt="Av" className="w-24 h-24 rounded-lg" />
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

    const [printableDetailsElement, setPrintableDetailsElement] = useState("to-be-printed")
    const [printableListElement, setPrintableListElement] = useState("to-be-printed")

    const handlePrint = (applicant) => {
        setPrintableDetailsElement("printable-section")
        setPrintableListElement("to-be-printed"); 
        setExpandedId(applicant.guid);
        setTimeout(() => window.print(), 100);
    };

    // const handlePrint = async (applicant) => {
    //     setPrintableDetailsElement('printable-section');
    //     setPrintableListElement('to-be-printed');
    //     setExpandedId(applicant.guid);

    //     setTimeout(async () => {
    //         const element = document.getElementById('printable-section');
    //         const canvas = await html2canvas(element, { scale: 1 }); // Lower scale for smaller size
    //         const imgData = canvas.toDataURL('image/jpeg', 0.5); // Lower quality (0.5)

    //         const pdf = new jsPDF();
    //         const imgProps = pdf.getImageProperties(imgData);
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //         pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    //         // Save initial PDF
    //         const pdfBytes = pdf.output('arraybuffer');

    //         // Compress with pdf-lib
    //         const pdfDoc = await PDFDocument.load(pdfBytes);
    //         const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });

    //         // Download compressed PDF
    //         const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
    //         const link = document.createElement('a');
    //         link.href = URL.createObjectURL(blob);
    //         link.download = `applicant-${applicant.applicantId}.pdf`;
    //         link.click();
    //     }, 100);
    // };

    const handlePrintList = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "applicants-list-"+selectedCourse,
    });

    // const handlePrintList = async () => {
    //     setExpandedId(null);
    //     setPrintableDetailsElement('to-be-printed');
    //     setPrintableListElement('printable-list');
    //     setTimeout(async () => {
    //         const element = document.getElementById('printable-list');
    //         const canvas = await html2canvas(element, { scale: 1 });
    //         const imgData = canvas.toDataURL('image/jpeg', 0.5);

    //         const pdf = new jsPDF();
    //         const imgProps = pdf.getImageProperties(imgData);
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //         pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    //         const pdfBytes = pdf.output('arraybuffer');
    //         const pdfDoc = await PDFDocument.load(pdfBytes);
    //         const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });

    //         const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
    //         const link = document.createElement('a');
    //         link.href = URL.createObjectURL(blob);
    //         link.download = `applicants-list-${selectedCourse}.pdf`;
    //         link.click();
    //     }, 200);
    // };

    const renderDetails = (applicant) => {
        const details = {
            'Applicant ID': applicant.applicantId,
            'Intake': applicant.intakeGuid ? `${applicant.intakeGuid.year}-${applicant.intakeGuid.month}` : 'N/A',
            'Gender': applicant.gender,
            'Phone': applicant.phone,
            'Email': applicant.email,
            'Address': applicant.physicalAddress,
            'Nationality': applicant.nationality,
            'National ID': applicant.nationalId,
            'Marital Status': applicant.maritalStatus,
            'Date of Birth': new Date(applicant.dateOfBirth)?.toISOString()?.split('T')[0],
            'Challenge Faced': applicant.description,
        };

        const { documents = [] } = applicant || {};

        if (editingId === applicant.guid) {
            return (
                <div className="bg-gray-50 px-3 py-4 rounded-b-md">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={applicant.photo?.url ? `${applicant.photo?.url}` : DEFAULT_AVATAR2} alt="Av" className="w-16 h-16 rounded-xl" />
                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={() => handleSave(applicant.guid)}
                                disabled={isUpdating}
                                className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {isUpdating ? 'Saving...' : '💾 Save'}
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="bg-gray-600 text-black text-sm px-4 py-2 rounded hover:bg-gray-700 transition border border-black"
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                    {isUpdateError && (
                        <div className="text-red-500 mb-4">
                            Error updating applicant: {updateError?.message || 'Unknown error'}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={editForm.firstName || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={editForm.lastName || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={editForm.phone || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editForm.email || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Address</label>
                            <input
                                type="text"
                                name="physicalAddress"
                                value={editForm.physicalAddress || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Nationality</label>
                            <input
                                type="text"
                                name="nationality"
                                value={editForm.nationality || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Marital Status</label>
                            <select
                                name="maritalStatus"
                                value={editForm.maritalStatus || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                            >
                                <option value="">Select</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={editForm.dateOfBirth || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-600">Challenge Faced</label>
                            <textarea
                                name="description"
                                value={editForm.description || ''}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                                rows="4"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-600">Course(s) Preferred</label>
                            {coursesLoading && <div className="text-gray-500">Loading courses...</div>}
                            {coursesError && (
                                <div className="text-red-500">
                                    Error loading courses: {coursesErrorMsg?.message || 'Unknown error'}
                                </div>
                            )}
                            {coursesSuccess && (
                                <div className="space-y-2">
                                    {courses.map((course) => (
                                        <label key={course.guid} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={course.guid}
                                                checked={editCourses.includes(course.guid)}
                                                onChange={() => handleCourseChange(course.guid)}
                                                className="rounded text-lime-600 focus:ring-lime-500"
                                            />
                                            <span>{course.courseName || course.guid}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="bg-gray-50 px-3 py-4 rounded-b-md max-w-300">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={applicant.photo?.url ? `${applicant.photo?.url}` : DEFAULT_AVATAR2} alt="Av" className="w-16 h-16 rounded-xl" />
                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={() => startEditing(applicant)}
                                className="bg-yellow-600 text-black text-sm px-4 py-2 rounded hover:bg-yellow-700 transition border border-black"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => handlePrint(applicant)}
                                className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                🖨️ Print
                            </button>
                        </div>
                    </div>
                    <dl className="space-y-2 text-sm text-gray-700">
                        {Object.entries(details).map(([key, value]) => (
                            <div key={key} className="flex flex-row justify-between">
                                <dt className="font-medium text-gray-600">{key}</dt>
                                <dd className="text-gray-800 ml-4"><b>{value || 'N/A'}</b></dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <div className="w-full p-3">
                    <div className="w-full"> Courses:</div>
                    {applicant.courses?.filter(crs => crs.courseGuid)?.map((course, index) => (
                        <div key={index + 1} className="flex flex-row sm:flex-row justify-start gap-6">
                            <span className="font-medium text-gray-600">{index + 1}</span>
                            <span className="text-gray-800 ml-4"><b>{course.courseGuid?.courseName}</b></span>
                        </div>
                    ))}
                </div>

                <DocumentList documents={documents.map(doc => doc.url)} />

                <div id={printableDetailsElement} className="hidden print:block bg-white p-6 text-sm">
                    {expandedId && renderPrintable(applicants.find(a => a.guid === expandedId))}
                </div>
            </>
        );
    };

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg md:max-w-[500px]">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 no-print">Applicants List</h2>

            <div className="space-y-4 mb-4 no-print">
                <div className="flex gap-3 flex-row justify-between">
                    <div className="w-[70%]">
                        <input
                            type="text"
                            placeholder="Search by any field..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                        />
                    </div>
                    <div className="border border-gray-300 rounded flex-row justify-between pl-3">
                        <span>Chunk </span>
                        <input
                            type="number"
                            min={1}
                            value={inputPage}
                            onChange={handlePageInputChange}
                            className="w-14 px-1 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400 rounded"
                            placeholder="Page"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Course</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => {
                            const selectedGuid = e.target.value;
                            setSelectedCourse(selectedGuid);
                            const selectedCourseObj = courses.find(course => course.guid === selectedGuid);
                            setSelectedCourseName(selectedCourseObj ? selectedCourseObj.courseName : "");
                        }}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                        disabled={coursesLoading}
                    >
                        <option value="">All Courses</option>
                        {courses.map(course => (
                            <option key={course.guid} value={course.guid}>{course.courseName}</option>
                        ))}
                    </select>
                    {coursesError && (
                        <div className="text-red-500 text-sm mt-1">
                            Error loading courses: {coursesErrorMsg?.message || 'Unknown error'}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Intake</label>
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                        disabled={isLoading}
                    >
                        <option value="">All Intakes</option>
                        {semesters.map(semester => (
                            <option key={semester} value={semester}>{semester}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={(e) => {
                        setExpandedId(null);
                        setPrintableDetailsElement("to-be-printed");
                        setPrintableListElement("printable-list");
                        setTimeout(() => handlePrintList(e), 200);
                    }}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition mb-3"
                >
                    🖨️ Print List
                </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-md max-h-[70vh]">
                <div id={printableListElement} ref={componentRef}>
                    <div className="w-full hidden print:block">
                        <div className="flex justify-between items-center mb-6 gap-4">
                            <img src={CompanyLogo} alt="Company Logo" className="w-24 h-auto" />
                            <div className="gap-4">
                                <div className="text-5xl font-bold"> Free short courses </div>
                                <div className="text-3xl text-right"> Admission List </div>
                            </div>
                        </div>
                        <div className="w-full mt-10 mb-4 py-2 text-xl text-justify">
                            <b> {selectedCourseName} - (chunk {page})</b>
                        </div>
                    </div>
                    <table className="min-w-[500px] table-auto">
                        <thead className="top-0 bg-zinc-200">
                            <tr>
                                <th className="text-left p-1 border-b border-gray-600 font-medium text-gray-700">Photo</th>
                                <th className="text-left p-1 border-b border-gray-600 font-medium text-gray-700">First Name</th>
                                <th className="text-left p-1 border-b border-gray-600 font-medium text-gray-700">Last Name</th>
                                <th className="text-left p-1 border-b border-gray-600 font-medium text-gray-700">Gender</th>
                                <th className="text-left p-1 border-b border-gray-600 font-medium text-gray-700">Applicant ID</th>
                                <th className="text-left p-1 border-b border-gray-600 font-medium text-gray-700">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((applicant, index) => (
                                <React.Fragment key={index + 1}>
                                    <tr
                                        onClick={() => toggleExpand(applicant.guid)}
                                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                                            ((index + 1) === 25) || (index + 1 > 24 && (index + 1 - 24) % 27 === 0) ? 'page-break avoid-break' : ''
                                        }`}
                                    >
                                        <td className="p-1 border-t border-gray-400">
                                            <img
                                                src={applicant.photo?.url ? `${applicant.photo?.url}` : DEFAULT_AVATAR}
                                                alt="Avatar"
                                                className="w-6 h-6 rounded-full"
                                                onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                                            />
                                        </td>
                                        <td className="p-1 border-t border-gray-600 text-sm text-gray-800">{applicant.firstName || 'N/A'}</td>
                                        <td className="p-1 border-t border-gray-600 text-sm text-gray-800">{applicant.lastName || 'N/A'}</td>
                                        <td className="p-1 border-t border-gray-600 text-sm text-gray-800">{applicant.gender || 'N/A'}</td>
                                        <td className="p-1 border-t border-gray-600 text-sm text-gray-800">{applicant.applicantId || 'N/A'}</td>
                                        <td className="p-1 border-t border-gray-600 text-sm text-gray-800">{applicant.phone || 'N/A'}</td>
                                    </tr>
                                    {expandedId === applicant.guid && (
                                        <tr className="bg-white no-print">
                                            <td colSpan="5">{renderDetails(applicant)}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {!filtered.length && !isLoading && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">No applicants found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {isLoading && (
                    <div className="text-center py-4 text-gray-500 no-print">Loading...</div>
                )}
                {isError && (
                    <div className="text-center py-4 text-red-500 no-print">
                        ❌ Error: {error?.message || 'Failed to load applicants.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicantList;