import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranding } from '../../contexts/BrandingContext';
import { supabase } from '../../lib/supabase';

const Signup = () => {
    const navigate = useNavigate();
    const { companyName, logoUrl } = useBranding();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                // Determine where to go next. Usually onboarding if not completed.
                // We'll send them to onboarding by default for new signups.
                navigate('/onboarding');
            }
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-[#211611] font-display min-h-screen flex flex-col items-center justify-center p-4 relative" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(222, 92, 27, 0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px"
        }}>
            <div className="w-full max-w-[480px] flex flex-col items-center z-10">
                {/* Logo Section */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#1a1614] border border-[#de5c1b]/20 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#de5c1b]/10 to-transparent"></div>
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain z-10" />
                        ) : (
                            <span className="material-symbols-outlined text-[#de5c1b] text-5xl z-10">
                                factory
                            </span>
                        )}
                        <div className="absolute -bottom-2 -right-2 opacity-20">
                            <span className="material-symbols-outlined text-6xl text-slate-400">
                                precision_manufacturing
                            </span>
                        </div>
                    </div>
                    <h1 className="mt-6 text-3xl font-bold text-white tracking-tight text-center italic">
                        Join {companyName || 'Aegis Cert'}
                    </h1>
                    <p className="text-slate-400/60 text-sm mt-2 font-medium tracking-widest uppercase">Empowering Your Business</p>
                </div>

                {/* Signup Card */}
                <div className="w-full bg-[#1a1614]/80 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <h2 className="text-white text-xl font-semibold mb-6">Create Account</h2>

                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-400 text-sm font-medium ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-500 text-xl group-focus-within:text-[#de5c1b] transition-colors">person</span>
                                </div>
                                <input
                                    name="fullName"
                                    required
                                    className="w-full bg-[#261f1c] border border-white/10 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                    placeholder="e.g. Marcus Aurelius"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-slate-400 text-sm font-medium ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-500 text-xl group-focus-within:text-[#de5c1b] transition-colors">mail</span>
                                </div>
                                <input
                                    name="email"
                                    required
                                    className="w-full bg-[#261f1c] border border-white/10 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                    placeholder="name@company.com"
                                    type="email"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-slate-400 text-sm font-medium ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-500 text-xl group-focus-within:text-[#de5c1b] transition-colors">lock</span>
                                </div>
                                <input
                                    name="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-[#261f1c] border border-white/10 rounded-lg py-3.5 pl-11 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                />
                                <button
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    type="button"
                                >
                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className={`w-full bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-[#de5c1b]/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            type="submit"
                        >
                            <span>{loading ? 'CREATING OPTIMIZED ACCOUNT...' : 'CREATE ACCOUNT'}</span>
                            {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-[#1a1614] px-4 text-slate-500">Or register with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-white/10 bg-[#261f1c] hover:bg-[#2c2420] hover:border-white/20 transition-all">
                            <svg className="w-5 h-5 fill-slate-400" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.144-1.908 4.144-1.255 1.255-3.155 2.633-6.412 2.633-5.144 0-9.28-4.144-9.28-9.28s4.136-9.28 9.28-9.28c2.783 0 4.982 1.1 6.601 2.633l2.31-2.31c-2.022-1.894-4.63-3.3-8.911-3.3-7.512 0-13.682 6.17-13.682 13.682s6.17 13.682 13.682 13.682c4.047 0 7.106-1.344 9.467-3.818 2.443-2.443 3.218-5.858 3.218-8.736 0-.829-.061-1.611-.184-2.32h-12.502z"></path>
                            </svg>
                        </button>
                        <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-white/10 bg-[#261f1c] hover:bg-[#2c2420] hover:border-white/20 transition-all">
                            <svg className="w-5 h-5 fill-slate-400" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                            </svg>
                        </button>
                        <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-white/10 bg-[#261f1c] hover:bg-[#2c2420] hover:border-white/20 transition-all">
                            <svg className="w-5 h-5 fill-slate-400" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98 1.42-2.03 2.82-3.62 2.85-1.56.03-2.06-.92-3.85-.92-1.8 0-2.35.9-3.83.95-1.54.05-2.75-1.54-3.74-2.95-2-2.89-3.53-8.17-1.46-11.77 1.03-1.79 2.86-2.92 4.87-2.95 1.52-.03 2.96 1.02 3.89 1.02.93 0 2.68-1.28 4.51-1.1 1.04.04 3.96.42 5.84 3.17-.15.09-3.5 2.03-3.46 6.07.04 4.85 4.22 6.56 4.26 6.57-.03.09-.67 2.3-2.21 4.53v-.02zm-3.23-17.82c.83-1.01 1.39-2.42 1.23-3.83-1.21.05-2.67.81-3.54 1.82-.78.89-1.46 2.33-1.27 3.71 1.35.11 2.74-.7 3.58-1.7z"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-[13px] text-slate-500 leading-relaxed">
                            By creating an account, you agree to our <br />
                            <a className="text-slate-400 hover:text-[#de5c1b] underline transition-colors cursor-pointer">Terms of Service</a> &
                            <a className="text-slate-400 hover:text-[#de5c1b] underline transition-colors cursor-pointer"> Privacy Policy</a>.
                        </p>
                        <p className="mt-8 text-sm text-slate-500">
                            Already have an account?
                            <a
                                onClick={() => navigate('/login')}
                                className="text-[#de5c1b] font-bold hover:underline cursor-pointer ml-1"
                            >
                                Log In
                            </a>
                        </p>
                    </div>
                </div>

                {/* System Status Bar */}
                <div className="mt-12 flex gap-6 text-[10px] text-slate-600 font-mono hidden md:flex">
                    <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-green-500/50"></span>
                        SYSTEMS NOMINAL
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px]">encrypted</span>
                        AES-256 ACTIVE
                    </div>
                    <div className="flex items-center gap-1.5 uppercase">
                        V-2.4.0-PHOENIX
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;


