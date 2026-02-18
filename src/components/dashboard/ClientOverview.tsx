import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ClientOverview = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeBookings, setActiveBookings] = useState<any[]>([]);
    const [pastBookings, setPastBookings] = useState<any[]>([]);

    useEffect(() => {
        const fetchClientData = async () => {
            if (!user) return;

            try {
                // Fetch bookings where this user is the client
                // Note: We need to filter by client_id. 
                // Assuming 'bookings' table has a 'client_id' field that matches the user's ID
                // OR we might need to look up if there's a specific client profile link.
                // For now, let's assume direct mapping or we query by email if needed, 
                // but ID is safest if the system links Auth ID to Client ID.

                // If Auth ID != Client ID in 'clients' table, we might need a lookup.
                // But typically in this app, a "User" is a "Profile".
                // Let's check if 'bookings' has 'client_id' = user.id

                const { data: bookings, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        booking_datetime,
                        status,
                        service:services (
                            name,
                            price,
                            duration
                        ),
                        organization:organizations (
                            business_name
                        )
                    `)
                    .eq('client_id', user.id) // This assumes the user.id IS the client_id
                    .order('booking_datetime', { ascending: false });

                if (error) {
                    // If permissions fail, it might be because of RLS or ID mismatch.
                    // For MVP, we will assume it works or handle empty.
                    console.error('Error fetching bookings:', error);
                }

                if (bookings) {
                    const now = new Date();
                    const active = bookings.filter((b: any) => new Date(b.booking_datetime) >= now && b.status !== 'cancelled');
                    const past = bookings.filter((b: any) => new Date(b.booking_datetime) < now || b.status === 'cancelled');

                    setActiveBookings(active);
                    setPastBookings(past);
                }

            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [user]);

    if (loading) {
        return <div className="text-slate-400 p-8">Loading your dashboard...</div>;
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Welcome back, {user?.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage your appointments and find local businesses.
                    </p>
                </div>
                <Link
                    to="/my-bookings"
                    className="px-6 py-2.5 bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white rounded-xl font-medium transition-all shadow-lg shadow-[#de5c1b]/20 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    Book New Service
                </Link>
            </motion.div>

            {/* Active Bookings Section */}
            <section>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#de5c1b]">calendar_month</span>
                    Upcoming Appointments
                </h2>

                {activeBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeBookings.map(booking => (
                            <div key={booking.id} className="bg-[#2c2420]/50 border border-white/5 rounded-2xl p-5 hover:border-[#de5c1b]/30 transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-[#de5c1b]/10 text-[#de5c1b] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                        {booking.status}
                                    </div>
                                    <span className="text-slate-400 text-sm font-medium">
                                        {new Date(booking.booking_datetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-1">{booking.service?.name}</h3>
                                <p className="text-slate-400 text-sm flex items-center gap-1 mb-4">
                                    <span className="material-symbols-outlined text-sm">store</span>
                                    {booking.organization?.name || 'Service Provider'}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-slate-300 border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[#de5c1b] text-lg">schedule</span>
                                        {new Date(booking.booking_datetime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[#de5c1b] text-lg">payments</span>
                                        ${booking.service?.price}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#1c1917] border border-white/5 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-slate-500">event_busy</span>
                        </div>
                        <h3 className="text-white font-medium mb-1">No upcoming appointments</h3>
                        <p className="text-slate-500 text-sm mb-6">You don't have any scheduled services at the moment.</p>
                        <Link to="/my-bookings" className="text-[#de5c1b] hover:text-[#de5c1b]/80 font-medium text-sm">
                            View Bookings History &rarr;
                        </Link>
                    </div>
                )}
            </section>

            {/* Recent History Section */}
            {pastBookings.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-500">history</span>
                        Recent History
                    </h2>
                    <div className="bg-[#1c1917] border border-white/5 rounded-2xl overflow-hidden">
                        {pastBookings.slice(0, 3).map((booking, index) => (
                            <div key={booking.id} className={`p-4 flex items-center justify-between ${index !== pastBookings.length - 1 ? 'border-b border-white/5' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-400">check_circle</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">{booking.service?.name}</h4>
                                        <p className="text-slate-500 text-sm">{booking.organization?.name} • {new Date(booking.booking_datetime).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-white font-medium">${booking.service?.price}</span>
                                    <span className="text-xs text-slate-500 uppercase">{booking.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Actions / Explore */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#de5c1b]/20 to-[#1c1917] border border-[#de5c1b]/20 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-[#de5c1b]/40 transition-all">
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-4xl text-[#de5c1b] mb-4">search</span>
                        <h3 className="text-xl font-bold text-white mb-2">Find Local Businesses</h3>
                        <p className="text-slate-300 text-sm mb-0">Discover top-rated services near you and book instantly.</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-1/4 translate-y-1/4">
                        <span className="material-symbols-outlined text-9xl text-[#de5c1b]">storefront</span>
                    </div>
                </div>

                <div className="bg-[#1c1917] border border-white/5 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-white/10 transition-all">
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-4 group-hover:text-white transition-colors">account_circle</span>
                        <h3 className="text-xl font-bold text-white mb-2">Update Profile</h3>
                        <p className="text-slate-400 text-sm mb-0">Keep your contact info and preferences up to date.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClientOverview;
