

import { useState } from 'react';
import clsx from 'clsx';

import { useSidebar } from '../../contexts/SidebarContext';

const Vault = () => {
    const { toggleSidebar } = useSidebar();
    const [activeFilter, setActiveFilter] = useState('All Docs');
    const [searchQuery, setSearchQuery] = useState('');

    const folders = [
        { id: 1, name: 'Legal IDs', count: 4, size: '12.4 MB', icon: 'folder_shared', color: 'blue', category: 'IDs' },
        { id: 2, name: 'Firearm Permits', count: 2, size: '3.1 MB', icon: 'military_tech', color: 'orange', category: 'Licenses' },
        { id: 3, name: 'Certifications', count: 12, size: '45.8 MB', icon: 'verified_user', color: 'emerald', category: 'Licenses' },
        { id: 4, name: 'Training', count: 8, size: '18.2 MB', icon: 'school', color: 'purple', category: 'Training' },
    ];

    const documents = [
        { id: 1, name: 'Medical First Responder', status: 'VERIFIED', expDate: 'Dec 2025', expiresDays: '482D', icon: 'description', type: 'License', category: 'Licenses' },
        { id: 2, name: "State Driver's License", status: 'CLASS D', expDate: 'Aug 2028', expiresDays: '1458D', icon: 'badge', type: 'ID', category: 'IDs' },
    ];

    const filters = ['All Docs', 'Licenses', 'Training', 'IDs'];

    const filteredFolders = folders.filter(folder =>
        (activeFilter === 'All Docs' || folder.category === activeFilter) &&
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDocuments = documents.filter(doc =>
        (activeFilter === 'All Docs' || doc.category === activeFilter) &&
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="font-display text-slate-900 dark:text-slate-100 flex flex-col h-full bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        onClick={toggleSidebar}
                        className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-primary">menu</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">The Vault</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">AES-256 Encrypted</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
                {/* Search & Filter */}
                <div className="mb-8">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-500 text-sm">search</span>
                        </div>
                        <input
                            className="w-full bg-stealth-gray/50 dark:bg-[#1e1e1e]/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm transition-all"
                            placeholder="Search licenses, permits, IDs..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                                    activeFilter === filter
                                        ? "bg-primary text-white border-primary"
                                        : "bg-stealth-gray dark:bg-[#1e1e1e] border-white/10 text-slate-400 hover:text-white"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priority Alerts */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Critical Alerts</h2>
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">1 ACTION REQUIRED</span>
                    </div>
                    <div className="glass-card bg-[rgba(40,40,40,0.4)] backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center gap-4 border-l-4 border-l-primary relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <span className="material-symbols-outlined text-6xl">warning</span>
                        </div>
                        <div className="w-14 h-14 rounded-lg bg-black/40 border border-white/5 flex-shrink-0 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                            <img className="w-full h-full object-cover" alt="Document preview" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2y7XfnzM53LUZ6jLvPb_pzDJLVR1oW5gvil0oA4e_AzQsl1hjuHKTYAZqvI3SBEaQGm_k5kq7d0XZtV31CupRV_02D4nqsu4zqzltgKnbfRHUPyBMvUyEzICvdulhDy26wP7dJ5krypgAXZt8cqeYA1jPKCYR5evOXg5Ud5QJv5YUuqQwBeGCMVNkAxNXcI8sqVJUICs-wJ0NBPdSDBeQLCmeSUDmfPxMIcVy1nZW2UK5MvVAnEPkCOI4S5HUWp839ol7J8nS4Rg" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm">CLEET Private Security</h3>
                            <p className="text-xs text-slate-400 mb-1">ID: #4492-BX-2024</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-primary tabular-nums">EXPIRING IN 14 DAYS</span>
                            </div>
                        </div>
                        <button className="bg-primary text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wider">Renew</button>
                    </div>
                </section>

                {/* Secure Folders Grid */}
                {filteredFolders.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Secure Folders</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {filteredFolders.map((folder) => (
                                <div key={folder.id} className="glass-folder bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg border border-white/5 rounded-xl p-4 flex flex-col gap-3 group cursor-pointer hover:border-primary/30 transition-all">
                                    <div className={`w-10 h-10 rounded-lg bg-${folder.color}-500/10 flex items-center justify-center border border-${folder.color}-500/20`}>
                                        <span className={`material-symbols-outlined text-${folder.color}-400`}>{folder.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold">{folder.name}</h3>
                                        <p className="text-[10px] text-slate-500">{folder.count} Items • {folder.size}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Document List */}
                {filteredDocuments.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Active Compliance</h2>
                        <div className="space-y-3">
                            {filteredDocuments.map((doc) => (
                                <div key={doc.id} className="glass-card bg-[rgba(40,40,40,0.4)] backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-800 rounded border border-white/5 flex items-center justify-center text-slate-500">
                                        <span className="material-symbols-outlined">{doc.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold">{doc.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{doc.status}</span>
                                            <span className="text-[10px] text-slate-500">Exp: {doc.expDate}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Expires in</p>
                                        <p className="text-xs font-bold tabular-nums">{doc.expiresDays}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Vault;
