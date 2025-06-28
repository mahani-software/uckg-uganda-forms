// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from 'react';
import { FloatingLabelInput } from "./floatingLabelInput"
import { useFileUploaderMutation, useItemRegistrerMutation, useItemsListReaderQuery } from "../backend/api/sharedCrud"
import { useSelector } from 'react-redux';
import { selectList } from '../backend/features/sharedMainState';
import FilesInput from './filesInput';

const CoursesAdmissionForm = () => {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [photoLabel, setPhotoLabel] = useState('Profile Photo');
    const [photoUploadGuid, setPhotoUploadGuid] = useState(undefined);
    const [coursesAppliedFor, setCoursesAppliedFor] = useState([]);
    const [gender, setGender] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [intakeGuid, setIntakeGuid] = useState('');
    const [intakes, setIntakes] = useState([{ guid: "yrjjhrueuyry", year: "2024", month: "JUL" }, { guid: "ea3241435636dc23", year: "2025", month: "JUL" }, { guid: "ea3241435636daa21", year: "2026", month: "JUL" }]);          //TODO: fetched from backend
    const [allCourses, setAllCourses] = useState([{ guid: "ea324241315ac", courseName: "Database admin" }, { guid: "ea324774322", courseName: "Accounting" }]);    //TODO: fetched from backend
    const fileInputRef = useRef(null);

    //============ submit to google sheets ===================
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbykm0lNGJzPfmgOI44rnv02uydBKtIf9SrCij8dFQO_qpX5j1LWD1x2YKY-hI4XeVay/exec";
    const API_KEY = "mahanitechuckgugandaformssecret";
    const handleSubmitToSheets = async (e) => {
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
        } else if (applicantRegFailed) {
            setStatus("❌ Failed to register applicant. Please try again.");
            setLoading(false);
        }
    }, [applicantRegSucceeded, applicantRegFailed]);

    //============= /end submit to Cloud Run =================

    const handlePhotoChange = ({ file, formData }) => {
        console.log("handlePhotoChange called")
        // const file = e.target.files[0];
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
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    //--------------
    const handleSubmitToCloudRun = async (e) => {
        e.preventDefault();
        setStatus('');
        const formData = new FormData(e.target);
        const firstName = formData.get('firstname');
        const lastName = formData.get('lastname');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const physicalAddress = formData.get('address');
        const nationality = formData.get('nationality');
        const nationalId = formData.get('nationalid');
        const dateOfBirth = formData.get('dobirth');
        const description = formData.get('description');
        const payload = {
            // branchGuid,
            // branchId,
            intakeGuid,
            courses: coursesAppliedFor,
            firstName,
            lastName,
            gender,
            phone,
            email,
            physicalAddress,
            nationality,
            nationalId,
            maritalStatus,
            dateOfBirth,
            description,
            photo: photoUploadGuid,
        }
        console.log("payload =", payload)
        submitNewApplicant({ entity: "applicant", data: payload })
    }
    //--------------

    return (
        <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800"> Admit Course Applicant </h2>
            <form onSubmit={handleSubmitToCloudRun} className="space-y-4">
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
                    <FloatingLabelInput label="First name" name="firstname" required />
                </div>
                <div>
                    <FloatingLabelInput label="Last name" name="lastname" required />
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
                    <label htmlFor="dobirth" className="block mb-2 text-sm font-medium text-gray-700">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        name="dobirth"
                        id="dobirth"
                        required
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-lime-500 focus:border-lime-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Marital status</label>
                    <select
                        name="maritalstatus"
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
                    <FloatingLabelInput label="Email" name="email" type="email" />
                </div>
                <div>
                    <FloatingLabelInput label="Phone" name="phone" />
                </div>
                <div>
                    <FloatingLabelInput label="Physical address" name="address" />
                </div>
                <div>
                    <FloatingLabelInput label="Nationality" name="nationality" />
                </div>
                <div>
                    <FloatingLabelInput label="National ID" name="nationalid" />
                </div>
                <div>
                    <FloatingLabelInput label="What challenge are you facing?" name="description" multiline={true} />
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
                    <FilesInput
                        uploadImageFn={({ file, formData }) => handlePhotoChange({ file, formData })}
                        uploadButtonLabel={photoLabel}
                        maxFiles={1}
                        maxFileSize={10}
                        acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.txt']}
                        uploadImmediately={true}
                    />
                </div>

                <div>
                    <button
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
            </form>

            {status && (
                <div className={`mt-4 text-center text-sm font-medium px-4 py-2 rounded-md ${status.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {status}
                </div>
            )}
        </div>
    );
};

export default CoursesAdmissionForm;
