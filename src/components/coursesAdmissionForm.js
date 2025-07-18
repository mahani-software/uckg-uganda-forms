import React, { useState, useRef, useEffect } from 'react';
import { FloatingLabelInput } from "./floatingLabelInput"
import { useFileUploaderMutation, useItemRegistrerMutation, useItemsListReaderQuery } from "../backend/api/sharedCrud"
import { useSelector } from 'react-redux';
import { selectList } from '../backend/features/sharedMainState';
import ProfileImageInput from './profilePhotoInput';
import DocumentsInput from './documentsInput';

const CoursesAdmissionForm = () => {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [photoLabel, setPhotoLabel] = useState('Profile Photo');
    const [documentPickerLabel, setDocumentPickerLabel] = useState('Attach document(s)');
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [photoUploadGuid, setPhotoUploadGuid] = useState(undefined);
    const [coursesAppliedFor, setCoursesAppliedFor] = useState([]);
    const [gender, setGender] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [intakeGuid, setIntakeGuid] = useState('');
    const [intakes, setIntakes] = useState([{ guid: "yrjjhrueuyry", year: "2024", month: "JUL" }, { guid: "ea3241435636dc23", year: "2025", month: "JUL" }, { guid: "ea3241435636daa21", year: "2026", month: "JUL" }]);
    const [allCourses, setAllCourses] = useState([{ guid: "ea324241315ac", courseName: "Database admin" }, { guid: "ea324774322", courseName: "Accounting" }]);
    // New state variables for form inputs
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        physicalAddress: '',
        nationality: '',
        nationalId: '',
        dateOfBirth: '',
        description: ''
    });
    const fileInputRef = useRef(null);

    //============ submit to google sheets ===================
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbykm0lNGJzPfmgOI44rnv02uydBKtIf9SrCij8dFQO_qpX5j1LWD1x2YKY-hI4XeVay/exec";
    const API_KEY = "mahanitechuckgugandaformssecret";
    const handleSubmitToSheets = async (e) => {
        e.preventDefault();
        setStatus('');
        setLoading(true);

        // Since handleSubmitToSheets still uses a <form>, we keep FormData here
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
    //============ /end submit to google sheets===============

    const {
        isLoading: intakesProcessing,
        isSuccess: intakesSucceeded,
        isError: intakesFailed,
        error: intakesError,
    } = useItemsListReaderQuery({ entity: "intake" })

    const {
        isLoading: coursesProcessing,
        isSuccess: coursesSucceeded,
        isError: coursesFailed,
        error: coursesError,
    } = useItemsListReaderQuery({ entity: "course" })

    const cachedCourses = useSelector(st => selectList(st, "course"))
    const cachedIntakes = useSelector(st => selectList(st, "intake"))
    const [reRender, setReRender] = useState(false);
    useEffect(() => {
        if (!cachedCourses || !cachedIntakes) {
            setTimeout(() => {
                setReRender(!reRender)
            }, 1000)
        }
    }, [cachedCourses, cachedIntakes])

    //============= submit to Cloud Run ======================
    //---- profile image ----
    const [uploadNewImage, {
        data: fileUploadSuccessResponse,
        isLoading: fileUploadProcessing,
        isSuccess: fileUploadSucceeded,
        isError: fileUploadFailed,
        error: fileUploadError,
    }] = useFileUploaderMutation()
    const { Data: { url, guid } = {} } = fileUploadSuccessResponse || {}
    useEffect(() => {
        if (fileUploadSucceeded && (guid || url)) {
            setPhotoUploadGuid(guid);
            setStatus("✅ Photo uploaded");
        } else if (fileUploadFailed) {
            console.error("Upload error:", fileUploadError);
            setStatus("❌ Photo upload failed");
        }
    }, [fileUploadSucceeded, fileUploadFailed]);
    //------ documents --------
    const [uploadNewDocument, {
        data: docUploadSuccessResponse,
        isLoading: docUploadProcessing,
        isSuccess: docUploadSucceeded,
        isError: docUploadFailed,
        error: docUploadError,
    }] = useFileUploaderMutation()
    const { Data: { url: docUploadUrl, guid: docUploadGuid } = {} } = docUploadSuccessResponse || {}
    useEffect(() => {
        if (docUploadSucceeded && (docUploadGuid || docUploadUrl)) {
            if (!uploadedDocuments.includes(docUploadGuid)) {
                setUploadedDocuments([...uploadedDocuments, docUploadGuid]);
                setStatus("✅ Document uploaded");
            }
        } else if (docUploadFailed) {
            console.error("Upload error:", docUploadError);
            setStatus("❌ Document upload failed");
        }
    }, [docUploadSucceeded, docUploadFailed]);

    //------ applicant data -----
    const [submitNewApplicant, {
        data: applicantRegSuccessResponse,
        isLoading: applicantRegProcessing,
        isSuccess: applicantRegSucceeded,
        isError: applicantRegFailed,
        error: applicantRegError,
    }] = useItemRegistrerMutation()
    useEffect(() => {
        if (applicantRegSucceeded) {
            setStatus("✅ Applicant registered successfully!");
            setLoading(false);
            // Reset form fields after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                physicalAddress: '',
                nationality: '',
                nationalId: '',
                dateOfBirth: '',
                description: ''
            });
            setIntakeGuid('');
            setGender('');
            setMaritalStatus('');
            setCoursesAppliedFor([]);
            setPhotoUploadGuid(undefined);
            setUploadedDocuments([]);
            setPreview(null);
            setPhotoLabel('Profile Photo');
            setDocumentPickerLabel('Attach document(s)');
        } else if (applicantRegFailed) {
            setStatus("❌ Failed to register applicant. Please try again.");
            setLoading(false);
        }
    }, [applicantRegSucceeded, applicantRegFailed]);

    const handlePhotoChange = ({ file, formData }) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setPhotoLabel("Change Photo");
            const fData = new FormData();
            fData.set('file', file);
            uploadNewImage({
                entity: "fileupload",
                data: fData,
            })
        } else {
            setPreview(null);
            setPhotoLabel("Profile Photo");
        }
    };

    const handleDocumentAttachment = ({ file, formData }) => {
        if (file) {
            setDocumentPickerLabel("Add another document");
            const fData = new FormData();
            fData.set('file', file);
            uploadNewDocument({
                entity: "fileupload",
                data: fData,
            })
        } else {
            setDocumentPickerLabel("Attach document(s)");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    //============= submit to Cloud Run ======================
    const handleSubmitToCloudRun = async (e) => {
        e.preventDefault();
        setStatus('');
        setLoading(true);

        // Validate required fields
        if (!formData.firstName || !formData.lastName || !intakeGuid || !gender || !maritalStatus) {
            setStatus('Please fill out all required fields.');
            setLoading(false);
            return;
        }

        const payload = {
            intakeGuid,
            courses: coursesAppliedFor,
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender,
            phone: formData.phone,
            email: formData.email,
            physicalAddress: formData.physicalAddress,
            nationality: formData.nationality,
            nationalId: formData.nationalId,
            maritalStatus,
            dateOfBirth: formData.dateOfBirth,
            description: formData.description,
            photo: photoUploadGuid,
            documents: uploadedDocuments,
        }
        submitNewApplicant({ entity: "applicant", data: payload })
    }
    //============= /end submit to Cloud Run =================

    return (
        <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800"> Admit Course Applicant </h2>
            <div className="space-y-4">
                <div className="pr-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700"> Intake </label>
                    <select
                        name="intakeGuid"
                        value={intakeGuid}
                        onChange={(e) => setIntakeGuid(e.target.value)}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 p-2 pl-1"
                    >
                        <option value="">--</option>
                        {(cachedIntakes || intakes).map((intake) => (
                            <option key={intake.guid} value={intake.guid}>
                                {intake.year} - {intake.month}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <FloatingLabelInput
                        label="First name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <FloatingLabelInput
                        label="Last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 p-2 pl-1"
                    >
                        <option value="">--</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-700">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-lime-500 focus:border-lime-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Marital status</label>
                    <select
                        name="maritalStatus"
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 p-2 pl-1"
                    >
                        <option value="">--</option>
                        <option value="Single">Single</option>
                        <option value="Dating">Dating</option>
                        <option value="Engaged">Engaged</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Lostspouse">Lost spouse</option>
                    </select>
                </div>
                <div>
                    <FloatingLabelInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <FloatingLabelInput
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <FloatingLabelInput
                        label="Physical address"
                        name="physicalAddress"
                        value={formData.physicalAddress}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <FloatingLabelInput
                        label="Nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <FloatingLabelInput
                        label="National ID"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <FloatingLabelInput
                        label="What challenge are you facing?"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline={true}
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700"> Course(s) preferred </label>
                    <div className="space-y-2">
                        {(cachedCourses || allCourses).map((course) => (
                            <label key={course.guid} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={course.guid}
                                    checked={coursesAppliedFor.includes(course.guid)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCoursesAppliedFor((prev) =>
                                            prev.includes(value)
                                                ? prev.filter((id) => id !== value)
                                                : [...prev, value]
                                        );
                                    }}
                                    className="rounded text-lime-600 focus:ring-lime-500"
                                />
                                <span>{course.courseName || course.guid}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <hr />

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

                <div className="container mx-auto">
                    <ProfileImageInput
                        uploadImageFn={({ file, formData }) => handlePhotoChange({ file, formData })}
                        uploadButtonLabel={photoLabel}
                        maxFiles={1}
                        maxFileSize={10}
                        acceptedTypes={['image/*']}
                        uploadImmediately={true}
                    />
                </div>

                <div className="mx-auto">
                    <DocumentsInput
                        uploadDocumentFn={({ file, formData }) => handleDocumentAttachment({ file, formData })}
                        uploadButtonLabel={documentPickerLabel}
                        maxFiles={4}
                        maxFileSize={8}
                        acceptedDocTypes={['image/*', 'application/pdf', '.doc', '.docx', '.txt']}
                    />
                </div>

                <div>
                    <button
                        onClick={handleSubmitToCloudRun}
                        type="submit"
                        disabled={applicantRegProcessing || loading}
                        className={`w-full mt-8 py-2 px-4 rounded-md text-white font-medium ${(applicantRegProcessing || loading)
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {(applicantRegProcessing || loading) ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>

            {status && (
                <div className={`mt-4 text-center text-sm font-medium px-4 py-2 rounded-md ${status.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {status}
                </div>
            )}
        </div>
    );
};

export default CoursesAdmissionForm;