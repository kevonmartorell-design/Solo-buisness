import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranding } from '../../contexts/BrandingContext';

const Login = () => {
    const navigate = useNavigate();
    const { companyName, logoUrl } = useBranding();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual login logic
        navigate('/dashboard');
    };

    return (
        <div className="bg-background-light dark:bg-[#211611] font-display min-h-screen flex flex-col items-center justify-center p-4" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(var(--color-primary-rgb), 0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px"
        }}>
            <div className="w-full max-w-[440px] flex flex-col items-center">
                {/* Logo Section */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-industrial-charcoal border border-industrial-silver/20 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain z-10" />
                        ) : (
                            <span className="material-symbols-outlined text-primary text-5xl z-10">
                                settings_backup_restore
                            </span>
                        )}
                        <div className="absolute -bottom-2 -right-2 opacity-20">
                            <span className="material-symbols-outlined text-6xl text-industrial-silver">
                                precision_manufacturing
                            </span>
                        </div>
                    </div>
                    <h1 className="mt-6 text-3xl font-bold text-white tracking-tight text-center italic">
                        {companyName}
                    </h1>
                    <p className="text-industrial-silver/60 text-sm mt-2 font-medium tracking-widest uppercase">Empowering Your Business</p>
                </div>

                {/* Login Card */}
                <div className="w-full bg-industrial-charcoal/80 backdrop-blur-md border border-industrial-silver/10 rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <h2 className="text-white text-xl font-semibold mb-6">Welcome Back</h2>
                    <form className="space-y-5" onSubmit={handleLogin}>
                        {/* Email Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-industrial-silver text-sm font-medium ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-industrial-silver/40 text-xl group-focus-within:text-primary transition-colors">mail</span>
                                </div>
                                <input
                                    className="w-full bg-[#261f1c] border border-industrial-silver/20 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder:text-industrial-silver/30 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                    placeholder="operator@aegiscert.io"
                                    type="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-industrial-silver text-sm font-medium">Password</label>
                                <a className="text-primary/80 hover:text-primary text-xs font-semibold transition-colors cursor-pointer">Forgot Password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-industrial-silver/40 text-xl group-focus-within:text-primary transition-colors">lock</span>
                                </div>
                                <input
                                    className="w-full bg-[#261f1c] border border-industrial-silver/20 rounded-lg py-3.5 pl-11 pr-12 text-white placeholder:text-industrial-silver/30 focus:outline-none focus:ring-1 focus:ring-[#de5c1b] focus:border-[#de5c1b] transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                />
                                <button
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-industrial-silver/40 hover:text-industrial-silver transition-colors"
                                    type="button"
                                >
                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            className="w-full bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-[#de5c1b]/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                            type="submit"
                        >
                            <span className="material-symbols-outlined text-xl">login</span>
                            LOGIN TO TERMINAL
                        </button>
                    </form>

                    {/* Decorative Elements */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-industrial-silver/10"></div>
                        <div className="text-[10px] text-industrial-silver/30 tracking-[0.2em] font-bold">SECURE NODE</div>
                        <div className="h-[1px] flex-1 bg-industrial-silver/10"></div>
                    </div>
                </div>

                {/* Footer / Sign Up Link */}
                <div className="mt-8 text-center">
                    <p className="text-industrial-silver/60 text-sm">
                        New to Aegis Cert?
                        <a
                            onClick={() => navigate('/signup')}
                            className="text-white hover:text-primary font-semibold underline underline-offset-4 ml-1 transition-colors cursor-pointer"
                        >
                            Initialize Account
                        </a>
                    </p>
                </div>

                {/* System Status Bar */}
                <div className="mt-12 flex gap-6 text-[10px] text-industrial-silver/40 font-mono">
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

export default Login;
