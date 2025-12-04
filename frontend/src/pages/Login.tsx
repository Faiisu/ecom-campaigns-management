import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

const Login: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen w-full flex relative overflow-hidden bg-white">
            {/* Left Side - Visual & Branding */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden">
                {/* Animated Background Elements for Left Side */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                    <div className="absolute top-[40%] left-[60%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[100px] animate-bounce delay-700 duration-[5000ms]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 tracking-wide">E-Shop</span>
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">E-Shop</span>
                    </h1>
                </div>

                {/* Abstract 3D-like elements */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-1/4 right-10 w-24 h-24 bg-gradient-to-br from-indigo-200 to-transparent rounded-2xl rotate-12 opacity-60 backdrop-blur-sm border border-white/40"></div>
                    <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-gradient-to-tr from-blue-200 to-transparent rounded-full opacity-60 backdrop-blur-sm border border-white/40"></div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative z-10">
                <div className="max-w-md mx-auto w-full">
                    <button
                        onClick={async () => {
                            setIsLoading(true);
                            try {
                                const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
                                const response = await fetch(`${backendUrl}/guestregister`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    if (data.id) {
                                        localStorage.setItem('guestId', data.id);
                                        if (data.point !== undefined) {
                                            localStorage.setItem('guestPoints', data.point.toString());
                                        }
                                        window.location.href = '/';
                                    } else {
                                        alert('Guest login failed: No ID received');
                                    }
                                } else {
                                    const data = await response.json();
                                    alert(data.Message || 'Guest login failed');
                                }
                            } catch (error) {
                                console.error('Guest login error:', error);
                                alert('An error occurred during guest login');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Sign In As a Guest <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
