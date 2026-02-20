


import {
    Menu,
    Settings,
    Cpu,
    Link,
    Copy,
    ChevronDown,
    Globe,
    Share2,
    Save,
    Star,
    Sparkles,
    Plus,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import type { Database } from '../../types/supabase';

type ProfileData = Database['public']['Tables']['profiles']['Row'];
type OrganizationData = Database['public']['Tables']['organizations']['Row'];
type ReviewData = Database['public']['Tables']['ratings_reviews']['Row'] & {
    client?: { name: string } | null;
};

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'portfolio'>('overview');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    // Form State
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [organization, setOrganization] = useState<OrganizationData | null>(null);
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

    // Editable Fields
    const [fullName, setFullName] = useState('');
    const [businessBio, setBusinessBio] = useState('');
    const [industry, setIndustry] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [socialHandle, setSocialHandle] = useState('');
    const [orgName, setOrgName] = useState('');

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user?.id]);

    const fetchData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            // Fetch Profile
            const { data, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;
            const profileData = data as ProfileData;
            setProfile(profileData);

            // Set initial values from profile or defaults
            setFullName(profileData.name || '');
            setBusinessBio(profileData.bio || '');

            if (profileData.organization_id) {
                const { data: orgDataRes, error: orgError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('id', profileData.organization_id)
                    .single();

                if (orgError) throw orgError;
                const orgData = orgDataRes as OrganizationData;
                setOrganization(orgData);
                setOrgName(orgData.business_name || '');

                // Extract settings from JSONb
                const settings = (orgData.settings as any) || {};
                const onboarding = (orgData.onboarding_data as any) || {};

                setIndustry(onboarding.industry || settings.industry || 'Heavy Infrastructure');
                setLocation(onboarding.location || settings.location || 'Austin, TX');
                setWebsite(settings.website || 'industrialresilience.com');
                setSocialHandle(settings.social_handle || '@industrial_phoenix');

                // Portfolio Images (from settings)
                if (settings.portfolio_images && Array.isArray(settings.portfolio_images)) {
                    setPortfolioImages(settings.portfolio_images);
                } else {
                    setPortfolioImages([]);
                }

                // Fetch Reviews
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('ratings_reviews')
                    .select(`
                        *,
                        client:clients (name)
                    `)
                    .eq('organization_id', profileData.organization_id)
                    .order('created_at', { ascending: false });

                if (reviewsError) throw reviewsError;
                setReviews(reviewsData || []);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            showToast('Failed to fetch profile data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user?.id || !profile) return;
        setSaving(true);
        try {
            // Update Profile
            const { error: profileUpdateError } = await (supabase as any)
                .from('profiles')
                .update({
                    name: fullName,
                    bio: businessBio,
                })
                .eq('id', user.id);

            if (profileUpdateError) throw profileUpdateError;

            // Update Organization if exists
            if (organization) {
                const currentSettings = (organization.settings as any) || {};
                const currentOnboarding = (organization.onboarding_data as any) || {};

                const { error: orgUpdateError } = await (supabase as any)
                    .from('organizations')
                    .update({
                        business_name: orgName,
                        settings: {
                            ...currentSettings,
                            website,
                            social_handle: socialHandle,
                            location // storing location in settings for now if table doesn't have it
                        },
                        onboarding_data: {
                            ...currentOnboarding,
                            industry,
                            location
                        }
                    })
                    .eq('id', organization.id);

                if (orgUpdateError) throw orgUpdateError;
            }

            // Show success feedback

            showToast('Profile updated successfully', 'success');
            await fetchData(); // Refresh data

        } catch (error: any) {
            console.error('Error updating profile:', error);
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f6f6] dark:bg-[#211611]">
                <Loader2 className="w-8 h-8 text-[#de5c1b] animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#f8f6f6] dark:bg-[#211611] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
            {/* Top Navigation */}
            <header className="flex items-center bg-[#f8f6f6] dark:bg-[#211611] p-4 border-b border-[#de5c1b]/10 justify-between sticky top-0 z-50">
                <div className="text-[#de5c1b] flex size-10 items-center justify-center cursor-pointer">
                    <Menu className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Identity</h2>
                <div className="flex w-10 items-center justify-end">
                    <button className="text-[#de5c1b]">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                {/* Brand Header Section */}
                <div className="relative py-12 px-4 flex flex-col items-center border-b border-[#de5c1b]/20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #2a1d17 0%, #211611 100%)' }}>
                    {/* Background Abstract Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"></path>
                                </pattern>
                            </defs>
                            <rect fill="url(#grid)" height="100%" width="100%"></rect>
                        </svg>
                    </div>
                    {/* Mechanical Phoenix Logo (Stylized) */}
                    <div className="relative mb-6">
                        <div className="absolute -inset-4 bg-[#de5c1b]/20 rounded-full blur-2xl"></div>
                        <div className="relative bg-[#211611] border-2 border-[#de5c1b] size-24 rounded-full flex items-center justify-center" style={{ textShadow: '0 0 15px rgba(222, 92, 27, 0.4)' }}>
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <Cpu className="text-[#de5c1b] w-14 h-14" />
                            )}
                        </div>
                    </div>
                    <div className="text-center z-10">
                        <h1 className="text-2xl font-bold font-display tracking-tight text-white px-2">
                            {user?.tier === 'Free' ? (profile?.name || user?.name) : (orgName || profile?.name || 'Your Organization')}
                        </h1>
                        {user?.tier !== 'Free' && (
                            <>
                                <p className="text-[#de5c1b] font-medium">{socialHandle || '@username'}</p>
                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-[#de5c1b]/10 border border-[#de5c1b]/30 rounded-full text-xs font-bold text-[#de5c1b] uppercase tracking-widest">
                                    Est. {organization?.created_at ? new Date(organization.created_at).getFullYear() : '2024'}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Public Booking Link (Featured CTA) */}
                {user?.tier !== 'Free' && (
                    <section className="p-4">
                        <div className="bg-[#de5c1b] p-4 rounded-xl flex items-center justify-between shadow-lg shadow-[#de5c1b]/20">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg text-white">
                                    <Link className="w-6 h-6" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Public Booking Link</p>
                                    <p
                                        data-org-id={organization?.id}
                                        className="text-white font-semibold truncate max-w-[150px] sm:max-w-xs cursor-pointer hover:underline"
                                        title="Click to test link"
                                        onClick={() => window.open(`/booking/${organization?.id || user?.id}`, '_blank')}
                                    >
                                        {organization?.id ? `.../booking/${organization.id.slice(0, 8)}...` : 'Generate Link...'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    const url = `${window.location.origin}/booking/${organization?.id || user?.id}`;
                                    try {
                                        await navigator.clipboard.writeText(url);
                                        showToast('Copied to clipboard!', 'success');
                                    } catch (err) {
                                        showToast('Failed to copy to clipboard', 'error');
                                    }
                                }}
                                className="bg-white text-[#de5c1b] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform shrink-0"
                            >
                                <Copy className="w-4 h-4" />
                                Copy
                            </button>
                        </div>
                    </section>
                )}


                {/* Navigation Tabs */}
                {user?.tier !== 'Free' && (
                    <div className="flex items-center justify-center border-b border-[#de5c1b]/10 bg-white dark:bg-[#211611] sticky top-[73px] z-40">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'overview' ? 'border-[#de5c1b] text-[#de5c1b]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-[#de5c1b] text-[#de5c1b]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'portfolio' ? 'border-[#de5c1b] text-[#de5c1b]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Portfolio
                        </button>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white dark:bg-[#2a1d17] p-6 rounded-2xl shadow-sm border border-[#de5c1b]/5 space-y-4">
                                <h3 className="text-sm font-bold text-[#de5c1b] uppercase tracking-widest mb-4">
                                    {user?.tier === 'Free' ? 'Personal Information' : 'Business Identity'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                                        <input
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-[#de5c1b]/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white font-medium"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>

                                    {user?.tier !== 'Free' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Organization Name</label>
                                            <input
                                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-[#de5c1b]/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white font-medium"
                                                type="text"
                                                value={orgName}
                                                onChange={(e) => setOrgName(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{user?.tier === 'Free' ? 'About Me' : 'Business Bio'}</label>
                                        <textarea
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-[#de5c1b]/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white min-h-[100px] resize-none font-medium"
                                            value={businessBio}
                                            onChange={(e) => setBusinessBio(e.target.value)}
                                        ></textarea>
                                    </div>

                                    {user?.tier !== 'Free' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Industry</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-[#de5c1b]/20 rounded-xl py-3 px-4 appearance-none focus:ring-2 focus:ring-[#de5c1b] outline-none dark:text-white font-medium"
                                                        value={industry}
                                                        onChange={(e) => setIndustry(e.target.value)}
                                                    >
                                                        <option>Heavy Infrastructure</option>
                                                        <option>Tech & Software</option>
                                                        <option>Consulting</option>
                                                        <option>Construction</option>
                                                        <option>Security</option>
                                                        <option>Other</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Location</label>
                                                <input
                                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-[#de5c1b]/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white font-medium"
                                                    type="text"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {user?.tier !== 'Free' && (
                                <div className="bg-white dark:bg-[#2a1d17] p-6 rounded-2xl shadow-sm border border-[#de5c1b]/5 space-y-4">
                                    <h3 className="text-sm font-bold text-[#de5c1b] uppercase tracking-widest mb-4">Contact & Social</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#de5c1b]/10 p-2.5 rounded-lg text-[#de5c1b]">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <input
                                                className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 focus:border-[#de5c1b] outline-none dark:text-white font-medium"
                                                type="text"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#de5c1b]/10 p-2.5 rounded-lg text-[#de5c1b]">
                                                <Share2 className="w-5 h-5" />
                                            </div>
                                            <input
                                                className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 focus:border-[#de5c1b] outline-none dark:text-white font-medium"
                                                type="text"
                                                value={socialHandle}
                                                onChange={(e) => setSocialHandle(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#de5c1b]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Summary Card - Real Data Calculation */}
                            <div className="bg-gradient-to-br from-[#de5c1b] to-[#b84309] rounded-2xl p-6 text-white shadow-lg shadow-[#de5c1b]/20 flex items-center justify-between">
                                <div>
                                    <h3 className="text-4xl font-bold mb-1">
                                        {reviews.length > 0
                                            ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
                                            : '0.0'}
                                    </h3>
                                    <div className="flex items-center gap-1 text-white/90 mb-2">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className="text-sm font-medium text-white/80">Based on {reviews.length} reviews</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="font-bold text-sm">Top Rated</span>
                                    </div>
                                    <p className="text-xs text-white/70 max-w-[150px]">You're in the top 5% of businesses in your area!</p>
                                </div>
                            </div>

                            {/* Review List */}
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white dark:bg-[#2a1d17] p-5 rounded-2xl shadow-sm border border-[#de5c1b]/5 hover:border-[#de5c1b]/20 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#de5c1b] font-bold text-lg`}>
                                                    {(review.client?.name || 'Client').charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{review.client?.name || 'Verified Client'}</h4>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded-lg">
                                                <Star className="w-3.5 h-3.5 fill-[#de5c1b] text-[#de5c1b]" />
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {review.rating ? review.rating.toFixed(1) : '5.0'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                            "{review.comment || review.testimonial_text}"
                                        </p>
                                    </div>
                                ))}
                                {reviews.length === 0 && (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                        <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-500">No reviews yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PORTFOLIO TAB */}
                    {activeTab === 'portfolio' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg dark:text-white">Portfolio Gallery</h3>
                                <button
                                    onClick={async () => {
                                        const url = prompt('Enter Image URL:');
                                        if (url && organization) {
                                            const newImages = [...portfolioImages, url];
                                            setPortfolioImages(newImages);
                                            // Save immediately to settings
                                            const currentSettings = (organization.settings as any) || {};
                                            await (supabase as any).from('organizations').update({
                                                settings: { ...currentSettings, portfolio_images: newImages }
                                            }).eq('id', organization.id);
                                        }
                                    }}
                                    className="flex items-center gap-2 text-[#de5c1b] font-bold text-sm bg-[#de5c1b]/10 px-4 py-2 rounded-lg hover:bg-[#de5c1b]/20 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Add Photo
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {portfolioImages.map((img, idx) => (
                                    <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                                        <img src={img} alt="Portfolio" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                                                <Share2 className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {portfolioImages.length === 0 && (
                                    <div className="col-span-2 text-center py-10 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                        <p className="text-slate-500">No photos added yet.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-[#de5c1b]/5 rounded-2xl border border-[#de5c1b]/10 text-center">
                                <p className="text-sm text-slate-500 mb-3">Want to showcase more?</p>
                                <button className="text-[#de5c1b] font-bold text-sm hover:underline">Connect Instagram Feed</button>
                            </div>
                        </div>
                    )}

                </main>
            </main>
        </div>
    );
};

export default Profile;
