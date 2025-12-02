import React, { useState } from 'react';
import { FaGoogle, FaGithub, FaApple, FaArrowRight, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate registration
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f8fafc]">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute top-[40%] right-[60%] w-[30%] h-[30%] bg-pink-200/30 rounded-full blur-[100px] animate-bounce delay-700 duration-[5000ms]"></div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-6xl h-[90vh] md:h-[850px] mx-4 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 flex overflow-hidden">

                {/* Left Side - Visual & Branding */}
                <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-purple-50 to-blue-50">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <span className="text-2xl font-bold text-slate-800 tracking-wide">EcomSystem</span>
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
                            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Revolution</span>
                        </h1>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                            Create an account today and start managing your e-commerce empire with next-gen tools.
                        </p>
                    </div>

                    {/* Abstract 3D-like elements */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                        <div className="absolute top-1/4 left-10 w-24 h-24 bg-gradient-to-br from-purple-200 to-transparent rounded-2xl -rotate-12 opacity-60 backdrop-blur-sm border border-white/40"></div>
                        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-tr from-blue-200 to-transparent rounded-full opacity-60 backdrop-blur-sm border border-white/40"></div>
                    </div>

                    <div className="relative z-10 flex gap-4 text-sm text-slate-500">
                        <span>© 2024 EcomSystem</span>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/40">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center lg:text-left mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                            <p className="text-slate-500">Join us and start your journey</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaUser className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-sm"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-sm"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-sm"
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-sm"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-600/20 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Create Account <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider">Or sign up with</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <button className="flex items-center justify-center py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-300 group shadow-sm">
                                    <FaGoogle className="text-xl text-slate-500 group-hover:text-red-500 transition-colors" />
                                </button>
                                <button className="flex items-center justify-center py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-300 group shadow-sm">
                                    <FaGithub className="text-xl text-slate-500 group-hover:text-slate-900 transition-colors" />
                                </button>
                                <button className="flex items-center justify-center py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-300 group shadow-sm">
                                    <FaApple className="text-xl text-slate-500 group-hover:text-slate-900 transition-colors" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
