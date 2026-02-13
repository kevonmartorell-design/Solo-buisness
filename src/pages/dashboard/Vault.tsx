
import { useState } from 'react';
import clsx from 'clsx';
import { useSidebar } from '../../contexts/SidebarContext';
import {
    Search,
    Settings,
    Menu,
    Shield,
    Folder,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    Upload,
    MoreVertical,
    Download,
    Eye
} from 'lucide-react';

// --- Types ---

interface VaultItem {
    id: string;
    name: string;
    type: 'License' | 'ID' | 'Certificate' | 'Training';
    status: 'Verified' | 'Pending' | 'Expiring' | 'Expired';
    expiryDate: string; // YYYY-MM-DD
    category: 'IDs' | 'Licenses' | 'Training' | 'Legal';
    size: string;
    lastUpdated: string;
}

interface VaultFolder {
    id: string;
    name: string;
    count: number;
    size: string;
    color: string;
    icon: any;
    category: VaultItem['category'];
}

// --- Mock Data ---

const MOCK_FOLDERS: VaultFolder[] = [
    { id: 'f1', name: 'Legal IDs', count: 4, size: '12.4 MB', color: 'blue', icon: Shield, category: 'IDs' },
    { id: 'f2', name: 'Licenses & Permits', count: 3, size: '5.2 MB', color: 'orange', icon: FileText, category: 'Licenses' },
    { id: 'f3', name: 'Training Certs', count: 12, size: '45.8 MB', color: 'emerald', icon: CheckCircle, category: 'Training' },
    { id: 'f4', name: 'Contracts', count: 8, size: '18.2 MB', color: 'purple', icon: Folder, category: 'Legal' },
];

const MOCK_DOCUMENTS: VaultItem[] = [
    { id: 'd1', name: 'Medical First Responder', type: 'License', status: 'Expiring', expiryDate: '2026-03-01', category: 'Licenses', size: '2.4 MB', lastUpdated: '2024-03-01' },
    { id: 'd2', name: "State Driver's License", type: 'ID', status: 'Verified', expiryDate: '2028-08-15', category: 'IDs', size: '1.1 MB', lastUpdated: '2023-08-15' },
    { id: 'd3', name: 'CLEET Private Security', type: 'License', status: 'Expiring', expiryDate: '2026-02-20', category: 'Licenses', size: '3.5 MB', lastUpdated: '2024-02-20' },
    { id: 'd4', name: 'OSHA 30-Hour Safety', type: 'Certificate', status: 'Verified', expiryDate: '2027-05-10', category: 'Training', size: '5.0 MB', lastUpdated: '2024-05-10' },
    { id: 'd5', name: 'Background Check 2024', type: 'ID', status: 'Verified', expiryDate: '2025-01-15', category: 'IDs', size: '800 KB', lastUpdated: '2024-01-15' },
    { id: 'd6', name: 'Workplace Harassment', type: 'Training', status: 'Pending', expiryDate: '2025-06-01', category: 'Training', size: '15.2 MB', lastUpdated: '2024-06-01' },
];

// --- Helpers ---

const getDaysUntilExpiry = (dateString: string) => {
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getStatusColor = (status: VaultItem['status']) => {
    switch (status) {
        case 'Verified': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
        case 'Pending': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
        case 'Expiring': return 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
        case 'Expired': return 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
        default: return 'text-slate-500';
    }
};

const Vault = () => {
    const { toggleSidebar } = useSidebar();
    const [activeFilter, setActiveFilter] = useState<'All' | VaultItem['category']>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Logic
    const filteredDocs = MOCK_DOCUMENTS.filter(doc => {
        const matchesFilter = activeFilter === 'All' || doc.category === activeFilter;
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const expiringDocs = MOCK_DOCUMENTS.filter(doc => {
        const days = getDaysUntilExpiry(doc.expiryDate);
        return days <= 30 && days >= 0;
    });

    return (
        <div className="bg-slate-50 dark:bg-[#151210] min-h-screen text-slate-900 dark:text-slate-100 font-display flex flex-col">

            {/* --- Header --- */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#211611]/80 backdrop-blur-md px-4 py-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">The Vault</h1>
                            <div className="flex items-center gap-2">
                                <Shield className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">AES-256 Encrypted Storage</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#de5c1b]/20 transition-all flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Upload
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full space-y-8">

                {/* --- Search & Filter --- */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#de5c1b] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search documents, IDs, or licenses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-[#1c1917] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#de5c1b]"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        {['All', 'IDs', 'Licenses', 'Training', 'Legal'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter as any)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                                    activeFilter === filter
                                        ? "bg-[#de5c1b] text-white border-[#de5c1b]"
                                        : "bg-white dark:bg-[#1c1917] text-slate-500 border-slate-200 dark:border-white/10 hover:border-[#de5c1b]/50"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Critical Alerts --- */}
                {expiringDocs.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-[#de5c1b]" /> Action Required
                            </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {expiringDocs.map(doc => (
                                <div key={doc.id} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-[#211611] rounded-lg flex items-center justify-center border border-red-100 dark:border-red-500/20 text-red-500 shadow-sm">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">Expires in {getDaysUntilExpiry(doc.expiryDate)} days</p>
                                        <div className="mt-3 flex gap-3">
                                            <button className="text-xs font-bold bg-white dark:bg-[#211611] text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm hover:bg-slate-50 dark:hover:bg-white/5">Details</button>
                                            <button className="text-xs font-bold bg-[#de5c1b] text-white px-3 py-1.5 rounded-lg shadow-md shadow-[#de5c1b]/20 hover:bg-[#de5c1b]/90">Renew Now</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- Secure Folders --- */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Secure Folders</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {MOCK_FOLDERS.map(folder => {
                            const Icon = folder.icon;
                            return (
                                <div key={folder.id} className="bg-white dark:bg-[#1c1917] border border-slate-200 dark:border-white/10 rounded-xl p-4 hover:border-[#de5c1b]/30 hover:shadow-lg hover:shadow-[#de5c1b]/5 transition-all group cursor-pointer group">
                                    <div className={`w-10 h-10 rounded-lg bg-${folder.color}-50 dark:bg-${folder.color}-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-5 h-5 text-${folder.color}-500`} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{folder.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{folder.count} Items • {folder.size}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* --- Recent Documents --- */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">All Documents</h2>
                    <div className="bg-white dark:bg-[#1c1917] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-500">Document Name</th>
                                        <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                                        <th className="px-6 py-4 font-bold text-slate-500">Expires</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {filteredDocs.map(doc => (
                                        <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#de5c1b] transition-colors">{doc.name}</p>
                                                        <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(doc.status)}`}>
                                                    {doc.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                                {doc.expiryDate}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" title="View">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" title="Download">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDocs.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                                No documents found matching "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Vault;
