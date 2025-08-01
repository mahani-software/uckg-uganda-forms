import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectList } from "../backend/features/sharedMainState";
import { useItemsListReaderQuery } from '../backend/api/sharedCrud';
import { CSVLink } from 'react-csv';

const ApplicantDownload = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState('1');
  const limit = 100; // Items per page

  // Build query filters
  const filters = useMemo(() => {
    const filterObj = {};
    if (selectedCourse) filterObj.courseGuid = selectedCourse;
    if (selectedSemester) {
      const [year, month] = selectedSemester.split('-');
      filterObj.intakeGuid = { year, month };
    }
    return filterObj;
  }, [selectedCourse, selectedSemester, page]); // Include page to trigger refetch

  const {
    data: applicantsData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useItemsListReaderQuery(
    { entity: "applicant", limit, page, filters },
    { skip: !selectedCourse && !selectedSemester }
  );

  const {
    isLoading: coursesLoading,
    isSuccess: coursesSuccess,
    isError: coursesError,
    error: coursesErrorMsg
  } = useItemsListReaderQuery({ entity: "course" });

  const applicants = useSelector(st => selectList(st, "applicant")) || [];
  const courses = useSelector(st => selectList(st, "course")) || [];

  // Extract unique semesters from applicants
  const semesters = [...new Set(
    applicants.map(applicant => 
      applicant.intakeGuid ? `${applicant.intakeGuid.year}-${applicant.intakeGuid.month}` : null
    ).filter(Boolean)
  )].sort();

  // Handle page input change
  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setInputPage(value);
    if (value === '' || isNaN(value) || parseInt(value) < 1) return;
    const newPage = parseInt(value);
    setPage(newPage);
  };

  // Trigger immediate refetch when filters or page change
  useEffect(() => {
    if (selectedCourse || selectedSemester) {
      refetch();
    }
  }, [selectedCourse, selectedSemester, page, refetch]);

  // Filter applicants based on selections (client-side fallback)
  const filteredApplicants = applicants.filter(applicant => {
    const matchesCourse = !selectedCourse || 
      applicant.courses?.some(course => course.courseGuid?.guid === selectedCourse);
    const matchesSemester = !selectedSemester || 
      (applicant.intakeGuid && 
       `${applicant.intakeGuid.year}-${applicant.intakeGuid.month}` === selectedSemester);
    return matchesCourse && matchesSemester;
  });

  // Prepare CSV data
  const csvData = filteredApplicants.map(applicant => ({
    ProfilePicture: applicant.imageUrl || 'N/A',
    FirstName: applicant.firstName || '',
    LastName: applicant.lastName || '',
    ApplicantID: applicant.applicantId || '',
    Email: applicant.email || '',
    Phone: applicant.phone || '',
    Gender: applicant.gender || '',
    Nationality: applicant.nationality || '',
    Address: applicant.physicalAddress || '',
    Semester: applicant.intakeGuid ? `${applicant.intakeGuid.year}-${applicant.intakeGuid.month}` : '',
    Courses: applicant.courses
      ?.filter(crs => crs.courseGuid)
      .map(crs => crs.courseGuid.courseName)
      .join(', ') || '',
    DateOfBirth: new Date(applicant.dateOfBirth)?.toISOString()?.split('T')[0] || '',
    MaritalStatus: applicant.maritalStatus || '',
    NationalID: applicant.nationalId || '',
    Description: applicant.description || ''
  }));

  const csvHeaders = [
    { label: 'Profile Picture', key: 'ProfilePicture' },
    { label: 'First Name', key: 'FirstName' },
    { label: 'Last Name', key: 'LastName' },
    { label: 'Applicant ID', key: 'ApplicantID' },
    { label: 'Email', key: 'Email' },
    { label: 'Phone', key: 'Phone' },
    { label: 'Gender', key: 'Gender' },
    { label: 'Nationality', key: 'Nationality' },
    { label: 'Address', key: 'Address' },
    { label: 'Semester', key: 'Semester' },
    { label: 'Courses', key: 'Courses' },
    { label: 'Date of Birth', key: 'DateOfBirth' },
    { label: 'Marital Status', key: 'MaritalStatus' },
    { label: 'National ID', key: 'NationalID' },
    { label: 'Challenge faced', key: 'Description' }
  ];

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg md:max-w-[500px]">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Applicants List</h2>
      
      {isLoading && <div className="text-center py-4 text-gray-500">Loading applicants...</div>}
      {isError && (
        <div className="text-center py-4 text-red-500">
          Error: {error?.message || 'Failed to load applicants.'}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
            disabled={isLoading}
          >
            <option value="">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Page Number</label>
          <input
            type="number"
            min="1"
            value={inputPage}
            onChange={handlePageInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Page"
            disabled={isLoading}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-lime-600 text-white">
                <th className="p-2 text-left text-xs font-semibold border">Photo</th>
                <th className="p-2 text-left text-xs font-semibold border">First Name</th>
                <th className="p-2 text-left text-xs font-semibold border">Last Name</th>
                <th className="p-2 text-left text-xs font-semibold border">Applicant ID</th>
                <th className="p-2 text-left text-xs font-semibold border">Email</th>
                <th className="p-2 text-left text-xs font-semibold border">Phone</th>
                <th className="p-2 text-left text-xs font-semibold border">Gender</th>
                <th className="p-2 text-left text-xs font-semibold border">Nationality</th>
                <th className="p-2 text-left text-xs font-semibold border">Address</th>
                <th className="p-2 text-left text-xs font-semibold border">Semester</th>
                <th className="p-2 text-left text-xs font-semibold border">Courses</th>
                <th className="p-2 text-left text-xs font-semibold border">Date of Birth</th>
                <th className="p-2 text-left text-xs font-semibold border">Marital Status</th>
                <th className="p-2 text-left text-xs font-semibold border">National ID</th>
                <th className="p-2 text-left text-xs font-semibold border">Challenge Faced</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map(applicant => (
                <tr key={applicant.applicantId} className="hover:bg-gray-100">
                  <td className="p-2 border">
                    <img
                      src={applicant.imageUrl || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                    />
                  </td>
                  <td className="p-2 border text-xs">{applicant.firstName || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.lastName || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.applicantId || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.email || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.phone || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.gender || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.nationality || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.physicalAddress || 'N/A'}</td>
                  <td className="p-2 border text-xs">
                    {applicant.intakeGuid ? `${applicant.intakeGuid.year}-${applicant.intakeGuid.month}` : 'N/A'}
                  </td>
                  <td className="p-2 border text-xs">
                    {applicant.courses
                      ?.filter(crs => crs.courseGuid)
                      .map(crs => crs.courseGuid.courseName)
                      .join(', ') || 'N/A'}
                  </td>
                  <td className="p-2 border text-xs">
                    {new Date(applicant.dateOfBirth)?.toISOString()?.split('T')[0] || 'N/A'}
                  </td>
                  <td className="p-2 border text-xs">{applicant.maritalStatus || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.nationalId || 'N/A'}</td>
                  <td className="p-2 border text-xs">{applicant.description || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={`applicants_${selectedCourse || 'all'}_${selectedSemester || 'all'}.csv`}
            className="w-full text-center bg-lime-600 text-white p-3 rounded hover:bg-lime-700 transition disabled:opacity-50"
            disabled={!filteredApplicants.length || isLoading}
          >
            Download CSV ({filteredApplicants.length} applicants)
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDownload;