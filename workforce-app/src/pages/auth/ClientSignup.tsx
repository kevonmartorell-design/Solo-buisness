import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBranding } from '../../contexts/BrandingContext';
import { supabase } from '../../lib/supabase';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';

const ClientSignup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
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
                        tier: 'client', // Identify as a client user
                        role: 'client'
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                // Ensure auth context is refreshed with the new session/profile before navigating
                await login();
                navigate('/client/dashboard');
            }
        } catch (err: any) {
            console.error('Client signup error:', err);
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#181311] font-display min-h-screen flex flex-col items-center justify-center p-4 relative text-white" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(222, 92, 27, 0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px"
        }}>
            <div className="w-full max-w-[480px] flex flex-col items-center z-10">
                {/* Logo Section */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#251f1d] border border-[#de5c1b]/20 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#de5c1b]/10 to-transparent"></div>
                        <img src={logoUrl || '/aegis-logo.png'} alt="Logo" className="w-12 h-12 object-contain z-10" />
                    </div>
                    <h1 className="mt-6 text-3xl font-bold text-white tracking-tight text-center italic">
                        Client Portal
                    </h1>
                    <p className="text-slate-400/60 text-sm mt-2 font-medium tracking-widest uppercase">{companyName || 'Aegis Cert'}</p>
                </div>

                {/* Signup Card */}
                <div className="w-full bg-[#251f1d]/80 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-xl font-semibold">Create Free Account</h2>
                        <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            Client Status
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div className="flex flex-col gap-2">
                            <label className="text-white/70 text-sm font-medium ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-500 group-focus-within:text-[#de5c1b] transition-colors" />
                                </div>
                                <input
                                    name="fullName"
                                    required
                                    className="w-full bg-[#181311] border border-white/10 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                    placeholder="e.g. Jane Doe"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white/70 text-sm font-medium ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-[#de5c1b] transition-colors" />
                                </div>
                                <input
                                    name="email"
                                    required
                                    className="w-full bg-[#181311] border border-white/10 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                    placeholder="name@example.com"
                                    type="email"
                                />
                            </div>
                            <p className="text-xs text-slate-500 ml-1">Use the same email you booked with to link appointments automatically.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white/70 text-sm font-medium ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-[#de5c1b] transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-[#181311] border border-white/10 rounded-lg py-3.5 pl-11 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className={`w-full bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white font-bold py-4 mt-8 rounded-xl shadow-lg shadow-[#de5c1b]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            type="submit"
                        >
                            <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-white/50">
                            Already have an account?
                            <button
                                type="button"
                                onClick={() => navigate('/client/login')}
                                className="text-[#de5c1b] font-bold hover:underline cursor-pointer ml-1"
                            >
                                Log In
                            </button>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-white/30">
                    Powered by AEGIS CERT
                </div>
            </div>
        </div>
    );
};

export default ClientSignup;
