
import { useState, useEffect } from 'react';
import {
    Menu,
    Plus,
    X,
    AlertCircle,
    Check,
    Users,
    Calendar as CalendarIcon,
    Briefcase
} from 'lucide-react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import BookingModal from '../../components/dashboard/schedule/BookingModal';
import EventCard from '../../components/dashboard/schedule/EventCard';
import type { Resource, Event } from '../../types/schedule';

// --- Constants ---

// --- Helpers ---

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const calculateDuration = (start: string, end: string) => {
    const startMins = timeToMinutes(start);
    const endMins = timeToMinutes(end);
    const diff = endMins - startMins;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
};

const Schedule = () => {
    const sb = supabase as SupabaseClient<any, "public", any>;
    const { toggleSidebar } = useSidebar();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'agenda' | 'resource'>('agenda');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [filterDept, setFilterDept] = useState('All');
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    // Feedback Toast Helper
    const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
        setFeedbackMessage(message); // Could extend to handle type for styling
        setTimeout(() => setFeedbackMessage(null), 3000);
    };

    // --- Data Fetching ---
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [orgId, setOrgId] = useState<string | null>(null);

    useEffect(() => {
        const fetchScheduleData = async () => {
            if (!user) return;

            try {
                // Get Org ID
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                const profileData = profile as any;
                if (!profileData?.organization_id) {
                    setLoading(false);
                    return;
                }
                const organizationId = profileData.organization_id;
                setOrgId(organizationId);

                // 1. Fetch Resources (Profiles in the same Org)
                const { data: teamMembers, error: teamError } = await sb
                    .from('profiles')
                    .select('id, name, role, avatar_url, department')
                    .eq('organization_id', organizationId);

                if (teamError) throw teamError;

                const mappedResources: Resource[] = (teamMembers as any[])?.map(m => ({
                    id: m.id,
                    name: m.name || 'Team Member',
                    role: m.role || 'Team Member',
                    department: m.department || 'Field Ops',
                    avatar: m.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=random`
                })) || [];
                setResources(mappedResources);

                // 2. Fetch Events (Bookings)
                const { data: bookings } = await sb
                    .from('bookings')
                    .select(`
                        id, 
                        booking_datetime, 
                        status, 
                        employee_id, 
                        notes,
                        service:services(name, duration) 
                    `)
                    .eq('organization_id', orgId);

                const mappedEvents: Event[] = bookings?.map((b: any) => {
                    const startTime = new Date(b.booking_datetime);

                    // Parse duration from notes if available (format: [Duration:60])
                    const noteDurationMatch = b.notes ? b.notes.match(/\[Duration:(\d+)\]/) : null;
                    const durationFromNotes = noteDurationMatch ? parseInt(noteDurationMatch[1]) : null;

                    // Default duration: Notes -> Service -> 60 mins
                    const durationMinutes = durationFromNotes || b.service?.duration || 60;
                    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

                    return {
                        id: b.id,
                        title: b.service?.name || 'Untitled Booking',
                        type: 'Shift', // Default type
                        startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                        endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                        duration: calculateDuration(
                            startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                            endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                        ),
                        date: startTime,
                        status: b.status,
                        resourceId: b.employee_id, // Map employee_id to resourceId
                        notes: b.notes
                    };
                }) || [];
                setEvents(mappedEvents);

            } catch (error) {
                console.error('Error fetching schedule:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleData();

        // --- Realtime Subscription ---
        const channel = supabase
            .channel('public:bookings')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookings',
                    filter: `organization_id=eq.${orgId || (user as any)?.user_metadata?.organization_id}` // Filter by Org if possible, but orgId might be null initially. 
                    // Best practice: Filter by org_id in RLS, but for realtime we filter payload if possible or just refetch.
                    // Since Row Level Security (RLS) is on, specific filtering in the channel definition 
                    // acts as an additional layer but the client only receives what it's allowed to see if "broadcast" is not used.
                    // However, for "postgres_changes", we receive events.
                    // Let's just listen to all changes and filter in callback or just refetch. Refetch is safer for consistency.
                },
                (payload) => {

                    if (payload.eventType === 'INSERT') {
                        showFeedback('New booking received!', 'success');
                        fetchScheduleData();
                    } else if (payload.eventType === 'UPDATE') {
                        // showFeedback('Schedule updated'); // Optional, might be noisy if self-triggered
                        fetchScheduleData();
                    } else if (payload.eventType === 'DELETE') {
                        fetchScheduleData();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, selectedDate, orgId]); // Add orgId dependency

    // --- Conflict Detection ---
    const checkForConflicts = (resourceId: string | undefined, startTime: string, endTime: string, date: Date, excludeEventId?: string) => {
        if (!resourceId) return false;

        const startMins = timeToMinutes(startTime);
        const endMins = timeToMinutes(endTime);

        return events.some(event => {
            if (event.id === excludeEventId) return false;
            if (event.resourceId !== resourceId) return false;
            if (!isSameDay(event.date, date)) return false;
            if (event.status === 'declined') return false;

            const eventStart = timeToMinutes(event.startTime);
            const eventEnd = timeToMinutes(event.endTime);

            return (startMins < eventEnd && endMins > eventStart);
        });
    };

    // --- Handlers ---

    const handleOpenCreateModal = () => {
        setEditingEvent(null);
        setBookingError(null);
        setIsBookingModalOpen(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setBookingError(null);
        setIsBookingModalOpen(true);
    };

    const handleSaveEvent = async (data: any) => {
        if (!orgId) return;
        setBookingError(null);
        const newStart = timeToMinutes(data.startTime);
        const newEnd = timeToMinutes(data.endTime);

        if (newEnd <= newStart) {
            setBookingError('End time must be after start time');
            return;
        }

        const resourceId = data.assignedTo || null;

        // Check for conflicts
        if (checkForConflicts(resourceId, data.startTime, data.endTime, selectedDate, editingEvent?.id)) {
            setBookingError('This resource is already booked for this time slot.');
            return;
        }

        try {
            // Construct ISO DateTime
            const bookingDate = new Date(selectedDate);
            const [hours, mins] = data.startTime.split(':').map(Number);
            bookingDate.setHours(hours, mins, 0, 0);

            // For now, let's keep it simple and assume bookings are for today/selectedDate
            // In a real app, we might need end_datetime if it spans days, but schema only has booking_datetime (start)
            // We rely on service duration or calculate it.
            // But wait, the bookings table doesn't have an end_datetime or duration column? 
            // It links to 'services'. But manual bookings (Shift) might not be linked to a service?
            // If service_id is null, how do we know duration? 
            // Schema has `service_id`. 
            // If we are creating a generic "Shift" without a service, we might need a dummy service or add 'duration' to bookings.
            // For this phase, I will try to find a service with name matching 'title' or just insert.
            // If I can't store duration, I'll rely on the app to handle it or assume 1 hour.
            // Better: I'll convert start/end to a duration note if needed?
            // Actually, `bookings` table definition I added: does it have duration? No.
            // It has `service_id`.
            // Problem: If I create a custom "Shift" without a service, I lose the duration info in DB.
            // I should add `duration_minutes` column to bookings OR `end_datetime`.
            // But I successfully added `bookings` definition already.
            // I'll check if `notes` can store it or if I should assume linked service.
            // For "Shift", "Strategy", etc, these are Types. 
            // Maybe I should insert a new service "Custom Shift" if not exists?
            // Or just store it in `notes` as JSON? e.g. "Duration: 60m".
            // Let's store it in `notes` to avoid schema change if possible, or just ignore persistence of custom duration for now and stick to 1 hour default.
            // Wait, I can't ignore it.
            // I'll update types/supabase.ts later if needed. For now, I'll append to notes: "[Duration: 60]"

            const durationMins = newEnd - newStart;
            const updatedNotes = data.notes ? `${data.notes} [Duration:${durationMins}]` : `[Duration:${durationMins}]`;

            const payload = {
                organization_id: orgId,
                booking_datetime: bookingDate.toISOString(),
                employee_id: resourceId,
                status: data.type === 'TimeOff' ? 'pending' : (resourceId ? 'approved' : 'open'),
                notes: updatedNotes,
                // service_id: ... // I don't have service selection in modal yet, just "Type".
            };

            if (editingEvent) {
                // Update
                const { error } = await sb
                    .from('bookings')
                    .update(payload)
                    .eq('id', editingEvent.id);

                if (error) throw error;
                showFeedback('Event updated successfully');
            } else {
                // Create
                const { error } = await sb
                    .from('bookings')
                    .insert(payload);

                if (error) throw error;
                showFeedback(data.type === 'TimeOff' ? 'Time off request submitted!' : 'Shift created successfully');
            }

            // Refresh logic - ideally fetch again. For now, simple reload or we can rely on real-time if enabled.
            // I'll trigger a re-fetch by toggling a key or just force reload function?
            // setEvents needs update.
            window.location.reload(); // Brute force refresh for now to ensure data is synced. 
            // Or I can extract fetchData to a useCallback and call it.

        } catch (err) {
            console.error('Error saving event:', err);
            setBookingError('Failed to save event');
        }

        setIsBookingModalOpen(false);
    };

    const handleDeleteEvent = async (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                const { error } = await sb.from('bookings').delete().eq('id', id);
                if (error) throw error;
                showFeedback('Event deleted');
                window.location.reload(); // Refresh
            } catch (err) {
                console.error('Error deleting event:', err);
                showFeedback('Failed to delete event', 'error');
            }
            setIsBookingModalOpen(false);
        }
    };

    const handleClaimShift = async (id: string) => {
        if (!user) return;
        try {
            const { error } = await sb
                .from('bookings')
                .update({
                    status: 'approved',
                    employee_id: user.id
                })
                .eq('id', id);

            if (error) throw error;
            showFeedback('Shift claimed successfully');
            window.location.reload();
        } catch (err) {
            console.error('Error claiming shift:', err);
            showFeedback('Failed to claim shift', 'error');
        }
    };

    const handleSwapRequest = async (id: string) => {
        try {
            const { error } = await sb
                .from('bookings')
                .update({ status: 'swap-requested' })
                .eq('id', id);

            if (error) throw error;
            showFeedback('Swap request sent');
            window.location.reload();
        } catch (err) {
            console.error('Error requesting swap:', err);
            showFeedback('Failed to request swap', 'error');
        }
    };

    const handleApproveRequest = async (id: string) => {
        try {
            const { error } = await sb
                .from('bookings')
                .update({ status: 'approved' })
                .eq('id', id);

            if (error) throw error;
            showFeedback('Request approved');
            window.location.reload();
        } catch (err) {
            console.error('Error approving request:', err);
            showFeedback('Failed to approve request', 'error');
        }
    };

    const handleDeclineRequest = async (id: string) => {
        try {
            const { error } = await sb
                .from('bookings')
                .update({ status: 'declined' }) // Or 'open' if we want to unassign? stick to declined for now
                .eq('id', id);

            if (error) throw error;
            showFeedback('Request declined');
            window.location.reload();
        } catch (err) {
            console.error('Error declining request:', err);
            showFeedback('Failed to decline request', 'error');
        }
    };

    // --- Drag and Drop Logic ---

    const handleDragStart = (e: React.DragEvent, eventId: string) => {
        e.dataTransfer.setData('eventId', eventId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Essential to allow dropping
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, resourceId: string) => {
        e.preventDefault();
        const eventId = e.dataTransfer.getData('eventId');
        const event = events.find(ev => ev.id === eventId);

        if (event) {
            // Check for conflicts on the target resource
            if (checkForConflicts(resourceId, event.startTime, event.endTime, event.date, event.id)) {
                showFeedback(`Conflict detected! ${resources.find(r => r.id === resourceId)?.name} is busy.`, 'error');
                return;
            }

            try {
                const { error } = await sb
                    .from('bookings')
                    .update({ employee_id: resourceId })
                    .eq('id', eventId);

                if (error) throw error;
                showFeedback(`Reassigned to ${resources.find(r => r.id === resourceId)?.name}`);
                window.location.reload();
            } catch (err) {
                console.error('Error reassigning event:', err);
                showFeedback('Failed to reassign event', 'error');
            }
        }
    };


    // --- Filter Logic ---
    const filteredEvents = events.filter(e => isSameDay(e.date, selectedDate));
    const filteredResources = filterDept === 'All' ? resources : resources.filter(r => r.department === filterDept);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); // In real app, start from current week start
        d.setDate(new Date().getDate() + i);
        return d;
    });

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#211611]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#de5c1b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#211611] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#211611]/80 backdrop-blur-md px-4 pt-4 pb-2 border-b border-[#de5c1b]/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-full hover:bg-[#de5c1b]/10 transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h1>
                            <p className="text-xs text-[#de5c1b] font-semibold uppercase tracking-widest">Master Schedule</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#de5c1b]"
                        >
                            <option value="All">All Depts</option>
                            <option value="Field Ops">Field Ops</option>
                            <option value="Management">Management</option>
                            <option value="Sales">Sales</option>
                        </select>
                        <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
                        <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                            <button
                                onClick={() => setViewMode('agenda')}
                                className={`p-2 rounded-md ${viewMode === 'agenda' ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm' : 'text-slate-400'}`}
                            >
                                <Users className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('resource')}
                                className={`p-2 rounded-md ${viewMode === 'resource' ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm' : 'text-slate-400'}`}
                            >
                                <CalendarIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <button onClick={handleOpenCreateModal} className="bg-[#de5c1b] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#de5c1b]/20 hover:bg-[#de5c1b]/90 transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Request / Add
                        </button>
                    </div>
                </div>

                {/* Date Picker */}
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {weekDays.map((date, index) => {
                        const isSelected = isSameDay(date, selectedDate);
                        return (
                            <div
                                key={index}
                                onClick={() => setSelectedDate(date)}
                                className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-xl cursor-pointer transition-all ${isSelected
                                    ? 'bg-[#de5c1b] text-white shadow-lg shadow-[#de5c1b]/30 scale-105'
                                    : 'bg-[#de5c1b]/5 hover:bg-[#de5c1b]/10'
                                    }`}
                            >
                                <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="text-lg font-bold">{date.getDate()}</span>
                            </div>
                        );
                    })}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4">

                {/* Pending / Open Shifts Pool */}
                <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Open Shifts */}
                    <div className="bg-white dark:bg-[#211611] border border-slate-200 dark:border-white/10 rounded-xl p-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Open Shifts (Unassigned)
                        </h3>
                        <div className="space-y-2">
                            {filteredEvents.filter(e => e.status === 'open').map(e => (
                                <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-dashed border-slate-300 dark:border-white/20">
                                    <div>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{e.title}</p>
                                        <p className="text-xs text-slate-500">{e.startTime} - {e.endTime} • {e.duration}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditEvent(e)}
                                            className="text-xs font-bold text-slate-400 hover:text-[#de5c1b]"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleClaimShift(e.id)}
                                            className="text-xs font-bold text-[#de5c1b] hover:underline"
                                        >
                                            Claim
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredEvents.filter(e => e.status === 'open').length === 0 && (
                                <p className="text-xs text-slate-400 italic">No open shifts available.</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Approvals */}
                    <div className="bg-white dark:bg-[#211611] border border-slate-200 dark:border-white/10 rounded-xl p-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#de5c1b] mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Action Required
                        </h3>
                        <div className="space-y-2">
                            {filteredEvents.filter(e => e.status === 'pending' || e.status === 'swap-requested').map(e => (
                                <div key={e.id} className="flex items-center justify-between p-3 bg-[#de5c1b]/5 rounded-lg border border-[#de5c1b]/20">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-700 dark:text-slate-200">{e.title}</p>
                                            {e.status === 'swap-requested' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">SWAP</span>}
                                            {e.type === 'TimeOff' && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">OFF</span>}
                                        </div>
                                        <p className="text-xs text-slate-500">{e.startTime} - {e.endTime} • {e.requester || 'System'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDeclineRequest(e.id)}
                                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded transition-colors"
                                            title="Decline"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleApproveRequest(e.id)}
                                            className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-500 rounded transition-colors"
                                            title="Approve"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredEvents.filter(e => e.status === 'pending' || e.status === 'swap-requested').length === 0 && (
                                <p className="text-xs text-slate-400 italic">No pending requests.</p>
                            )}
                        </div>
                    </div>
                </div>

                {viewMode === 'agenda' ? (
                    // --- AGENDA VIEW ---
                    <div className="space-y-4">
                        {filteredEvents
                            .filter(e => e.status === 'approved' || e.status === 'swap-requested' || e.status === 'pending')
                            .map(event => {
                                const resource = resources.find(r => r.id === event.resourceId);
                                // Hide pending time off from agenda unless involved
                                if (event.type === 'TimeOff' && event.status === 'pending') return null;

                                return (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        resource={resource}
                                        onSwapRequest={handleSwapRequest}
                                        onEdit={handleEditEvent}
                                    />
                                );
                            })}
                    </div>
                ) : (
                    // --- RESOURCE VIEW (with DnD) ---
                    <div className="overflow-x-auto pb-4">
                        <div className="min-w-[800px]">
                            {/* Time Header */}
                            <div className="grid grid-cols-[200px_1fr] gap-4 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">
                                <div className="text-xs font-bold uppercase text-slate-400 pl-4">Resource</div>
                                <div className="grid grid-cols-12 text-center">
                                    {['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'].map(t => (
                                        <div key={t} className="text-xs font-bold text-slate-400">{t}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Rows */}
                            <div className="space-y-4">
                                {filteredResources.map(resource => (
                                    <div
                                        key={resource.id}
                                        className="grid grid-cols-[200px_1fr] gap-4 items-center group"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, resource.id)}
                                    >
                                        <div className="flex items-center gap-3 pl-4">
                                            <img src={resource.avatar} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">{resource.name}</p>
                                                <p className="text-xs text-slate-500">{resource.role}</p>
                                            </div>
                                        </div>

                                        {/* Timeline Bar */}
                                        <div className="relative h-12 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 transition-colors hover:border-[#de5c1b]/30">
                                            {/* Render Grid Lines */}
                                            <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                                                {Array.from({ length: 12 }).map((_, i) => (
                                                    <div key={i} className="border-r border-slate-200/50 dark:border-white/5 h-full"></div>
                                                ))}
                                            </div>

                                            {/* Render Events */}
                                            {filteredEvents.filter(e => e.resourceId === resource.id && e.status !== 'declined').map(event => {
                                                const startHour = parseInt(event.startTime.split(':')[0]);
                                                const offset = Math.max(0, startHour - 8);
                                                const durationHours = parseInt(event.duration);
                                                const width = (durationHours / 12) * 100;
                                                const left = (offset / 12) * 100;

                                                return (
                                                    <div
                                                        key={event.id}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, event.id)}
                                                        onClick={() => handleEditEvent(event)} // Enable edit on click
                                                        className={`absolute top-1 bottom-1 rounded-md px-2 flex items-center shadow-sm cursor-grab active:cursor-grabbing hover:brightness-110 transition-all z-10 ${event.type === 'Shift' ? 'bg-indigo-500 text-white' :
                                                            event.type === 'Strategy' ? 'bg-[#de5c1b] text-white' :
                                                                event.type === 'TimeOff' ? 'bg-slate-400 text-white' :
                                                                    'bg-emerald-500 text-white'
                                                            }`}
                                                        style={{ left: `${left}%`, width: `${width}%` }}
                                                        title={`${event.title} (${event.startTime} - {event.endTime})`}
                                                    >
                                                        <span className="text-[10px] font-bold truncate">{event.title}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                initialData={editingEvent}
                error={bookingError}
                resources={resources}
            />

            <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>

            {/* Feedback Toast */}
            {feedbackMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#de5c1b] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <Check className="w-5 h-5 bg-white/20 rounded-full p-0.5" />
                    <span className="text-sm font-bold tracking-wide">{feedbackMessage}</span>
                </div>
            )}
        </div>
    );
};

export default Schedule;
