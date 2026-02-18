import { useState, useEffect } from 'react';
import {
    Menu,
    Contact,
    UserPlus,
    Search,
    ChevronRight,
    History,
    StickyNote,
    PlusCircle,
    Plus,
    X,
    Sparkles,
    Shield,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useVault } from '../../contexts/VaultContext';

// Define Client interface here since we removed the mock file import
interface Client {
    id: string;
    name: string;
    initials: string;
    contactInfo: {
        email: string;
        phone: string;
    };
    status: string;
    loyaltyTier: string;
    avatarColor: string;
    stats: {
        totalSpend: number;
        visitCount: number;
        lastVisit: string;
    };
    aiInsights: string[];
    privateNotes: string;
    preferences: {
        likes: string[];
        dislikes: string[];
    };
    history: any[];
}

const Clients = () => {
    const { industry } = useVault();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [userRole, setUserRole] = useState<'Manager' | 'Associate'>('Manager');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const { user } = useAuth(); // Get user from context

    // Load clients from Supabase
    useEffect(() => {
        const fetchClients = async () => {
            if (!user) return;

            try {
                // Get Org ID
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    setLoading(false);
                    return;
                }

                // Explicitly cast or handle the type safely
                const profileData = profile as any;
                if (!profileData?.organization_id) {
                    setLoading(false);
                    return;
                }
                const orgId = profileData.organization_id;

                // Fetch Clients with Bookings
                const { data: clientData, error } = await supabase
                    .from('clients')
                    .select(`
                        id, 
                        name, 
                        email, 
                        phone, 
                        status, 
                        created_at,
                        bookings (
                            id,
                            booking_datetime,
                            service:services (price)
                        )
                    `)
                    .eq('organization_id', orgId);

                if (error) throw error;

                const mappedClients: Client[] = clientData.map((c: any) => {
                    // Calculate Stats
                    const bookings = c.bookings || [];
                    const visitCount = bookings.length;
                    const totalSpend = bookings.reduce((sum: number, b: any) => sum + (b.service?.price || 0), 0);

                    // Find last visit
                    const sortedBookings = [...bookings].sort((a: any, b: any) =>
                        new Date(b.booking_datetime).getTime() - new Date(a.booking_datetime).getTime()
                    );
                    const lastVisit = sortedBookings.length > 0 ? sortedBookings[0].booking_datetime : c.created_at;

                    // Determine Loyalty Tier (Simple Logic)
                    let loyaltyTier = 'New';
                    if (visitCount > 10 || totalSpend > 1000) loyaltyTier = 'VIP';
                    else if (visitCount > 3) loyaltyTier = 'Regular';

                    return {
                        id: c.id,
                        name: c.name || 'Unknown Client',
                        initials: c.name ? c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??',
                        contactInfo: {
                            email: c.email || 'N/A',
                            phone: c.phone || 'N/A'
                        },
                        status: c.status || 'Active',
                        loyaltyTier,
                        avatarColor: 'bg-emerald-100 text-emerald-600',
                        stats: {
                            totalSpend,
                            visitCount,
                            lastVisit
                        },
                        aiInsights: [],
                        privateNotes: '',
                        preferences: { likes: [], dislikes: [] },
                        history: sortedBookings.map((b: any) => ({
                            id: b.id,
                            date: b.booking_datetime,
                            serviceName: b.service?.name || 'Service',
                            price: b.service?.price || 0,
                            technician: 'Staff' // Placeholder
                        }))
                    };
                });

                setClients(mappedClients);

            } catch (err) {
                console.error('Error fetching clients:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [user, industry]); // Re-fetch if user changes (industry dep kept for effect consistency if needed later)

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#151210]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#de5c1b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading clients...</p>
                </div>
            </div>
        );
    }

    // Filter Logic
    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'Top Spenders') return client.stats.totalSpend > 1000;
        if (activeFilter === 'At Risk') return client.status === 'At Risk';
        if (activeFilter === 'VIP Members') return client.loyaltyTier === 'VIP';

        return true;
    });

    // Dynamic Labels based on Industry
    const getIndustryLabels = () => {
        switch (industry) {
            case 'Healthcare': return { client: 'Patient', visit: 'Appointment', spend: 'Billable' };
            case 'Construction': return { client: 'Client', visit: 'Site Visit', spend: 'Project Value' };
            case 'Security': return { client: 'Site', visit: 'Patrol', spend: 'Contract' };
            case 'Logistics': return { client: 'Account', visit: 'Delivery', spend: 'Freight' };
            default: return { client: 'Client', visit: 'Visit', spend: 'Spend' };
        }
    };
    const labels = getIndustryLabels();

    return (
        <div className="bg-white dark:bg-[#211611] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col font-display relative overflow-hidden">
            {/* Top Header */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#211611]/80 backdrop-blur-md border-b border-[#de5c1b]/10 px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button className="text-[#de5c1b] hover:bg-[#de5c1b]/10 p-1 rounded-lg transition-colors">
                            <Menu className="w-8 h-8" />
                        </button>
                        <Contact className="text-[#de5c1b] w-8 h-8" />
                        <h1 className="text-xl font-bold tracking-tight">Rolodex: {industry}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Role Toggle for Demo */}
                        <button
                            onClick={() => setUserRole(prev => prev === 'Manager' ? 'Associate' : 'Manager')}
                            className="bg-[#de5c1b]/10 text-[#de5c1b] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#de5c1b]/20 hover:bg-[#de5c1b]/20 transition-colors"
                        >
                            View: {userRole}
                        </button>
                        <button className="bg-[#de5c1b] text-white p-2 rounded-lg flex items-center justify-center hover:bg-[#de5c1b]/90 transition-colors">
                            <UserPlus className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#de5c1b]/60 w-5 h-5" />
                    <input
                        className="w-full bg-[#de5c1b]/5 border border-[#de5c1b]/20 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#de5c1b] focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                        placeholder={`Search ${labels.client.toLowerCase()}s by name...`}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Filter Pills */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
                    {['All', 'Top Spenders', 'At Risk', 'VIP Members'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeFilter === filter
                                ? 'bg-[#de5c1b] text-white'
                                : 'bg-[#de5c1b]/10 text-[#de5c1b] border border-[#de5c1b]/20 hover:bg-[#de5c1b]/20'
                                }`}
                        >
                            {filter === 'All' ? `All ${labels.client}s` : filter}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content: Client List */}
            <main className="flex-1 overflow-y-auto px-4 py-2 space-y-3 pb-24">
                {filteredClients.map((client) => (
                    <div
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className="relative group overflow-hidden rounded-xl bg-white dark:bg-[#2a1d17] border border-[#de5c1b]/5 shadow-sm hover:border-[#de5c1b]/30 transition-all cursor-pointer active:scale-[0.99]"
                    >
                        <div className="p-4 flex items-center gap-4">
                            <div className={`h-14 w-14 rounded-xl flex items-center justify-center border-2 border-[#de5c1b]/20 font-bold text-xl ${client.avatarColor}`}>
                                {client.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-base truncate flex items-center gap-2">
                                        {client.name}
                                        {client.status === 'At Risk' && (
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                        )}
                                    </h3>
                                    {userRole === 'Manager' && (
                                        <span className="text-[#de5c1b] font-bold text-sm">${client.stats.totalSpend.toLocaleString()}</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Last {labels.visit}: {new Date(client.stats.lastVisit).toLocaleDateString()}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${client.loyaltyTier === 'VIP' ? 'bg-yellow-500/10 text-yellow-600' :
                                        client.loyaltyTier === 'New' ? 'bg-green-500/10 text-green-600' :
                                            'bg-[#de5c1b]/10 text-[#de5c1b]'
                                        }`}>
                                        {client.loyaltyTier}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-400 w-5 h-5 group-hover:text-[#de5c1b] transition-colors" />
                        </div>
                    </div>
                ))}
            </main>

            {/* Floating Action Button */}
            <button className="fixed right-6 bg-[#de5c1b] text-white size-14 rounded-xl shadow-lg shadow-[#de5c1b]/40 flex items-center justify-center z-10 active:scale-95 transition-transform bottom-6">
                <Plus className="w-8 h-8" />
            </button>

            {/* Client Detail Panel (Slide-Over) */}
            {selectedClient && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
                        onClick={() => setSelectedClient(null)}
                    />

                    {/* Panel */}
                    <div className="fixed inset-y-0 right-0 z-40 w-full md:w-[480px] bg-white dark:bg-[#211611] shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out border-l border-[#de5c1b]/10">
                        {/* Panel Header */}
                        <div className="sticky top-0 bg-white/90 dark:bg-[#211611]/90 backdrop-blur-md z-10 px-6 py-4 border-b border-[#de5c1b]/10 flex items-center justify-between">
                            <h2 className="text-lg font-bold">{labels.client} Profile</h2>
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="p-2 hover:bg-[#de5c1b]/10 rounded-full text-gray-500 hover:text-[#de5c1b] transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="p-6 space-y-8">
                            {/* Profile Card */}
                            <div className="flex flex-col items-center text-center">
                                <div className={`h-28 w-28 rounded-full border-4 border-[#de5c1b] flex items-center justify-center font-bold text-4xl mb-4 ${selectedClient.avatarColor}`}>
                                    {selectedClient.initials}
                                </div>
                                <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedClient.contactInfo.email}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedClient.contactInfo.phone}</p>

                                {userRole === 'Manager' && (
                                    <div className="mt-6 flex gap-4 w-full">
                                        <div className="flex-1 bg-[#de5c1b]/5 rounded-xl p-3 border border-[#de5c1b]/10">
                                            <span className="block text-xs uppercase text-gray-500 font-bold">Total {labels.spend}</span>
                                            <span className="block text-xl font-black text-[#de5c1b]">${selectedClient.stats.totalSpend.toLocaleString()}</span>
                                        </div>
                                        <div className="flex-1 bg-[#de5c1b]/5 rounded-xl p-3 border border-[#de5c1b]/10">
                                            <span className="block text-xs uppercase text-gray-500 font-bold">{labels.visit}s</span>
                                            <span className="block text-xl font-black text-[#de5c1b]">{selectedClient.stats.visitCount}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Smart Insights (AI Mock) */}
                            <div className="bg-gradient-to-br from-[#de5c1b]/10 to-transparent rounded-2xl p-6 border border-[#de5c1b]/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles className="w-24 h-24 text-[#de5c1b]" />
                                </div>
                                <h3 className="flex items-center gap-2 font-bold text-[#de5c1b] mb-4">
                                    <Sparkles className="w-5 h-5" />
                                    Smart Insights
                                </h3>
                                <ul className="space-y-3 relative z-10">
                                    {selectedClient.aiInsights.map((insight, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#de5c1b] flex-shrink-0" />
                                            {insight}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Private Notes (Manager Only) */}
                            {userRole === 'Manager' && (
                                <section>
                                    <h4 className="font-bold text-sm flex items-center gap-2 mb-3 text-gray-900 dark:text-gray-100">
                                        <Shield className="text-[#de5c1b] w-5 h-5" />
                                        Private Manager Notes
                                    </h4>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 italic">
                                        "{selectedClient.privateNotes}"
                                    </div>
                                </section>
                            )}

                            {/* Preferences (Associate & Manager) */}
                            <section>
                                <h4 className="font-bold text-sm flex items-center gap-2 mb-3 text-gray-900 dark:text-gray-100">
                                    <StickyNote className="text-[#de5c1b] w-5 h-5" />
                                    Preferences
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Likes:</span>
                                        {selectedClient.preferences.likes.map(like => (
                                            <span key={like} className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                                                {like}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Dislikes:</span>
                                        {selectedClient.preferences.dislikes.map(dislike => (
                                            <span key={dislike} className="px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
                                                {dislike}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Service History */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-sm flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                        <History className="text-[#de5c1b] w-5 h-5" />
                                        Journey Timeline
                                    </h4>
                                    <button className="text-[#de5c1b] text-xs font-bold hover:underline">View All</button>
                                </div>
                                <div className="space-y-6 border-l-2 border-[#de5c1b]/20 ml-2 pl-6 py-2">
                                    {selectedClient.history.map((item) => (
                                        <div key={item.id} className="relative">
                                            <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-[#211611] bg-[#de5c1b]" />
                                            <p className="text-xs font-bold text-gray-400 mb-0.5">{new Date(item.date).toLocaleDateString()}</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.serviceName}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs text-gray-500">Tech: {item.technician}</p>
                                                {userRole === 'Manager' && (
                                                    <p className="text-xs text-[#de5c1b] font-bold">${item.price}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Quick Actions */}
                            <div className="sticky bottom-0 bg-white dark:bg-[#211611] pt-4 pb-2 border-t border-[#de5c1b]/10 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#de5c1b]/20 bg-[#de5c1b]/5 text-[#de5c1b] font-bold text-sm hover:bg-[#de5c1b]/10 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    Message
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#de5c1b] text-white font-bold text-sm hover:bg-[#de5c1b]/90 transition-colors shadow-lg shadow-[#de5c1b]/20">
                                    <PlusCircle className="w-4 h-4" />
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default Clients;
