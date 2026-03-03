
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../../components/dashboard/schedule/EventCard';
import type { Event } from '../../types/schedule';
import { useSidebar } from '../../contexts/SidebarContext';
import { Menu, Calendar, Clock, History, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const MyBookings = () => {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'schedule'>('upcoming');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchMyBookings = async () => {
            if (!user) return;

            try {
                let bookingsQuery;
                if (user.tier === 'Free') {
                    // Client View: Find client record(s) matching their email
                    const { data: clientData, error: clientError } = await supabase
                        .from('clients')
                        .select('id')
                        .eq('email', user.email);

                    if (clientError) throw clientError;

                    if (!clientData || clientData.length === 0) {
                        setEvents([]);
                        setLoading(false);
                        return;
                    }

                    const clientIds = clientData.map(c => c.id);

                    const { data, error } = await supabase
                        .from('bookings')
                        .select(`
                            id,
                            booking_datetime,
                            status,
                            notes,
                            service:services(name, duration)
                        `)
                        .in('client_id', clientIds)
                        .order('booking_datetime', { ascending: activeTab === 'upcoming' });

                    if (error) throw error;
                    bookingsQuery = data;
                } else {
                    // Provider View
                    const { data, error } = await supabase
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
                    bookingsQuery = data;
                }

                const mappedEvents: Event[] = bookingsQuery?.map((b: any) => {
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
    const scheduleEvents = events.filter(e => {
        return e.date.getFullYear() === selectedDate.getFullYear() &&
            e.date.getMonth() === selectedDate.getMonth() &&
            e.date.getDate() === selectedDate.getDate();
    });

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(selectedDate);
        d.setDate(selectedDate.getDate() + i - 3); // Center around selectedDate
        return d;
    });

    const displayEvents = activeTab === 'upcoming' ? upcomingEvents : activeTab === 'past' ? pastEvents : scheduleEvents;

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
                <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl mb-8 w-fit border border-slate-200 dark:border-white/10 overflow-x-auto hide-scrollbar">
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
                        onClick={() => setActiveTab('schedule')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'schedule'
                            ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        <CalendarDays className="w-4 h-4" />
                        My Schedule
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

                {/* Event List */}
                {/* Event List or Schedule */}
                {activeTab === 'schedule' ? (
                    <div className="space-y-6">
                        {/* Date Picker */}
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                <ChevronLeft className="w-5 h-5 text-slate-500" />
                            </button>
                            <div className="flex gap-2 overflow-x-auto custom-scrollbar px-2">
                                {weekDays.map((date, index) => {
                                    const isSelected = isSameDay(date, selectedDate);
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-14 rounded-xl cursor-pointer transition-all ${isSelected
                                                ? 'bg-[#de5c1b] text-white shadow-lg shadow-[#de5c1b]/30 scale-105'
                                                : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                            <span className="text-sm font-bold">{date.getDate()}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                <ChevronRight className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Timeline View */}
                        <div className="overflow-x-auto pb-4">
                            <div className="min-w-[800px]">
                                {/* Time Header */}
                                <div className="grid grid-cols-[1fr] gap-4 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">
                                    <div className="grid grid-cols-12 text-center">
                                        {['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'].map(t => (
                                            <div key={t} className="text-xs font-bold text-slate-400">{t}</div>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline Bar */}
                                <div className="relative h-20 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                    {/* Render Grid Lines */}
                                    <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="border-r border-slate-200/50 dark:border-white/5 h-full"></div>
                                        ))}
                                    </div>

                                    {/* Render Events */}
                                    {displayEvents.map(event => {
                                        const [startH, startM] = event.startTime.split(':').map(Number);
                                        const [endH, endM] = event.endTime.split(':').map(Number);
                                        const startMinsTotal = startH * 60 + startM;
                                        const endMinsTotal = endH * 60 + endM;
                                        const durationMins = endMinsTotal - startMinsTotal;

                                        // offset from 8AM (480 mins)
                                        const offsetMins = startMinsTotal - 480;
                                        const leftPercent = Math.max(0, (offsetMins / (12 * 60)) * 100);
                                        const widthPercent = Math.min(100 - leftPercent, (durationMins / (12 * 60)) * 100);

                                        if (startMinsTotal >= 20 * 60 || endMinsTotal <= 8 * 60) return null; // Outside visible 8am-8pm

                                        return (
                                            <div
                                                key={event.id}
                                                className={`absolute top-2 bottom-2 rounded-lg px-3 py-1 flex flex-col justify-center shadow-sm transition-all hover:brightness-110 z-10 ${event.type === 'Shift' ? 'bg-indigo-500 text-white' :
                                                    event.type === 'Strategy' ? 'bg-[#de5c1b] text-white' :
                                                        event.type === 'TimeOff' ? 'bg-slate-400 text-white' :
                                                            'bg-emerald-500 text-white'
                                                    }`}
                                                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                                            >
                                                <span className="text-xs font-bold truncate leading-tight">{event.title}</span>
                                                <span className="text-[10px] font-medium opacity-90 truncate leading-tight">{event.startTime} - {event.endTime}</span>
                                            </div>
                                        );
                                    })}

                                    {displayEvents.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-sm font-medium text-slate-400 italic">No schedules for selected date</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
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
                )}
            </main>
        </div>
    );
};

export default MyBookings;
