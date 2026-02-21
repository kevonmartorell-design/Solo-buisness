import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../../components/dashboard/schedule/EventCard';
import type { Event } from '../../types/schedule';
import { useSidebar } from '../../contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Calendar, Clock, History, Link as LinkIcon, Check, X, Inbox, CalendarPlus } from 'lucide-react';
import CreateBookingModal from '../../components/dashboard/schedule/CreateBookingModal';

const MyBookings = () => {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'requests'>('upcoming');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [events, setEvents] = useState<Event[]>([]);
    const [requests, setRequests] = useState<any[]>([]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Fetch Bookings
            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    id,
                    booking_datetime,
                    status,
                    notes,
                    service:services(name, duration)
                `)
                .eq('employee_id', user.id)
                .order('booking_datetime', { ascending: true });

            if (bookingsError) throw bookingsError;

            const mappedEvents: Event[] = bookings?.map((b: any) => {
                const startTime = new Date(b.booking_datetime);
                const noteDurationMatch = b.notes ? b.notes.match(/\[Duration:(\d+)\]/) : null;
                const durationFromNotes = noteDurationMatch ? parseInt(noteDurationMatch[1]) : null;
                const durationMinutes = durationFromNotes || b.service?.duration || 60;
                const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

                const hours = Math.floor(durationMinutes / 60);
                const mins = durationMinutes % 60;
                let durationStr = `${mins}m`;
                if (hours > 0 && mins > 0) durationStr = `${hours}h ${mins}m`;
                else if (hours > 0) durationStr = `${hours}h`;

                return {
                    id: b.id,
                    title: b.service?.name || 'Untitled Booking',
                    type: 'Shift',
                    startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    duration: durationStr,
                    date: startTime,
                    status: b.status,
                    resourceId: user.id,
                    notes: b.notes
                };
            }) || [];

            setEvents(mappedEvents);

            // 2. Fetch Pending Requests
            const { data: appointmentRequests, error: requestsError } = await supabase
                .from('appointment_requests')
                .select(`
                    id,
                    organization_id,
                    client_id,
                    requested_datetime,
                    notes,
                    status,
                    client:clients(id, name, email, phone),
                    service:services(id, name, duration)
                `)
                .eq('employee_id', user.id)
                .eq('status', 'requested')
                .order('requested_datetime', { ascending: true });

            if (requestsError) throw requestsError;
            setRequests(appointmentRequests || []);

        } catch (err) {
            console.error('Error fetching data:', err);
            toast.error('Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleCopyLink = () => {
        if (!user) return;
        const link = `${window.location.origin}/book/${user.id}`;
        navigator.clipboard.writeText(link);
        toast.success('Personal Booking Link copied!');
    };

    const handleApprove = async (req: any) => {
        if (!user) return;
        setActionLoading(req.id);

        try {
            const { error: rpcError } = await (supabase.rpc as any)('approve_appointment_request', { p_request_id: req.id });

            if (rpcError) throw rpcError;

            

            // Notify client if they have a phone number
            if (req.client?.phone) {
                await supabase.functions.invoke('notify-client', {
                    body: {
                        phone: req.client.phone,
                        clientName: req.client.name,
                        employeeName: (user as any)?.user_metadata?.full_name || 'your provider',
                        status: 'approved',
                        dateTime: req.requested_datetime,
                        serviceName: req.service?.name
                    }
                });
            }

            toast.success('Request Approved!');
            fetchData();
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to approve request.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeny = async (req: any) => {
        setActionLoading(req.id);
        try {
            const { error } = await (supabase as any)
                .from('appointment_requests')
                .update({ status: 'cancelled' })
                .eq('id', req.id);

            if (error) throw error;

            if (req.client?.phone) {
                await supabase.functions.invoke('notify-client', {
                    body: {
                        phone: req.client.phone,
                        clientName: req.client.name,
                        employeeName: (user as any)?.user_metadata?.full_name || 'your provider',
                        status: 'denied',
                        dateTime: req.requested_datetime,
                        serviceName: req.service?.name
                    }
                });
            }

            toast.success('Request Denied.');
            setRequests(requests.filter(r => r.id !== req.id));
        } catch (err) {
            console.error(err);
            toast.error('Failed to deny request.');
        } finally {
            setActionLoading(null);
        }
    };

    const now = new Date();
    const upcomingEvents = events.filter(e => e.date >= now);
    const pastEvents = events.filter(e => e.date < now).reverse();

    return (
        <div className="bg-white dark:bg-[#181311] min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-display">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#181311]/80 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors lg:hidden">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Personal Schedule</p>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-4 py-2 bg-[#de5c1b]/10 text-[#de5c1b] hover:bg-[#de5c1b]/20 rounded-xl text-sm font-bold transition-colors"
                        >
                            <LinkIcon className="w-4 h-4" />
                            <span>Copy Booking Link</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                {/* Tabs */}
                <div className="flex overflow-x-auto p-1 bg-slate-100 dark:bg-white/5 rounded-xl mb-8 w-fit border border-slate-200 dark:border-white/10 hide-scrollbar">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'upcoming'
                            ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'requests'
                            ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        <Inbox className="w-4 h-4" />
                        Requests
                        {requests.length > 0 && (
                            <span className="ml-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                {requests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'past'
                            ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        History
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#de5c1b]"></div>
                    </div>
                ) : activeTab === 'requests' ? (
                    /* Requests Tab Content */
                    <div className="space-y-4">
                        {requests.length > 0 ? (
                            requests.map(req => (
                                <div key={req.id} className="bg-white dark:bg-[#251f1d] border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold">{req.client?.name || 'Unknown Client'}</h3>
                                                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                                    Pending
                                                </span>
                                            </div>
                                            <p className="text-[#de5c1b] font-medium mb-1">{req.service?.name}</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(req.requested_datetime).toLocaleDateString()} at {new Date(req.requested_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>

                                            {(req.client?.email || req.client?.phone) && (
                                                <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 p-3 rounded-xl mb-4">
                                                    {req.client?.email && <div>Email: {req.client.email}</div>}
                                                    {req.client?.phone && <div>Phone: {req.client.phone}</div>}
                                                </div>
                                            )}

                                            {req.notes && (
                                                <div className="text-sm text-slate-600 dark:text-slate-300 italic flex gap-2">
                                                    <span className="font-bold shrink-0">Notes:</span>
                                                    <span>{req.notes}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                                            <button
                                                onClick={() => handleApprove(req)}
                                                disabled={actionLoading === req.id}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleDeny(req)}
                                                disabled={actionLoading === req.id}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4" /> Deny
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                                <Inbox className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-1">No pending requests</h3>
                                <p className="text-slate-500 dark:text-slate-400">When clients book through your link, they'll appear here.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Upcoming/Past Events */
                    <div className="space-y-4">
                        {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length > 0 ? (
                            (activeTab === 'upcoming' ? upcomingEvents : pastEvents).map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onSwapRequest={() => toast.success('Swap requests coming soon!', { icon: '🚧' })}
                                    onEdit={() => toast.success('Shift editing coming soon!', { icon: '🚧' })}
                                />
                            ))
                        ) : (
                            <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                                <Clock className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-1">No {activeTab} bookings</h3>
                                <p className="text-slate-500 dark:text-slate-400">Share your booking link to get listed.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Floating Action Button - New Booking */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 bg-[#de5c1b] hover:bg-[#c4501a] text-white font-bold rounded-2xl shadow-lg shadow-[#de5c1b]/40 transition-all active:scale-95"
            >
                <CalendarPlus className="w-5 h-5" />
                New Booking
            </button>

            <CreateBookingModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                employeeId={user?.id || ''}
                onSuccess={() => {
                    fetchData();
                }}
            />
        </div>
    );
};

export default MyBookings;


