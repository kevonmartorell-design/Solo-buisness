import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useSidebar } from '../../contexts/SidebarContext';
import { useVault } from '../../contexts/VaultContext';
import type { VaultItem } from '../../types/vault';
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
    Eye,
    Trash2,
    X
} from 'lucide-react';

const iconMap = {
    Shield,
    FileText,
    CheckCircle,
    Folder,
    AlertTriangle
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

const getDaysUntilExpiry = (dateString: string) => {
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const Vault = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useSidebar();
    const { documents, addDocument, deleteDocument, getExpiringDocuments, customCategories } = useVault();
    const [activeFilter, setActiveFilter] = useState<'All' | string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Upload State
    const [uploadName, setUploadName] = useState('');
    const [uploadType, setUploadType] = useState<VaultItem['type']>('License');
    const [uploadCategory, setUploadCategory] = useState<string>('Licenses');
    const [uploadExpiry, setUploadExpiry] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter Logic
    const filteredDocs = documents.filter(doc => {
        const matchesFilter = activeFilter === 'All' || doc.category === activeFilter;
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const expiringDocs = getExpiringDocuments();

    // Calculate Folder Counts
    const folders = customCategories.map(cat => ({
        ...cat,
        icon: iconMap[cat.icon as keyof typeof iconMap] || Folder,
        count: documents.filter(d => d.category === cat.name).length
    }));

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }
            setSelectedFile(file);
            setUploadName(file.name.split('.')[0]); // Auto-fill name
        }
    };

    const handleUpload = () => {
        if (!selectedFile || !uploadName || !uploadExpiry) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;

            addDocument({
                name: uploadName,
                type: uploadType,
                category: uploadCategory,
                expiryDate: uploadExpiry,
                status: 'Pending', // Will be recalculated by context
                fileData: base64String,
                fileName: selectedFile.name,
                fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
            });

            // Reset
            setIsUploadModalOpen(false);
            setUploadName('');
            setUploadExpiry('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsDataURL(selectedFile);
    };

    return (
        <div className="bg-slate-50 dark:bg-[#151210] min-h-screen text-slate-900 dark:text-slate-100 font-display flex flex-col relative">

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
                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#de5c1b]/20 transition-all flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" /> Upload
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full space-y-8 pb-24">

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
                        <button
                            onClick={() => setActiveFilter('All')}
                            className={clsx(
                                "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                                activeFilter === 'All'
                                    ? "bg-[#de5c1b] text-white border-[#de5c1b]"
                                    : "bg-white dark:bg-[#1c1917] text-slate-500 border-slate-200 dark:border-white/10 hover:border-[#de5c1b]/50"
                            )}
                        >
                            All
                        </button>
                        {customCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.name)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                                    activeFilter === cat.name
                                        ? "bg-[#de5c1b] text-white border-[#de5c1b]"
                                        : "bg-white dark:bg-[#1c1917] text-slate-500 border-slate-200 dark:border-white/10 hover:border-[#de5c1b]/50"
                                )}
                            >
                                {cat.name}
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
                        {folders.map(folder => {
                            const Icon = folder.icon;
                            return (
                                <div key={folder.id}
                                    onClick={() => setActiveFilter(folder.name)}
                                    className={clsx(
                                        "bg-white dark:bg-[#1c1917] border rounded-xl p-4 hover:shadow-lg transition-all group cursor-pointer group relative overflow-hidden",
                                        activeFilter === folder.name
                                            ? "border-[#de5c1b] ring-1 ring-[#de5c1b]"
                                            : "border-slate-200 dark:border-white/10 hover:border-[#de5c1b]/30"
                                    )}
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-${folder.color}-50 dark:bg-${folder.color}-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-5 h-5 text-${folder.color}-500`} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{folder.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{folder.count} Items</p>
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
                                                        <p className="text-xs text-slate-500">{doc.type} • {doc.fileSize || 'N/A'}</p>
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
                                                    <button
                                                        onClick={() => deleteDocument(doc.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#211611] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#de5c1b]/10 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Upload className="w-5 h-5 text-[#de5c1b]" />
                                Upload Document
                            </h3>
                            <button onClick={() => setIsUploadModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* File Drop Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-[#de5c1b] hover:text-[#de5c1b] hover:bg-[#de5c1b]/5 transition-all cursor-pointer group"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                {selectedFile ? (
                                    <>
                                        <CheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
                                        <p className="font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                                        <p className="text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="font-bold">Click to Upload File</p>
                                        <p className="text-xs opacity-70">PDF, JPG, or PNG (Max 5MB)</p>
                                    </>
                                )}
                            </div>

                            {/* Metadata Form */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Document Name</label>
                                    <input
                                        type="text"
                                        value={uploadName}
                                        onChange={(e) => setUploadName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                        placeholder="e.g. Drivers License"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Type</label>
                                        <select
                                            value={uploadType}
                                            onChange={(e) => setUploadType(e.target.value as any)}
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                        >
                                            <option value="License">License</option>
                                            <option value="ID">ID</option>
                                            <option value="Certificate">Certificate</option>
                                            <option value="Training">Training</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                                        <select
                                            value={uploadCategory}
                                            onChange={(e) => setUploadCategory(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                        >
                                            {customCategories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={uploadExpiry}
                                        onChange={(e) => setUploadExpiry(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || !uploadName || !uploadExpiry}
                                className="w-full bg-[#de5c1b] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#de5c1b]/20 hover:bg-[#de5c1b]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Save to Vault
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vault;
