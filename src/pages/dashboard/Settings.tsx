

import {
    Menu,
    Bell,
    Mail,
    Landmark,
    CreditCard,
    ChevronRight,
    PlusCircle,
    Sun,
    Moon,
    Monitor,
    Fingerprint,
    ShieldCheck,
    Palette,
    Upload,
    Type,
    Briefcase,
    Plus,
    Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBranding } from '../../contexts/BrandingContext';
import { useVault } from '../../contexts/VaultContext';
import { useState } from 'react';

const Settings = () => {
    const { user, updateRole, updateTier } = useAuth();
    const { companyName, setCompanyName, logoUrl, setLogoUrl, primaryColor, setPrimaryColor, resetBranding } = useBranding();
    const { industry, updateIndustry, customCategories, addCategory, deleteCategory } = useVault();

    // Local state for new category
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState('blue');

    const handleAddCategory = () => {
        if (newCatName.trim()) {
            addCategory({
                name: newCatName,
                color: newCatColor,
                icon: 'Folder' // Default icon
            });
            setNewCatName('');
        }
    };
    return (
        <div className="bg-[#f8f6f6] dark:bg-[#211611] font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#f8f6f6]/80 dark:bg-[#211611]/80 backdrop-blur-md border-b border-[#de5c1b]/10 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="text-gray-500 hover:text-[#de5c1b] transition-colors"><Menu className="w-6 h-6" /></button>
                    <h1 className="text-xl font-bold tracking-tight">ENGINE ROOM</h1>
                </div>
                <button className="bg-[#de5c1b]/10 text-[#de5c1b] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Syncing
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Section: Notifications */}
                <section className="mt-6">
                    <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">Notification Controls</h2>
                    <div className="bg-white/5 dark:bg-white/5 mx-4 rounded-xl overflow-hidden border border-white/10 dark:border-white/10 border-gray-200">
                        {/* Push Notifications */}
                        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-transparent">
                            <div className="bg-[#de5c1b]/20 p-2 rounded-lg text-[#de5c1b]">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Push Notifications</p>
                                <p className="text-xs text-gray-500">Real-time alerts for all activities</p>
                            </div>
                            <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full bg-gray-600 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#de5c1b]">
                                <div className="h-full w-[20px] rounded-full bg-white shadow-sm"></div>
                                <input defaultChecked className="hidden" type="checkbox" />
                            </label>
                        </div>
                        {/* Email Alerts */}
                        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-transparent">
                            <div className="bg-[#de5c1b]/20 p-2 rounded-lg text-[#de5c1b]">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Email Summaries</p>
                                <p className="text-xs text-gray-500">Daily reports of your finances</p>
                            </div>
                            <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full bg-gray-600 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#de5c1b]">
                                <div className="h-full w-[20px] rounded-full bg-white shadow-sm"></div>
                                <input className="hidden" type="checkbox" />
                            </label>
                        </div>
                        {/* Alert Volume Slider */}
                        <div className="px-4 py-4 bg-white dark:bg-transparent">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium">Alert Volume</p>
                                <span className="text-xs text-[#de5c1b] font-mono">75%</span>
                            </div>
                            <div className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div className="absolute top-0 left-0 h-full bg-[#de5c1b] rounded-full" style={{ width: '75%' }}></div>
                                <div className="absolute top-1/2 -translate-y-1/2 left-[75%] h-4 w-4 bg-white rounded-full border-2 border-[#de5c1b] shadow-lg cursor-pointer"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Financial Linking */}
                <section className="mt-8">
                    <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">Financial Linking</h2>
                    <div className="bg-white/5 dark:bg-white/5 mx-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent">
                        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 dark:border-white/5">
                            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                                <Landmark className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Global Commerce Bank</p>
                                <p className="text-xs text-gray-500">Connected: Main Checking</p>
                            </div>
                            <ChevronRight className="text-gray-500 w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 dark:border-white/5">
                            <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Titanium Card</p>
                                <p className="text-xs text-gray-500">Connected: Credit Line</p>
                            </div>
                            <ChevronRight className="text-gray-500 w-5 h-5" />
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-[#de5c1b] hover:bg-[#de5c1b]/5 transition-colors">
                            <PlusCircle className="w-5 h-5" />
                            Add New Institution
                        </button>
                    </div>
                </section>

                {/* Section: Appearance */}
                <section className="mt-8">
                    <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">App Theme</h2>
                    <div className="px-4 grid grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-white/10 border-2 border-transparent p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:border-[#de5c1b]/50 transition-all shadow-sm">
                            <Sun className="text-gray-400 w-8 h-8" />
                            <span className="text-xs font-medium">Light</span>
                        </div>
                        <div className="bg-white/5 dark:bg-[#de5c1b]/20 border-2 border-[#de5c1b] p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all shadow-sm">
                            <Moon className="text-[#de5c1b] w-8 h-8" />
                            <span className="text-xs font-bold text-[#de5c1b]">Dark</span>
                        </div>
                        <div className="bg-white dark:bg-white/10 border-2 border-transparent p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:border-[#de5c1b]/50 transition-all shadow-sm">
                            <Monitor className="text-gray-400 w-8 h-8" />
                            <span className="text-xs font-medium">System</span>
                        </div>
                    </div>
                </section>

                {/* Section: Security */}
                <section className="mt-8">
                    <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">Security & Data</h2>
                    <div className="bg-white/5 dark:bg-white/5 mx-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent">
                        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 dark:border-white/5">
                            <div className="bg-gray-500/20 p-2 rounded-lg text-gray-400">
                                <Fingerprint className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Biometric Login</p>
                            </div>
                            <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full bg-gray-600 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#de5c1b]">
                                <div className="h-full w-[20px] rounded-full bg-white shadow-sm"></div>
                                <input defaultChecked className="hidden" type="checkbox" />
                            </label>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-4">
                            <div className="bg-gray-500/20 p-2 rounded-lg text-gray-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Privacy Settings</p>
                            </div>
                            <ChevronRight className="text-gray-500 w-5 h-5" />
                        </div>
                    </div>
                </section>

                {/* Section: Branding Studio */}
                <section className="mt-8">
                    <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">Branding Studio</h2>
                    <div className="bg-white/5 dark:bg-white/5 mx-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-4 space-y-4">
                        {/* Company Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Name</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                    placeholder="Enter company name"
                                />
                            </div>
                        </div>

                        {/* Brand Color */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand Color</label>
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white dark:border-[#211611] shadow-sm">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-code">{primaryColor}</p>
                                    <p className="text-xs text-gray-500">Click circle to pick a new color</p>
                                </div>
                                <Palette className="text-gray-400 w-5 h-5" />
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center border border-dashed border-slate-300 dark:border-white/20 overflow-hidden">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-gray-400 font-bold">No Logo</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="cursor-pointer bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-block">
                                        <Upload className="w-4 h-4 inline mr-2" />
                                        Upload New Logo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setLogoUrl(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px PNG</p>
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                            <button
                                onClick={resetBranding}
                                className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
                            >
                                Reset to Default
                            </button>
                        </div>
                    </div>
                </section>

                {/* Section: Industry & Compliance */}
                <section className="mt-8">
                    <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">Industry & Compliance</h2>
                    <div className="bg-white/5 dark:bg-white/5 mx-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-4 space-y-6">
                        {/* Industry Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Primary Industry</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={industry}
                                    onChange={(e) => updateIndustry(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#de5c1b] outline-none appearance-none"
                                >
                                    <option value="General">General Business</option>
                                    <option value="Security">Security & Protection</option>
                                    <option value="Healthcare">Healthcare & Medical</option>
                                    <option value="Construction">Construction & Trades</option>
                                    <option value="Logistics">Logistics & Transport</option>
                                    <option value="Hospitality">Hospitality & Food Service</option>
                                </select>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">
                                * Sets the AI context for compliance requirements.
                            </p>
                        </div>

                        {/* Custom Categories */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Document Categories</label>
                            <div className="space-y-2 mb-4">
                                {customCategories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full bg-${cat.color}-500`}></div>
                                            <span className="text-sm font-bold">{cat.name}</span>
                                        </div>
                                        <button
                                            onClick={() => deleteCategory(cat.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Category */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    placeholder="New Category Name..."
                                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                />
                                <select
                                    value={newCatColor}
                                    onChange={(e) => setNewCatColor(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                >
                                    <option value="blue">Blue</option>
                                    <option value="orange">Orange</option>
                                    <option value="emerald">Green</option>
                                    <option value="purple">Purple</option>
                                    <option value="red">Red</option>
                                    <option value="cyan">Cyan</option>
                                </select>
                                <button
                                    onClick={handleAddCategory}
                                    disabled={!newCatName.trim()}
                                    className="bg-[#de5c1b] text-white p-2 rounded-lg hover:bg-[#de5c1b]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Developer Controls (Demo) */}
                <section className="mt-8">
                    <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">Developer Controls (Demo)</h2>
                    <div className="bg-white/5 dark:bg-white/5 mx-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-4 space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Current Role</label>
                            <div className="flex gap-2">
                                {['Owner', 'Manager', 'Associate'].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => updateRole(r as any)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${user?.role === r
                                            ? 'bg-[#de5c1b] text-white border-[#de5c1b]'
                                            : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Current Tier</label>
                            <div className="flex gap-2">
                                {['Free', 'Solo', 'Business'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => updateTier(t as any)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${user?.tier === t
                                            ? 'bg-[#de5c1b] text-white border-[#de5c1b]'
                                            : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <div className="mt-12 px-4 flex flex-col gap-3">
                    <button className="bg-[#de5c1b] text-white w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#de5c1b]/20 active:scale-[0.98] transition-transform">
                        Save All Changes
                    </button>
                    <button className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm text-red-500/70 border border-red-500/20 active:bg-red-500/10 transition-colors">
                        Log Out
                    </button>
                    <p className="text-center text-[10px] text-gray-600 mt-4 mb-8">
                        ENGINE_ROOM v4.2.0-STABLE<br />
                        BUILD_ID: 0x992F_X2
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Settings;
