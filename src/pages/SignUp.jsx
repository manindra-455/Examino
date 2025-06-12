import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Adjust the path to your firebase.js
import Image from "../assets/imgge.png";
import logo from "../assets/logo_examino.png";
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        nickname: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { username, nickname, phone, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);

            // Store user data in Firestore with email as document ID
            await setDoc(doc(db, "users", email), {
                username,
                nickname,
                phone,
                email,
                password, 
                createdAt: new Date(),
            });

            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='w-full h-[100vh] flex'>
            {/* Left Section */}
            <div className='lg:w-[60%] md:w-[50%] w-full h-full p-4'>
                <div className='flex items-center gap-2'>
                    <img src={logo} alt='examino' className='w-10 h-10 object-cover' />
                    <h1 className='text-xl font-bold text-[#303f8e]'>Examino</h1>
                </div>

                {/* Form Section */}
                <div className="h-auto flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl">
                        <h2 className="text-3xl font-bold text-center text-[#2f3b92]">Nice to meet you!</h2>
                        <p className="text-center text-[#2f3b92] text-lg mb-8">Let’s Sign In Your Account</p>

                        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Fields */}
                            {[
                                ['username', 'Username', 'text'],
                                ['nickname', 'Nick Name', 'text'],
                                ['phone', 'Phone Number', 'text'],
                                ['email', 'Email', 'email'],
                                ['password', 'Password', 'password'],
                                ['confirmPassword', 'Confirm Password', 'password'],
                            ].map(([name, label, type], index) => (
                                <div key={index}>
                                    <label className="block text-[#2f3b92] mb-1">{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border-b-4 border-[#f8b237] border shadow-md focus:outline-none"
                                    />
                                </div>
                            ))}

                            {/* Error Message */}
                            {error && (
                                <div className="md:col-span-2 text-center text-red-600 font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="md:col-span-2 mt-4 flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-[#2f3b92] text-white font-semibold cursor-pointer py-3 px-8 rounded-xl hover:bg-[#1f2b7a]"
                                >
                                    Sign Up
                                </button>
                            </div>

                            {/* Links */}
                            <div className="md:col-span-2 flex flex-col sm:flex-row justify-center items-center text-sm text-[#2f3b92] mt-2">
                                <p className="mr-2">Already have an account?</p>
                                <Link to="/">
                                    <p className="underline font-medium">Login Now</p>
                                </Link>
                            </div>

                            <div className="md:col-span-2 flex flex-col sm:flex-row justify-between text-sm text-[#2f3b92] mt-6 px-1">
                                <a href="#" className="hover:underline mb-2 sm:mb-0">Privacy Policy</a>
                                <a href="#" className="hover:underline">Cookies Setting</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Image Section */}
            <div className="hidden md:flex w-full md:w-[50%] lg:w-[40%] h-full bg-[#303f8e] justify-center items-center overflow-hidden p-2">
                <img
                    src={Image}
                    alt="examino"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default SignUp;
