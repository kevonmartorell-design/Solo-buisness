import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBranding } from '../../contexts/BrandingContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { companyName, logoUrl } = useBranding();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isPhoneSignup, setIsPhoneSignup] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const handlePhoneSignup = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOtp({
                phone: phone,
            });
            if (error) throw error;
            setShowOtpInput(true);
            toast.success('Verification code sent!');
        } catch (err: any) {
            console.error('Phone signup error:', err);
            toast.error(err.message || 'Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.verifyOtp({
                phone: phone,
                token: otp,
                type: 'sms',
            });
            if (error) throw error;

            if (data.user) {
                await login();
                // Update profile with tier info if needed
                if (data.user.user_metadata?.tier !== tier.toLowerCase()) {
                    await supabase.auth.updateUser({
                        data: { tier: tier.toLowerCase() }
                    });
                }

                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('OTP verify error:', err);
            toast.error(err.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const [searchParams] = useSearchParams();
    const [tier, setTier] = useState<string>(searchParams.get('tier') || 'Free'); // Default to Free if not specified

    // Put tier back in URL for consistency if user refreshes
    React.useEffect(() => {
        const currentTier = searchParams.get('tier');
        if (currentTier && currentTier !== tier) {
            setTier(currentTier);
        }
    }, [searchParams]);

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
                        tier: tier.toLowerCase(), // Pass tier to metadata normalized
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                // Ensure auth context is refreshed with the new session/profile before navigating
                await login();

                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'linkedin' | 'apple') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/dashboard` // Or /onboarding, handled by auth state usually
                }
            });
            if (error) throw error;
        } catch (err: any) {
            console.error(`${provider} login error:`, err);
            toast.error(`Failed to sign in with ${provider}. Please try again.`);
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
                        <img src={logoUrl || '/aegis-logo.png'} alt="Logo" className="w-12 h-12 object-contain z-10" />
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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-xl font-semibold">Create Account</h2>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${tier.toLowerCase() === 'solo'
                            ? 'bg-[#de5c1b]/10 text-[#de5c1b] border-[#de5c1b]/20'
                            : tier.toLowerCase() === 'business'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : 'bg-white/5 text-slate-400 border-white/10'
                            }`}>
                            {tier.toLowerCase() === 'solo' ? 'Solo / Small Team' : tier.toLowerCase() === 'business' ? 'Business Scale' : 'Client Account'}
                        </div>
                    </div>

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
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-400 text-sm font-medium ml-1">Select Plan</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setTier('Free')}
                                    className={`relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${tier.toLowerCase() === 'free'
                                        ? 'bg-white/10 border-white text-white'
                                        : 'bg-[#261f1c] border-white/10 text-slate-500 hover:border-white/30 hover:bg-[#2c2420]'
                                        }`}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1">Client</span>
                                    <span className="text-sm font-bold">Free</span>
                                    {tier.toLowerCase() === 'free' && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[10px] text-black font-bold">check</span>
                                        </div>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTier('Solo')}
                                    className={`relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${tier.toLowerCase() === 'solo'
                                        ? 'bg-[#de5c1b]/20 border-[#de5c1b] text-white'
                                        : 'bg-[#261f1c] border-white/10 text-slate-500 hover:border-[#de5c1b]/50 hover:bg-[#de5c1b]/5'
                                        }`}
                                >
                                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${tier.toLowerCase() === 'solo' ? 'text-[#de5c1b]' : ''}`}>Solo</span>
                                    <span className={`text-sm font-bold ${tier.toLowerCase() === 'solo' ? 'text-[#de5c1b]' : ''}`}>$40<span className="text-[10px] opacity-60">/mo</span></span>
                                    {tier.toLowerCase() === 'solo' && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#de5c1b] rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
                                        </div>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTier('Business')}
                                    className={`relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${tier.toLowerCase() === 'business'
                                        ? 'bg-blue-500/20 border-blue-500 text-white'
                                        : 'bg-[#261f1c] border-white/10 text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5'
                                        }`}
                                >
                                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${tier.toLowerCase() === 'business' ? 'text-blue-400' : ''}`}>Business</span>
                                    <span className={`text-sm font-bold ${tier.toLowerCase() === 'business' ? 'text-blue-400' : ''}`}>$70<span className="text-[10px] opacity-60">/mo</span></span>
                                    {tier.toLowerCase() === 'business' && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
                                        </div>
                                    )}
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
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center py-3 px-4 rounded-lg border border-white/10 bg-[#261f1c] hover:bg-[#2c2420] hover:border-white/20 transition-all">
                            <svg className="w-5 h-5 fill-slate-400" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.144-1.908 4.144-1.255 1.255-3.155 2.633-6.412 2.633-5.144 0-9.28-4.144-9.28-9.28s4.136-9.28 9.28-9.28c2.783 0 4.982 1.1 6.601 2.633l2.31-2.31c-2.022-1.894-4.63-3.3-8.911-3.3-7.512 0-13.682 6.17-13.682 13.682s6.17 13.682 13.682 13.682c4.047 0 7.106-1.344 9.467-3.818 2.443-2.443 3.218-5.858 3.218-8.736 0-.829-.061-1.611-.184-2.32h-12.502z"></path>
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('linkedin')}
                            className="flex items-center justify-center py-3 px-4 rounded-lg border border-white/10 bg-[#261f1c] hover:bg-[#2c2420] hover:border-white/20 transition-all">
                            <svg className="w-5 h-5 fill-slate-400" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPhoneSignup(!isPhoneSignup)}
                            className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${isPhoneSignup
                                ? 'bg-[#de5c1b]/20 border-[#de5c1b] text-white'
                                : 'bg-[#261f1c] border-white/10 hover:bg-[#2c2420] hover:border-white/20'}`}>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-white">smartphone</span>
                        </button>
                    </div>

                    {isPhoneSignup && (
                        <div className="mt-4 p-4 bg-[#261f1c] rounded-lg border border-white/10 animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-400 text-sm font-medium ml-1">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-500 text-xl group-focus-within:text-[#de5c1b] transition-colors">call</span>
                                    </div>
                                    <input
                                        name="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-[#1a1614] border border-white/10 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                        placeholder="+15551234567"
                                        type="tel"
                                    />
                                </div>
                            </div>

                            {showOtpInput && (
                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-slate-400 text-sm font-medium ml-1">Verification Code</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-500 text-xl group-focus-within:text-[#de5c1b] transition-colors">lock_clock</span>
                                        </div>
                                        <input
                                            name="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-[#1a1614] border border-white/10 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                            placeholder="123456"
                                            type="text"
                                            maxLength={6}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={verifyOtp}
                                        disabled={loading}
                                        className="w-full mt-2 bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white font-bold py-3 rounded-lg transition-all"
                                    >
                                        Verify Code
                                    </button>
                                </div>
                            )}

                            {!showOtpInput && (
                                <button
                                    type="button"
                                    onClick={handlePhoneSignup}
                                    disabled={loading || !phone}
                                    className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Send Verification Code'}
                                </button>
                            )}
                        </div>
                    )}

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


