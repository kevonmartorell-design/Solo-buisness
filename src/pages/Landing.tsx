
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#181311] font-display antialiased overflow-x-hidden text-white min-h-screen">
            <div className="fixed inset-0 pointer-events-none industrial-grain z-0 opacity-[0.03]" style={{
                backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCy0JpEpnFxs8K67T0Q2P_0uoBpZ0aAs4GaKc2NJl6nfE3gm9CNSGy8dVkdSQVnFGKNPpA1br4LFD4I9PFMR2KUVLX16CixAQmSrmdeCopSVIoQvpkxB5jFf9YTQFIqJD8LwaIXnunD38uWsH_nDMnJ9Lfo8RFhmAWZ51J_MxyufyPYMYzpxuVUjn47B8umogG43lp7yxdh39pFkGPLgu_dUedR0SXg5_X6r7s-Oge7PbfMccC1oeD4MjpLhE4ES6KHjX1SFoQ0XTQ)'
            }}></div>

            <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#181311]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#de5c1b] rounded flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">precision_manufacturing</span>
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase text-white">Aegis Cert</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-medium text-white/60 uppercase tracking-widest">
                        <a className="hover:text-[#de5c1b] transition-colors cursor-pointer">Systems</a>
                        <a className="hover:text-[#de5c1b] transition-colors cursor-pointer">Innovation</a>
                        <a className="hover:text-[#de5c1b] transition-colors cursor-pointer">About</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-white/60 hover:text-white text-sm font-bold uppercase tracking-wider"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#de5c1b]/20"
                        >
                            GET STARTED
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
                    <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#de5c1b]/10 rounded-full blur-[120px]"></div>
                    </div>
                    <div className="relative z-10 max-w-5xl w-full text-center">
                        <div className="mb-12 flex justify-center">
                            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                                <div className="absolute inset-0 border-2 border-[#de5c1b]/30 rounded-full animate-pulse"></div>
                                <div className="absolute inset-4 border border-white/20 rounded-full"></div>
                                <span className="material-symbols-outlined text-[100px] md:text-[140px] text-[#de5c1b]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}>
                                    settings_input_component
                                </span>
                                <div className="absolute bottom-0 bg-[#181311] px-4 border border-white/20 py-1 rounded-full text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">
                                    Operational OS
                                </div>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-6 uppercase">
                            Command <span className="text-[#de5c1b]">Your Business</span> With Precision
                        </h1>
                        <p className="text-silver text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                            Redefining workforce management with intelligent systems designed for the future of business. Minimalist precision meets powerful operational control.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-10 py-4 bg-[#de5c1b] text-white rounded-lg font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-[#de5c1b]/30 uppercase tracking-wide"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-10 py-4 border border-silver/30 text-white rounded-lg font-bold text-lg hover:bg-white/5 transition-colors uppercase tracking-wide flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">login</span> Login
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-charcoal/50 border-y border-silver/10 py-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-wrap justify-between gap-8 md:gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-silver/60 font-bold mb-1">System Uptime</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-white tracking-tight">99.9%</span>
                                    <span className="text-green-500 text-xs font-bold">+0.2%</span>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-silver/10 hidden md:block"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-silver/60 font-bold mb-1">Efficiency Ratio</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-white tracking-tight">94.2%</span>
                                    <span className="text-green-500 text-xs font-bold">+1.5%</span>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-silver/10 hidden md:block"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-silver/60 font-bold mb-1">Resilience Score</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-white tracking-tight text-[#de5c1b]">A+</span>
                                    <span className="text-silver/40 text-xs font-bold">STABLE</span>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-silver/10 hidden md:block"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-silver/60 font-bold mb-1">Global Load</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-white tracking-tight">2.4m/s</span>
                                    <span className="text-[#de5c1b] text-xs font-bold">NOMINAL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="max-w-7xl mx-auto px-4 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#1c1917] p-8 rounded-xl border border-white/5 group hover:border-[#de5c1b]/50 transition-all">
                            <div className="w-12 h-12 rounded-lg bg-[#de5c1b]/20 flex items-center justify-center text-[#de5c1b] mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">Command Center</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                Centralized visibility for every industrial asset. Integrate diverse data streams into a single source of truth for total operational control.
                            </p>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-[#de5c1b]"></div>
                            </div>
                        </div>
                        <div className="bg-[#1c1917] p-8 rounded-xl border border-white/5 group hover:border-[#de5c1b]/50 transition-all">
                            <div className="w-12 h-12 rounded-lg bg-[#de5c1b]/20 flex items-center justify-center text-[#de5c1b] mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">shield</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">Workforce Optimization</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                Maximize human capital with AI-driven scheduling and skill-gap analysis. Ensure your strongest assets are deployed where they matter most.
                            </p>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-3/5 h-full bg-[#de5c1b]"></div>
                            </div>
                        </div>
                        <div className="bg-[#1c1917] p-8 rounded-xl border border-white/5 group hover:border-[#de5c1b]/50 transition-all">
                            <div className="w-12 h-12 rounded-lg bg-[#de5c1b]/20 flex items-center justify-center text-[#de5c1b] mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">sync_alt</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">Financial Intelligence</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                Bulletproof fiscal management with automated reporting. Build financial resilience into your bottom line with self-healing budget tracking.
                            </p>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-[#de5c1b]"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full px-4 py-20 bg-[#1c1917]/30 border-t border-white/5">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight uppercase">Intelligent Business Management</h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Streamline your operations with a platform that adapts to your scale. From solo entrepreneurs to multi-unit enterprises, Aegis Cert provides the tools to manage your team, clients, and finances in one unified ecosystem.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-white/80 font-medium">
                                    <span className="material-symbols-outlined text-[#de5c1b]">check_circle</span> Role-Specific Dashboards
                                </li>
                                <li className="flex items-center gap-3 text-white/80 font-medium">
                                    <span className="material-symbols-outlined text-[#de5c1b]">check_circle</span> Smart Scheduling & Analytics
                                </li>
                                <li className="flex items-center gap-3 text-white/80 font-medium">
                                    <span className="material-symbols-outlined text-[#de5c1b]">check_circle</span> Integrated CRM & Service Management
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/2 aspect-square bg-gradient-to-br from-[#27272a] to-[#18181b] rounded-2xl border border-white/5 p-8 flex items-center justify-center overflow-hidden relative">
                            <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5JyqUtATIwUvhZwdsqDt9exPeffqcJtNTxCRk8CoG6nVDK_wiCJmDZIZNKGCafW0_H7FsHhwfm0wh6diShsv5ZWnqEeIXh00PCX_EgNSdaxwCsgDPuVE6ewbvXW3FTICtEPYAL4F0afkCIj64_b32Cu3Ut3baEuO5k_ua_kc6Wioz3Drh2IetbY69C_AAMsf8wQygx0mjEjF750rbSzdOa5qaL3mkj1sL4_SUeoIeDJSiW_URhKth0_t8O2474wmsBOnAjLupGKY')" }}></div>
                            <div className="relative w-full h-full border border-[#de5c1b]/20 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-8xl text-white/10 animate-pulse">poll</span>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="w-32 h-32 border-4 border-[#de5c1b] rounded-full border-t-transparent animate-spin-slow"></div>
                                    <span className="mt-4 text-[10px] uppercase tracking-[0.5em] text-[#de5c1b] font-black">Syncing Data</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 py-24 border-t border-white/5">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                        <div className="w-full md:w-1/2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[#de5c1b]/10 rounded-lg">
                                    <span className="material-symbols-outlined text-[#de5c1b]">lock</span>
                                </div>
                                <span className="text-[#de5c1b] font-bold tracking-widest uppercase text-sm">The Vault</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-tight">Industry-Specific Intelligence</h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Teach the AI your world. Whether you run a security firm tracking CLEET licenses or a restaurant managing food handler permits, The Vault adapts to your compliance needs.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-[#1c1917] p-6 rounded-xl border border-white/5 hover:border-[#de5c1b]/30 transition-colors">
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#de5c1b] text-sm">verified_user</span>
                                        Custom Compliance
                                    </h4>
                                    <p className="text-white/40 text-xs">Define your own certification types and tracking requirements.</p>
                                </div>
                                <div className="bg-[#1c1917] p-6 rounded-xl border border-white/5 hover:border-[#de5c1b]/30 transition-colors">
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#de5c1b] text-sm">psychology</span>
                                        Adaptive AI Training
                                    </h4>
                                    <p className="text-white/40 text-xs">Tell the system "I am a Laundromat" and it adjusts its analysis logic.</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 relative group">
                            <div className="absolute inset-0 bg-[#de5c1b]/20 blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-[#0c0a09] border border-white/10 rounded-2xl p-8 overflow-hidden aspect-video flex items-center justify-center">
                                <div className="grid grid-cols-3 gap-4 w-full opacity-50">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="h-24 bg-white/5 rounded-lg border border-white/5 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                                    ))}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-6xl text-[#de5c1b] mb-4">folder_managed</span>
                                        <div className="text-white font-bold uppercase tracking-widest">Secure Storage</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-[#1c1917] py-24 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 text-center mb-16">
                        <span className="text-[#de5c1b] font-bold tracking-widest uppercase text-sm mb-4 block">Visual Branding</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">Make It Yours</h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            The app should feel like *your* company. Take full control of the visual identity and communication voice.
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 border-l-2 border-[#de5c1b] bg-black/20 hover:bg-black/40 transition-colors">
                            <span className="material-symbols-outlined text-4xl text-white mb-6">palette</span>
                            <h3 className="text-xl font-bold text-white mb-3">Total Aesthetic Control</h3>
                            <p className="text-white/60 text-sm">
                                Swap the standard "Aegis Cert Blue" for your brand's "Construction Orange". Customize logos, app icons, and loading screens.
                            </p>
                        </div>
                        <div className="p-8 border-l-2 border-[#de5c1b] bg-black/20 hover:bg-black/40 transition-colors">
                            <span className="material-symbols-outlined text-4xl text-white mb-6">domain</span>
                            <h3 className="text-xl font-bold text-white mb-3">White Label Domain</h3>
                            <p className="text-white/60 text-sm">
                                Host your portal at <span className="text-[#de5c1b]">app.yourbusiness.com</span> instead of a generic URL.
                            </p>
                        </div>
                        <div className="p-8 border-l-2 border-[#de5c1b] bg-black/20 hover:bg-black/40 transition-colors">
                            <span className="material-symbols-outlined text-4xl text-white mb-6">campaign</span>
                            <h3 className="text-xl font-bold text-white mb-3">Branded Voice</h3>
                            <p className="text-white/60 text-sm">
                                Automated SMS and emails come from *you*. "Powered by Aegis Cert" removal options available.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 py-32">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">Tailored for <span className="text-[#de5c1b]">Every Stage</span></h2>
                        <p className="text-white/60 max-w-xl mx-auto text-lg">
                            Scale your operations without changing your platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Client Tier */}
                        <div className="border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center opacity-60 hover:opacity-100 transition-opacity">
                            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Client Experience</h3>
                            <div className="text-3xl font-bold text-white mb-8">Free</div>
                            <ul className="space-y-4 text-sm text-white/60 mb-8 flex-1">
                                <li>Book Appointments</li>
                                <li>Browse Profiles</li>
                                <li>Leave Ratings & Reviews</li>
                                <li>Post Testimonials</li>
                            </ul>
                            <button className="w-full py-3 border border-white/20 text-white rounded-lg font-bold hover:bg-white/5 transition-colors uppercase text-sm">
                                Join as Client
                            </button>
                        </div>

                        {/* Solo Tier */}
                        <div className="border border-[#de5c1b] bg-[#de5c1b]/5 rounded-2xl p-8 flex flex-col items-center text-center transform md:-translate-y-4 relative shadow-2xl shadow-[#de5c1b]/10">
                            <div className="absolute top-0 -translate-y-1/2 bg-[#de5c1b] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Solo / Small Team</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-sm text-[#de5c1b]">$</span>
                                <span className="text-5xl font-bold text-white">40</span>
                                <span className="text-sm text-white/40">/mo</span>
                            </div>
                            <p className="text-[#de5c1b] text-xs font-bold mb-6 uppercase tracking-wider">1 - 10 Employees</p>
                            <ul className="space-y-4 text-sm text-white/80 mb-8 flex-1">
                                <li className="flex items-center gap-2 justify-center"><span className="material-symbols-outlined text-[#de5c1b] text-sm">check</span> Smart Scheduling</li>
                                <li className="flex items-center gap-2 justify-center"><span className="material-symbols-outlined text-[#de5c1b] text-sm">check</span> Performance Analytics</li>
                                <li className="flex items-center gap-2 justify-center"><span className="material-symbols-outlined text-[#de5c1b] text-sm">check</span> Client CRM</li>
                                <li className="flex items-center gap-2 justify-center"><span className="material-symbols-outlined text-[#de5c1b] text-sm">check</span> Automated Reminders</li>
                            </ul>
                            <button className="w-full py-4 bg-[#de5c1b] text-white rounded-lg font-bold hover:bg-[#de5c1b]/90 transition-colors uppercase text-sm shadow-lg shadow-[#de5c1b]/20">
                                Start Free Trial
                            </button>
                        </div>

                        {/* Business Tier */}
                        <div className="border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:border-white/30 transition-colors">
                            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Business Scale</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-sm text-white/40">$</span>
                                <span className="text-5xl font-bold text-white">70</span>
                                <span className="text-sm text-white/40">/mo</span>
                            </div>
                            <p className="text-white/40 text-xs font-bold mb-6 uppercase tracking-wider">30+ Employees</p>
                            <ul className="space-y-4 text-sm text-white/60 mb-8 flex-1">
                                <li className="flex items-center gap-2 justify-center"><span className="material-symbols-outlined text-white text-sm">check</span> The Vault (Compliance)</li>
                                <li className="flex items-center gap-2 justify-center"><span className="material-symbols-outlined text-white text-sm">check</span> AI Industry Training</li>
                                <li className="flex items-center gap-2 justify-center"><span className="material-symbols-outlined text-white text-sm">check</span> White Label Domains</li>
                                <li className="flex items-center gap-2 justify-center"><span className="material-symbols-outlined text-white text-sm">check</span> Custom Branding</li>
                            </ul>
                            <button className="w-full py-3 border border-white/20 text-white rounded-lg font-bold hover:bg-white/5 transition-colors uppercase text-sm">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full border-t border-silver/10 py-12 px-4 bg-background-dark relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 bg-[#de5c1b] rounded flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
                            </div>
                            <span className="text-lg font-bold tracking-tighter uppercase text-white">Aegis Cert</span>
                        </div>
                        <p className="text-silver text-sm max-w-sm mb-6">
                            Leading the global shift toward intelligent workforce management through data-driven design and operational superiority.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-silver/10 flex items-center justify-center text-silver hover:text-[#de5c1b] transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-xl">share</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-silver/10 flex items-center justify-center text-silver hover:text-[#de5c1b] transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-xl">settings</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-silver/10 flex items-center justify-center text-silver hover:text-[#de5c1b] transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-xl">hub</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Resources</h4>
                        <ul className="space-y-3 text-silver text-sm">
                            <li><a className="hover:text-[#de5c1b] cursor-pointer">Documentation</a></li>
                            <li><a className="hover:text-[#de5c1b] cursor-pointer">API Reference</a></li>
                            <li><a className="hover:text-[#de5c1b] cursor-pointer">Support Hub</a></li>
                            <li><a className="hover:text-[#de5c1b] cursor-pointer">Case Studies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Legal</h4>
                        <ul className="space-y-3 text-silver text-sm">
                            <li><a className="hover:text-[#de5c1b] cursor-pointer">Privacy Policy</a></li>
                            <li><a className="hover:text-[#de5c1b] cursor-pointer">Terms of Service</a></li>
                            <li><a className="hover:text-[#de5c1b] cursor-pointer">Security</a></li>
                            <li><a className="hover:text-[#de5c1b] cursor-pointer">Compliance</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-silver/5 flex flex-col md:flex-row justify-between gap-4 text-silver/40 text-[10px] uppercase tracking-widest">
                    <p>© 2026 Aegis Cert Systems Inc. All Rights Reserved.</p>
                    <p>Built with Precision in Code & Design.</p>
                </div>
            </footer>
        </div >
    );
};

export default Landing;
