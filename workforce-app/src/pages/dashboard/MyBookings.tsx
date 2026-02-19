
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../../components/dashboard/schedule/EventCard';
import type { Event } from '../../types/schedule';
import { useSidebar } from '../../contexts/SidebarContext';
import { Menu, Calendar, Clock, History } from 'lucide-react';

const MyBookings = () => {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchMyBookings = async () => {
            if (!user) return;

            try {
                const { data: bookings, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        booking_datetime,
                        status,
                        notes,
                        service:services(name, duration)
                    `)
                    .eq('employee_id', user.id)
                    .order('booking_datetime', { ascending: activeTab === 'upcoming' });

                if (error) throw error;

                const mappedEvents: Event[] = bookings?.map((b: any) => {
                    const startTime = new Date(b.booking_datetime);
                    // Duration logic matching Schedule.tsx
                    const noteDurationMatch = b.notes ? b.notes.match(/\[Duration:(\d+)\]/) : null;
                    const durationFromNotes = noteDurationMatch ? parseInt(noteDurationMatch[1]) : null;
                    const durationMinutes = durationFromNotes || b.service?.duration || 60;
                    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

                    // Determine duration string
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
            } catch (err) {
                console.error('Error fetching my bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();
    }, [user, activeTab]);

    // Filter events based on tab (client-side filtering as secondary check or primary if we fetch all)
    // Actually, asking DB is better for pagination, but for now we fetched all matching activeTab criteria loosely?
    // Wait, the query above fetches ALL bookings for the user. I should filter them by date in JS or refine query.
    // Let's refine the query in useEffect or filter here.
    // Since I ordered them based on tab, I probably want to split them by date relative to NOW.

    // Improved Logic: Fetch all, then filter.
    const now = new Date();
    const upcomingEvents = events.filter(e => e.date >= now);
    const pastEvents = events.filter(e => e.date < now).reverse(); // Most recent past first

    const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#181311]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#de5c1b]"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#181311] min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-display">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#181311]/80 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors lg:hidden">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Personal Schedule</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl mb-8 w-fit border border-slate-200 dark:border-white/10">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming'
                                ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'past'
                                ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        History
                    </button>
                </div>

                {/* Event List */}
                <div className="space-y-4">
                    {displayEvents.length > 0 ? (
                        displayEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onSwapRequest={() => { }} // No-op for now
                                onEdit={() => { }} // No-op for now
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                            <Clock className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No {activeTab} bookings found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyBookings;
