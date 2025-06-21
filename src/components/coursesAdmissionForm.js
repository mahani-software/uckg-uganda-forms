import React, { useState, useRef, useEffect } from 'react';
import { FloatingLabelInput } from "./floatingLabelInput"
import { useItemRegistrerMutation } from "../backend/api/sharedCrud"

const CoursesAdmissionForm = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [photoLabel, setPhotoLabel] = useState('Profile Photo');
    const [photoUploadGuid, setPhotoUploadGuid] = useState(undefined);
    const [coursesAppliedFor, setCoursesAppliedFor] = useState([]);
    const [gender, setGender] = useState('');
    const [intakeGuid, setIntakeGuid] = useState('');
    const [intakes, setIntakes] = useState([{ guid: "yrjjhrueuyry", year: "2024", month: "JUL" }]);          //TODO: fetched from backend
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

    //============= submit to Cloud Run ======================
    const [uploadNewImage, {
        data: fileUploadSuccessResponse,
        isLoading: fileUploadProcessing,
        isSuccess: fileUploadSucceeded,
        isError: fileUploadFailed,
        error: fileUploadError,
    }] = useItemRegistrerMutation()

    const [submitNewApplicant, {
        data: applicantRegSuccessResponse,
        isLoading: applicantRegProcessing,
        isSuccess: applicantRegSucceeded,
        isError: applicantRegFailed,
        error: applicantRegError,
    }] = useItemRegistrerMutation()

    //============= /end submit to Cloud Run =================

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setPhotoLabel('Change Photo');
            const formData = new FormData();
            formData.set('file', file);
            uploadNewImage({
                entity: "fileupload",
                data: formData,
            })
        } else {
            setPreview(null);
            setPhotoLabel('Profile Photo');
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
        const maritalStatus = formData.get('maritalstatus');
        const dateOfBirth = formData.get('dobirth');
        const description = formData.get('description');
        submitNewApplicant({
            entity: "applicant",
            data: {
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
        })
    }
    //--------------

    return (
        <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800"> Admit Course Applicant </h2>
            <form onSubmit={handleSubmitToCloudRun} className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700"> Intake </label>
                    <select
                        name="intakeGuid"
                        value={intakeGuid}
                        onChange={(e) => setIntakeGuid(e.target.value)}
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500"
                    >
                        <option value="">Choose intake</option>
                        {intakes.map((intake) => (
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
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500"
                    >
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
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
                        {allCourses.map((course) => (
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

            {status && (<p className="mt-4 text-center text-sm font-medium text-gray-700"> {status} </p>)}
        </div>
    );
};

export default CoursesAdmissionForm;
