import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // adjust path if needed
import Image from "../assets/imgge.png";
import logo from "../assets/logo_examino.png";
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Eye icons from lucide-react (install via: npm i lucide-react)

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen flex flex-col md:flex-row overflow-hidden'>
            {/* Left Section */}
            <div className='relative w-full md:w-[50%] lg:w-[60%] md:p-4 p-0 flex justify-center items-center'>
                <div className='absolute top-4 left-4 hidden md:flex items-center gap-2'>
                    <img src={logo} alt='examino' className='w-10 h-10 object-cover' />
                    <h1 className='text-xl font-bold text-[#303f8e]'>Examino</h1>
                </div>
                <div className="hidden md:flex w-full justify-center items-center">
                    <img src={Image} alt="examino" className="w-[80%] h-auto object-cover" loading="lazy" />
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:h-auto h-[100vh] md:w-[50%] lg:w-[40%] bg-[#303f8e] flex flex-col justify-center items-center p-6">
                <div className="w-full max-w-md">
                    <h1 className='text-4xl font-bold text-center text-white mb-2'>
                        Hello! <br />Welcome back
                    </h1>
                    <p className="text-center text-white text-lg mb-8">Let’s Login to Your Account</p>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 w-full">
                        <div>
                            <label className="block text-white mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg text-white border-b-4 border-[#f8b237] border shadow-md focus:outline-none bg-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-10 rounded-lg text-white border-b-4 border-[#f8b237] border shadow-md focus:outline-none bg-transparent"
                                    required
                                />
                                <div
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-300 text-sm text-center -mt-4">{error}</p>}

                        <div className="mt-4 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#f4711d] cursor-pointer text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center"
                            >
                                {loading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                ) : 'Sign In'}
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-white mt-2">
                            <p className="mr-2">Don’t have an account?</p>
                            <Link to="/signup">
                                <p className="underline font-medium">Sign Up</p>
                            </Link>
                        </div>

                        <div className="flex justify-between text-sm text-white mt-6">
                            <a href="#" className="hover:underline mb-2 sm:mb-0">Privacy Policy</a>
                            <a href="#" className="hover:underline">Cookies Setting</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
