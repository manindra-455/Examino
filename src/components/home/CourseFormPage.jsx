import React, { useState } from 'react';
import { FaPlus, FaChevronDown, FaTrash, FaSpinner } from 'react-icons/fa';
import rightImage from '../../assets/imgge.png';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const CourseFormPage = ({ setStep }) => {
    const [courses, setCourses] = useState([{ course: '', rollFrom: '', rollTo: '', students: '' }]);
    const [seatingType, setSeatingType] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddCourse = () => {
        setCourses([...courses, { course: '', rollFrom: '', rollTo: '', students: '' }]);
    };

    const handleDeleteCourse = (index) => {
        const updatedCourses = courses.filter((_, i) => i !== index);
        setCourses(updatedCourses);
    };

    const handleChange = (index, field, value) => {
        const updatedCourses = [...courses];
        updatedCourses[index][field] = value;

        const rollFrom = parseInt(updatedCourses[index].rollFrom);
        const rollTo = parseInt(updatedCourses[index].rollTo);

        if (!isNaN(rollFrom) && !isNaN(rollTo) && rollTo >= rollFrom) {
            updatedCourses[index].students = rollTo - rollFrom + 1;
        }

        setCourses(updatedCourses);
    };

    const handleSubmit = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert("User not logged in.");
            return;
        }

        setLoading(true);

        const userRef = doc(db, 'users', user.email);

        try {
            const formattedCourses = courses.map(course => ({
                course: course.course,
                rollFrom: course.rollFrom,
                rollTo: course.rollTo,
                students: course.students
            }));

            await updateDoc(userRef, {
                'data.courses': formattedCourses,
                'data.seatingType': seatingType
            });

            navigate('/success', { state: { userEmail: user.email } });
        } catch (err) {
            console.error("Error saving data to Firestore:", err);
            alert("Failed to save data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row">
            {/* Left Form */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                {courses.map((courseItem, index) => (
                    <form key={index} className="space-y-4 mb-6 border-b pb-6">
                        <div>
                            <label className="block text-[#2f3b92] mb-1">Course</label>
                            <input
                                type="text"
                                value={courseItem.course}
                                onChange={(e) => handleChange(index, 'course', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border-b-4 border-[#f8b237] shadow-md focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-[#2f3b92] mb-1">Roll no From</label>
                                <input
                                    type="text"
                                    value={courseItem.rollFrom}
                                    onChange={(e) => handleChange(index, 'rollFrom', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-b-4 border-[#f8b237] shadow-md focus:outline-none"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-[#2f3b92] mb-1">Roll no To</label>
                                <input
                                    type="text"
                                    value={courseItem.rollTo}
                                    onChange={(e) => handleChange(index, 'rollTo', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-b-4 border-[#f8b237] shadow-md focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#2f3b92] mb-1">Total no of Students</label>
                            <input
                                type="number"
                                value={courseItem.students}
                                readOnly
                                className="w-full px-4 py-2 bg-gray-100 rounded-lg border-b-4 border-[#f8b237] shadow-md focus:outline-none"
                            />
                        </div>

                        {courses.length > 1 && (
                            <div className="flex items-center justify-start mt-2">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteCourse(index)}
                                    className="text-red-600 flex items-center gap-2 hover:underline"
                                >
                                    <FaTrash /> Delete Course
                                </button>
                            </div>
                        )}
                    </form>
                ))}

                {/* Seating Type */}
                <div className="mb-6">
                    <label className="block text-[#2f3b92] mb-1">Select Seating Type</label>
                    <div className="relative">
                        <select
                            value={seatingType}
                            onChange={(e) => setSeatingType(e.target.value)}
                            className="w-full appearance-none px-4 py-2 rounded-lg border-b-4 border-[#f8b237] shadow-md focus:outline-none"
                        >
                            <option value="">Select seating type</option>
                            <option value="Single">Single</option>
                            <option value="Dual">Dual</option>
                        </select>
                        <FaChevronDown className="absolute right-4 top-3 pointer-events-none text-[#2f3b92]" />
                    </div>
                </div>

                {/* Add Course */}
                <div className="w-full flex justify-end items-center mb-6">
                    <div
                        onClick={handleAddCourse}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div className="p-1 rounded-full bg-[#303f8e] text-white">
                            <FaPlus />
                        </div>
                        <p className="text-[#303f8e] font-medium">Add Course</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-6">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 bg-[#2f3b92] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 ${
                            loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#1f2b7a]'
                        }`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="bg-[#2f3b92] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#1f2b7a] transform transition-transform duration-200 active:scale-95"
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Right Image */}
            <div className="w-1/2 hidden md:flex justify-center items-center p-10">
                <img src={rightImage} alt="illustration" className="w-full h-auto object-contain" />
            </div>
        </div>
    );
};

export default CourseFormPage;
