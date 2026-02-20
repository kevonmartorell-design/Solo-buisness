
import {
    Menu, Bell, Mail, Landmark, CreditCard, ChevronRight, PlusCircle,
    Sun, Moon, Monitor, Fingerprint, ShieldCheck, Palette, Upload,
    Type, Briefcase, Plus, Trash2, Globe, Smartphone, Server, FileText,
    Users, Download, ToggleRight, Power, Shield, Zap, Star
} from 'lucide-react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useBranding } from '../../contexts/BrandingContext';
import { useVault } from '../../contexts/VaultContext';
import { useState } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import Billing from '../../components/dashboard/settings/Billing';
import TierUpgradeModal from '../../components/dashboard/settings/TierUpgradeModal';
import type { Tier } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
// import type { Database } from '../../types/supabase';


const Settings = () => {
    const { user, updateRole, updateTier, logout } = useAuth();
    const {
        companyName, setCompanyName,
        logoUrl, setLogoUrl,
        primaryColor, setPrimaryColor,
        secondaryColor, setSecondaryColor,
        font, setFont,
        customDomain, setCustomDomain,
        smtpSettings, setSmtpSettings,
        smsSenderId, setSmsSenderId,
        showPoweredBy, setShowPoweredBy,
        theme, setTheme,
        resetBranding,
        saveBranding
    } = useBranding();
    const sb = supabase as SupabaseClient<any, "public", any>;
    const { industry, updateIndustry, customCategories, addCategory, deleteCategory } = useVault();

    // Local state for new category
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState('blue');
    const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'branding' | 'security'>('general');

    // Sidebar
    const { toggleSidebar } = useSidebar();

    // Tier Upgrade Modal State
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [pendingTier, setPendingTier] = useState<Tier | null>(null);

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

    const handleExportClients = async () => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            const { data: profileData } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', currentUser.id)
                .single();

            const profile = profileData as { organization_id: string } | null;

            if (!profile?.organization_id) return;

            const { data: clients, error } = await sb
                .from('clients')
                .select('*')
                .eq('organization_id', profile.organization_id);

            if (error) throw error;
            if (!clients || clients.length === 0) {
                toast.error('No clients to export.');
                return;
            }

            // Generate CSV
            const headers = ['Name', 'Email', 'Phone', 'Address', 'Join Date'];
            const rows = clients.map((c: any) => [
                c.name || 'N/A',
                c.contact_info?.email || 'N/A',
                c.contact_info?.phone || 'N/A',
                c.contact_info?.address || 'N/A',
                new Date(c.created_at).toLocaleDateString()
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map((r: string[]) => r.map((field: string) => `"${field}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error exporting clients:', err);
            toast.error('Failed to export clients.');
        }
    };

    const handleTierChange = (newTier: Tier) => {
        if (!user || user.tier === newTier) return;
        setPendingTier(newTier);
        setIsTierModalOpen(true);
    };

    const confirmTierChange = async (newTier: Tier) => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            const { data: profileData } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', currentUser.id)
                .single();

            const profile = profileData as { organization_id: string } | null;

            if (profile?.organization_id) {
                const { error } = await sb
                    .from('organizations')
                    .update({ tier: newTier.toLowerCase() } as any) // Casting as any for update payload if strict check fails
                    .eq('id', profile.organization_id);

                if (error) throw error;

                updateTier(newTier);
                setIsTierModalOpen(false);
                setPendingTier(null);
            }
        } catch (err) {
            console.error('Error updating tier:', err);
            toast.error('Failed to update tier. Please try again.');
        }
    };
    return (
        <div className="bg-[#f8f6f6] dark:bg-[#211611] font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#f8f6f6]/80 dark:bg-[#211611]/80 backdrop-blur-md border-b border-[#de5c1b]/10 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 hover:text-[#de5c1b] transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
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

                {/* Section: Subscription & Billing */}
                {/* Section: Subscription & Billing */}
                <section className="mt-8">
                    <div className="flex items-center justify-between px-6 mb-2">
                        <h2 className="text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em]">Subscription & Billing</h2>
                        {user?.tier !== 'Free' && (
                            <button
                                onClick={() => setActiveTab(activeTab === 'billing' ? 'general' : 'billing')}
                                className="text-[10px] font-bold text-[#de5c1b] uppercase hover:underline"
                            >
                                {activeTab === 'billing' ? 'Back to Settings' : 'Details'}
                            </button>
                        )}
                    </div>

                    <div className="mx-4">
                        {activeTab === 'billing' ? (
                            <Billing />
                        ) : (
                            <div className="bg-white/5 dark:bg-white/5 rounded-xl overflow-hidden border border-white/10 dark:border-white/10 border-gray-200">
                                <div className="p-4 bg-white dark:bg-transparent">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Current Plan</p>
                                            <p className="text-xs text-gray-500">Manage your subscription tier</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user?.tier === 'Business' ? 'bg-[#de5c1b]/20 text-[#de5c1b]' :
                                                user?.tier === 'Solo' ? 'bg-blue-500/20 text-blue-500' :
                                                    'bg-gray-500/20 text-gray-500'
                                                }`}>
                                                {user?.tier || 'Free'}
                                            </span>
                                            {user?.tier !== 'Free' && (
                                                <button
                                                    onClick={() => setActiveTab('billing')}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            {
                                                name: 'Free',
                                                price: '$0',
                                                description: 'Essentials',
                                                icon: Shield,
                                                color: 'text-gray-400'
                                            },
                                            {
                                                name: 'Solo',
                                                price: '$40',
                                                description: 'Professional',
                                                icon: Zap,
                                                color: 'text-blue-500'
                                            },
                                            {
                                                name: 'Business',
                                                price: '$70',
                                                description: 'Enterprise',
                                                icon: Star,
                                                color: 'text-[#de5c1b]'
                                            }
                                        ].map((plan) => (
                                            <button
                                                key={plan.name}
                                                onClick={() => handleTierChange(plan.name as any)}
                                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all relative overflow-hidden group ${user?.tier === plan.name
                                                    ? 'border-[#de5c1b] bg-[#de5c1b]/5 shadow-sm ring-4 ring-[#de5c1b]/5'
                                                    : 'border-gray-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:border-[#de5c1b]/30'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg bg-white dark:bg-[#1c1917] shadow-sm ${plan.color}`}>
                                                    <plan.icon className="w-5 h-5" />
                                                </div>
                                                <div className="text-center">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest block ${user?.tier === plan.name ? 'text-[#de5c1b]' : 'text-gray-400'}`}>
                                                        {plan.name}
                                                    </span>
                                                    <span className="text-xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                                                </div>
                                                {user?.tier === plan.name && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#de5c1b] animate-pulse" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {user?.tier !== 'Free' && (
                                        <button
                                            onClick={() => setActiveTab('billing')}
                                            className="w-full mt-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-gray-200 dark:shadow-none hover:scale-[1.01] active:scale-[0.98] transition-all"
                                        >
                                            Manage Payment & Billing
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
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
                        <div
                            onClick={() => setTheme('light')}
                            className={`p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all shadow-sm border-2 ${theme === 'light' ? 'bg-[#de5c1b]/10 border-[#de5c1b]' : 'bg-white dark:bg-white/10 border-transparent hover:border-[#de5c1b]/50'}`}
                        >
                            <Sun className={`w-8 h-8 ${theme === 'light' ? 'text-[#de5c1b]' : 'text-gray-400'}`} />
                            <span className={`text-xs ${theme === 'light' ? 'font-bold text-[#de5c1b]' : 'font-medium'}`}>Light</span>
                        </div>
                        <div
                            onClick={() => {
                                if (user?.tier === 'Free') {
                                    handleTierChange('Solo');
                                } else {
                                    setTheme('dark');
                                }
                            }}
                            className={`p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all shadow-sm border-2 relative ${theme === 'dark' ? 'bg-[#de5c1b]/10 border-[#de5c1b]' : 'bg-white dark:bg-white/10 border-transparent hover:border-[#de5c1b]/50'}`}
                        >
                            <Moon className={`w-8 h-8 ${theme === 'dark' ? 'text-[#de5c1b]' : 'text-gray-400'}`} />
                            <span className={`text-xs ${theme === 'dark' ? 'font-bold text-[#de5c1b]' : 'font-medium'}`}>Dark</span>
                            {user?.tier === 'Free' && (
                                <Star className="absolute top-1 right-1 w-3 h-3 text-[#de5c1b]" />
                            )}
                        </div>
                        <div
                            onClick={() => {
                                if (user?.tier === 'Free') {
                                    handleTierChange('Solo');
                                } else {
                                    setTheme('system');
                                }
                            }}
                            className={`p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all shadow-sm border-2 relative ${theme === 'system' ? 'bg-[#de5c1b]/10 border-[#de5c1b]' : 'bg-white dark:bg-white/10 border-transparent hover:border-[#de5c1b]/50'}`}
                        >
                            <Monitor className={`w-8 h-8 ${theme === 'system' ? 'text-[#de5c1b]' : 'text-gray-400'}`} />
                            <span className={`text-xs ${theme === 'system' ? 'font-bold text-[#de5c1b]' : 'font-medium'}`}>System</span>
                            {user?.tier === 'Free' && (
                                <Star className="absolute top-1 right-1 w-3 h-3 text-[#de5c1b]" />
                            )}
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
                {user?.tier === 'Business' && (
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


                            {/* Secondary Brand Color */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Secondary Color</label>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white dark:border-[#211611] shadow-sm">
                                        <input
                                            type="color"
                                            value={secondaryColor}
                                            onChange={(e) => setSecondaryColor(e.target.value)}
                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-code">{secondaryColor}</p>
                                        <p className="text-xs text-gray-500">Accents & Backgrounds</p>
                                    </div>
                                    <Palette className="text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            {/* Font Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Typography</label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={font}
                                        onChange={(e) => setFont(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#de5c1b] outline-none appearance-none"
                                    >
                                        <option value="Inter">Inter (Modern)</option>
                                        <option value="Roboto">Roboto (Clean)</option>
                                        <option value="Outfit">Outfit (Geometric)</option>
                                        <option value="Playfair Display">Playfair Display (Serif)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Custom Domain */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custom Domain</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={customDomain}
                                        onChange={(e) => setCustomDomain(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                        placeholder="app.yourbusiness.com"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Requires DNS verification.</p>
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
                )}

                {/* Section: Branded Communication */}
                {user?.tier === 'Business' && (
                    <section className="mt-8">
                        <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">Branded Communication</h2>
                        <div className="bg-white/5 dark:bg-white/5 mx-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-4 space-y-4">
                            {/* SMTP Settings */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Custom SMTP (Email)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={smtpSettings.host}
                                        onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                                        placeholder="SMTP Host (e.g. smtp.gmail.com)"
                                        className="px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs"
                                    />
                                    <input
                                        type="text"
                                        value={smtpSettings.port}
                                        onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
                                        placeholder="Port (e.g. 587)"
                                        className="px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs"
                                    />
                                    <input
                                        type="text"
                                        value={smtpSettings.user}
                                        onChange={(e) => setSmtpSettings({ ...smtpSettings, user: e.target.value })}
                                        placeholder="Username"
                                        className="px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs"
                                    />
                                    <input
                                        type="password"
                                        value={smtpSettings.pass}
                                        onChange={(e) => setSmtpSettings({ ...smtpSettings, pass: e.target.value })}
                                        placeholder="Password"
                                        className="px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs"
                                    />
                                </div>
                            </div>

                            {/* SMS Sender ID */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                    <Smartphone className="w-3 h-3" /> SMS Sender ID
                                </label>
                                <input
                                    type="text"
                                    value={smsSenderId}
                                    onChange={(e) => setSmsSenderId(e.target.value)}
                                    placeholder="e.g. MyBiz (Max 11 chars)"
                                    maxLength={11}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm"
                                />
                            </div>

                            {/* Powered By Toggle */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <Power className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Show "Powered by"</p>
                                        <p className="text-xs text-gray-500">Remove WorkForce branding from footer.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPoweredBy(!showPoweredBy)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showPoweredBy ? 'bg-[#de5c1b]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPoweredBy ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </section>
                )}

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

                        {/* Custom Terms of Service */}
                        <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Custom Terms of Service
                            </label>
                            <textarea
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs h-24 focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                placeholder="Paste your custom legal terms here for employees to sign..."
                            />
                        </div>
                    </div>
                </section>

                {/* Section: Administrative Controls */}
                <section className="mt-8">
                    <h2 className="px-6 text-[10px] font-bold text-[#de5c1b] uppercase tracking-[0.2em] mb-2">Administrative Controls</h2>
                    <div className="bg-white/5 dark:bg-white/5 mx-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-4 space-y-4">

                        {/* Role Mapping Mockup */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Users className="w-3 h-3" /> Role Mapping
                                </label>
                                <button className="text-[10px] text-[#de5c1b] font-bold hover:underline">Manage Roles</button>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 text-xs text-gray-500">
                                <div className="flex items-center justify-between mb-1">
                                    <span>Store Manager</span>
                                    <span className="text-emerald-500 font-bold">Full Access</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Associate</span>
                                    <span className="text-amber-500 font-bold">Restricted</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature Toggles */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <Server className="w-3 h-3" /> Feature Toggles
                            </label>
                            <div className="space-y-2">
                                {['Services Tab', 'Client AI Analysis', 'Advanced Analytics'].map(feature => (
                                    <div key={feature} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg">
                                        <span className="text-sm font-medium">{feature}</span>
                                        <button className="text-[#de5c1b]"><ToggleRight className="w-6 h-6" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Data Export */}
                        <div className="pt-2">
                            <button
                                onClick={handleExportClients}
                                className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <Download className="w-4 h-4" /> Export Client Database (CSV)
                            </button>
                        </div>

                        {/* Dev Controls (Hidden but accessible for demo) */}
                        <details className="pt-4 border-t border-slate-100 dark:border-white/5">
                            <summary className="text-[10px] font-bold text-gray-400 uppercase cursor-pointer hover:text-[#de5c1b] transition-colors">Dev Overrides</summary>
                            <div className="mt-4 space-y-4">
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
                        </details>
                    </div>
                </section>

                <div className="mt-12 px-4 flex flex-col gap-3">
                    <button
                        onClick={async () => {
                            if (window.confirm('Save all branding and settings changes?')) {
                                const success = await saveBranding();
                                if (success) {
                                    alert('Settings saved successfully!');
                                } else {
                                    alert('Failed to save settings. Please try again.');
                                }
                            }
                        }}
                        className="bg-[#de5c1b] text-white w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#de5c1b]/20 active:scale-[0.98] transition-transform"
                    >
                        Save All Changes
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to log out?')) {
                                logout();
                            }
                        }}
                        className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm text-red-500/70 border border-red-500/20 active:bg-red-500/10 transition-colors"
                    >
                        Log Out
                    </button>
                    <p className="text-center text-[10px] text-gray-600 mt-4 mb-8">
                        ENGINE_ROOM v4.2.0-STABLE<br />
                        BUILD_ID: 0x992F_X2
                    </p>
                </div>
            </main>

            {/* Tier Upgrade Modal */}
            {pendingTier && (
                <TierUpgradeModal
                    isOpen={isTierModalOpen}
                    onClose={() => {
                        setIsTierModalOpen(false);
                        setPendingTier(null);
                    }}
                    onConfirm={confirmTierChange}
                    currentTier={user?.tier || 'Free'}
                    targetTier={pendingTier}
                />
            )}
        </div>
    );
};

export default Settings;
