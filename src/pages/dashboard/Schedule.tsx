import { useState } from 'react';
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
import { useSidebar } from '../../contexts/SidebarContext';
import BookingModal from '../../components/dashboard/schedule/BookingModal';
import EventCard from '../../components/dashboard/schedule/EventCard';
import type { Resource, Event, EventType } from '../../types/schedule';

// --- Mock Data ---

const MOCK_RESOURCES: Resource[] = [
    { id: 'r1', name: 'John Anderson', role: 'Master Electrician', department: 'Field Ops', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 'r2', name: 'Sarah Jenkins', role: 'Project Supervisor', department: 'Management', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 'r3', name: 'Michael Chen', role: 'HVAC Specialist', department: 'Field Ops', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 'r4', name: 'David Kim', role: 'Sales Associate', department: 'Sales', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

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
    const { toggleSidebar } = useSidebar();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'agenda' | 'resource'>('agenda');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [filterDept, setFilterDept] = useState('All');
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Feedback Toast Helper
    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(null), 3000);
    };

    // --- Mock Data Generator ---
    const generateMockEvents = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [
            { id: '1', title: 'Morning Shift', type: 'Shift', startTime: '08:00', endTime: '16:00', duration: '8h', date: today, status: 'approved', resourceId: 'r1' },
            { id: '2', title: 'Site Inspection', type: 'Maintenance', startTime: '10:00', endTime: '12:00', duration: '2h', date: today, status: 'approved', resourceId: 'r2' },
            { id: '3', title: 'Strategy Meeting', type: 'Strategy', startTime: '13:00', endTime: '14:30', duration: '1.5h', date: today, status: 'approved', resourceId: 'r2' },
            { id: '4', title: 'HVAC Repair', type: 'Installation', startTime: '09:00', endTime: '13:00', duration: '4h', date: today, status: 'swap-requested', resourceId: 'r3', requester: 'Michael Chen' },
            { id: '5', title: 'Afternoon Coverage', type: 'Shift', startTime: '12:00', endTime: '20:00', duration: '8h', date: today, status: 'open' }, // Open shift
            { id: '6', title: 'Pending Approval', type: 'Consultation', startTime: '15:00', endTime: '16:00', duration: '1h', date: today, status: 'pending', requester: 'Client: TechLink' }
        ] as Event[];
    };

    const [events, setEvents] = useState<Event[]>(generateMockEvents());

    // --- Handlers ---

    const handleSaveEvent = (data: any) => {
        setBookingError(null);
        const newStart = timeToMinutes(data.startTime);
        const newEnd = timeToMinutes(data.endTime);

        if (newEnd <= newStart) {
            setBookingError('End time must be after start time');
            return;
        }

        const newEvent: Event = {
            id: Date.now().toString(),
            title: data.title,
            type: data.type,
            startTime: data.startTime,
            endTime: data.endTime,
            duration: calculateDuration(data.startTime, data.endTime),
            date: new Date(selectedDate),
            status: data.type === 'TimeOff' ? 'pending' : (data.assignedTo ? 'approved' : 'open'),
            resourceId: data.assignedTo || undefined,
            requester: data.type === 'TimeOff' ? 'Current User' : undefined, // Mock
            notes: data.notes
        };

        setEvents([...events, newEvent]);
        setIsBookingModalOpen(false);
        showFeedback(data.type === 'TimeOff' ? 'Time off request submitted!' : 'Shift created successfully');
    };

    const handleClaimShift = (id: string, resourceId: string) => {
        setEvents(events.map(e => e.id === id ? { ...e, status: 'approved', resourceId: 'r1' } : e)); // Mock assigning to 'current user' (r1)
        showFeedback('Shift claimed successfully');
    };

    const handleSwapRequest = (id: string) => {
        setEvents(events.map(e => e.id === id ? { ...e, status: 'swap-requested' } : e));
        showFeedback('Swap request sent');
    };

    const handleApproveRequest = (id: string) => {
        setEvents(events.map(e => e.id === id ? { ...e, status: 'approved' } : e));
        showFeedback('Request approved');
    };

    const handleDeclineRequest = (id: string) => {
        setEvents(events.map(e => e.id === id ? { ...e, status: 'declined' } : e));
        showFeedback('Request declined');
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

    const handleDrop = (e: React.DragEvent, resourceId: string) => {
        e.preventDefault();
        const eventId = e.dataTransfer.getData('eventId');
        const event = events.find(ev => ev.id === eventId);

        if (event) {
            // Update event with new resource
            setEvents(events.map(ev =>
                ev.id === eventId
                    ? { ...ev, resourceId: resourceId }
                    : ev
            ));
            showFeedback(`Reassigned to ${MOCK_RESOURCES.find(r => r.id === resourceId)?.name}`);
        }
    };


    // --- Filter Logic ---
    const filteredEvents = events.filter(e => isSameDay(e.date, selectedDate));
    const filteredResources = filterDept === 'All' ? MOCK_RESOURCES : MOCK_RESOURCES.filter(r => r.department === filterDept);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(new Date().getDate() + i);
        return d;
    });

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
                        <button onClick={() => setIsBookingModalOpen(true)} className="bg-[#de5c1b] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#de5c1b]/20 hover:bg-[#de5c1b]/90 transition-colors flex items-center gap-2">
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
                                    <button
                                        onClick={() => handleClaimShift(e.id, 'r1')}
                                        className="text-xs font-bold text-[#de5c1b] hover:underline"
                                    >
                                        Claim
                                    </button>
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
                                const resource = MOCK_RESOURCES.find(r => r.id === event.resourceId);
                                // Hide pending time off from agenda unless involved
                                if (event.type === 'TimeOff' && event.status === 'pending') return null;

                                return (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        resource={resource}
                                        onSwapRequest={handleSwapRequest}
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
                error={bookingError}
                resources={MOCK_RESOURCES}
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
