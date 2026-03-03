import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user || !user.email) return;

            try {
                // Fetch bookings linked to the user's email or client_id if we have one
                // For simplicity, we search the appointments table where client_email matches user email (if such thing exists)
                // Or if we linked it properly. Let's fetch from public schema 

                // Assuming we have an appointments table with client_email or client_id
                const { data, error } = await supabase
                    .from('appointments')
                    .select('*, org:orgs(name), employee:employees(name), service:services(name)')
                    .eq('client_email', user.email || '')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setBookings(data || []);
            } catch (err: any) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#181311] text-white">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#181311] font-display text-white">
            <header className="bg-[#251f1d] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Client Portal</h1>
                    <p className="text-sm text-white/50">Welcome back, {user?.name || user?.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </header>

            <main className="max-w-4xl mx-auto p-6 mt-8">
                <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>

                {bookings.length === 0 ? (
                    <div className="bg-[#251f1d] border border-white/10 rounded-2xl p-8 text-center text-white/50">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>You have no current appointment requests.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-[#251f1d] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{booking.service?.name || 'Service'}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm tracking-wide text-white/60 mt-2">
                                        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                                            <Calendar className="size-4" />
                                            {booking.appointment_date}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                                            <Clock className="size-4" />
                                            {booking.appointment_time}
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/50 mt-3">With {booking.employee?.name || 'Staff'}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                                        booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500' :
                                            'bg-red-500/20 text-red-500'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ClientDashboard;
