import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual signup logic
        navigate('/dashboard');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center p-4 relative">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBqu_FnhRxDtrInESYNEWuQ3nROuTD-5MAtDFEHg8sClMDvZ23R07EU_8HYGIlEyfcIKk30r60g2xi3mCrdjX2P-IqQealk8ZqNe58oEaHu8qo2LCl6HLeIZ4dmCfpuDPpT4AwUnfDu-PFfGHkWs5BAnk3nR1aTwjQOi5hXFYrOFjomtxaEx1qE2PLhQKxN0lThDhBLaMMOFy3CiWhavYomCfD-mZy2-5EBLThozTG70Yc2u5dmXlIVY1S4C3eRufdcQ5km63bTZbs)" }}
            ></div>

            <div className="w-full max-w-[480px] z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-primary text-4xl" data-icon="factory">factory</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Join WorkForce</h1>
                    <p className="text-metallic-silver/60 text-center font-normal">Empowering Your Business</p>
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase tracking-widest font-bold text-metallic-silver/50 ml-1">Full Name</label>
                        <div className="relative group">
                            <input className="form-input w-full bg-industrial-gray border border-metallic-silver/20 rounded-lg py-4 px-4 text-white placeholder:text-metallic-silver/30 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200" placeholder="e.g. Marcus Aurelius" type="text" />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-metallic-silver/30 group-focus-within:text-primary" data-icon="person">person</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase tracking-widest font-bold text-metallic-silver/50 ml-1">Email Address</label>
                        <div className="relative group">
                            <input className="form-input w-full bg-industrial-gray border border-metallic-silver/20 rounded-lg py-4 px-4 text-white placeholder:text-metallic-silver/30 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200" placeholder="name@company.com" type="email" />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-metallic-silver/30 group-focus-within:text-primary" data-icon="mail">mail</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase tracking-widest font-bold text-metallic-silver/50 ml-1">Password</label>
                        <div className="relative group">
                            <input className="form-input w-full bg-industrial-gray border border-metallic-silver/20 rounded-lg py-4 px-4 text-white placeholder:text-metallic-silver/30 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200" placeholder="••••••••" type="password" />
                            <button className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-metallic-silver/30 hover:text-white transition-colors" data-icon="visibility" type="button">visibility</button>
                        </div>
                    </div>

                    <button
                        onClick={handleSignup}
                        className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 mt-4 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <span>CREATE ACCOUNT</span>
                        <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
                    </button>
                </div>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-metallic-silver/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest">
                        <span className="bg-background-dark px-4 text-metallic-silver/40">Or register with</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-metallic-silver/10 bg-industrial-gray/50 hover:bg-industrial-gray hover:border-metallic-silver/30 transition-all">
                        <svg className="w-5 h-5 fill-metallic-silver" viewBox="0 0 24 24">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.144-1.908 4.144-1.255 1.255-3.155 2.633-6.412 2.633-5.144 0-9.28-4.144-9.28-9.28s4.136-9.28 9.28-9.28c2.783 0 4.982 1.1 6.601 2.633l2.31-2.31c-2.022-1.894-4.63-3.3-8.911-3.3-7.512 0-13.682 6.17-13.682 13.682s6.17 13.682 13.682 13.682c4.047 0 7.106-1.344 9.467-3.818 2.443-2.443 3.218-5.858 3.218-8.736 0-.829-.061-1.611-.184-2.32h-12.502z"></path>
                        </svg>
                    </button>
                    <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-metallic-silver/10 bg-industrial-gray/50 hover:bg-industrial-gray hover:border-metallic-silver/30 transition-all">
                        <svg className="w-5 h-5 fill-metallic-silver" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                        </svg>
                    </button>
                    <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-metallic-silver/10 bg-industrial-gray/50 hover:bg-industrial-gray hover:border-metallic-silver/30 transition-all">
                        <svg className="w-5 h-5 fill-metallic-silver" viewBox="0 0 24 24">
                            <path d="M17.05 20.28c-.98 1.42-2.03 2.82-3.62 2.85-1.56.03-2.06-.92-3.85-.92-1.8 0-2.35.9-3.83.95-1.54.05-2.75-1.54-3.74-2.95-2-2.89-3.53-8.17-1.46-11.77 1.03-1.79 2.86-2.92 4.87-2.95 1.52-.03 2.96 1.02 3.89 1.02.93 0 2.68-1.28 4.51-1.1 1.04.04 3.96.42 5.84 3.17-.15.09-3.5 2.03-3.46 6.07.04 4.85 4.22 6.56 4.26 6.57-.03.09-.67 2.3-2.21 4.53v-.02zm-3.23-17.82c.83-1.01 1.39-2.42 1.23-3.83-1.21.05-2.67.81-3.54 1.82-.78.89-1.46 2.33-1.27 3.71 1.35.11 2.74-.7 3.58-1.7z"></path>
                        </svg>
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[13px] text-metallic-silver/40 leading-relaxed">
                        By creating an account, you agree to our <br />
                        <a className="text-metallic-silver/70 hover:text-primary underline transition-colors cursor-pointer">Terms of Service</a> &
                        <a className="text-metallic-silver/70 hover:text-primary underline transition-colors cursor-pointer">Privacy Policy</a>.
                    </p>
                    <p className="mt-8 text-sm text-metallic-silver/60">
                        Already have an account?
                        <a
                            onClick={() => navigate('/login')}
                            className="text-primary font-bold hover:underline cursor-pointer"
                        >
                            Log In
                        </a>
                    </p>
                </div>
            </div>

            <div className="absolute top-0 left-0 p-8 hidden md:block opacity-20 select-none">
                <div className="text-[10px] text-metallic-silver font-mono space-y-1">
                    <p>IR_SYSTEM_v4.2.0</p>
                    <p>LAT: 40.7128 N</p>
                    <p>LNG: 74.0060 W</p>
                </div>
            </div>
            <div className="absolute bottom-8 right-8 hidden md:block opacity-20 pointer-events-none">
                <div className="flex flex-col items-end">
                    <div className="w-32 h-[1px] bg-metallic-silver/40 mb-2"></div>
                    <div className="text-[8px] text-metallic-silver font-mono uppercase tracking-[0.3em]">Efficiency. Growth. Success.</div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
