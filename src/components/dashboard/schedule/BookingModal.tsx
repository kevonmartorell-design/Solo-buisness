
import { useState, useEffect } from 'react';
import { X, AlertCircle, Trash2 } from 'lucide-react';
import type { Resource, EventType, Event } from '../../../types/schedule';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    onDelete?: (id: string) => void;
    initialData?: Event | null;
    error: string | null;
    resources: Resource[];
}

const BookingModal = ({ isOpen, onClose, onSave, onDelete, initialData, error, resources }: BookingModalProps) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<EventType | 'TimeOff'>('Strategy');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [assignedTo, setAssignedTo] = useState<string>('');
    const [notes, setNotes] = useState('');

    // Initialize form with data or defaults
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title);
                setType(initialData.type);
                setStartTime(initialData.startTime);
                setEndTime(initialData.endTime);
                setAssignedTo(initialData.resourceId || '');
                setNotes(initialData.notes || '');
            } else {
                setTitle('');
                setType('Strategy');
                setStartTime('09:00');
                setEndTime('10:00');
                setAssignedTo('');
                setNotes('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const isTimeOff = type === 'TimeOff';
    const isEditing = !!initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#211611] rounded-2xl shadow-2xl border border-[#de5c1b]/20 w-full max-w-md p-6 m-4 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isEditing ? 'Edit Event' : (isTimeOff ? 'Request Time Off' : 'Create Shift / Event')}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-[#de5c1b]/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#211611]/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white"
                            placeholder={isTimeOff ? "e.g. Doctor's Appointment" : "e.g. Morning Shift"}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#211611]/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white"
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                            >
                                <option value="Shift">Shift</option>
                                <option value="Strategy">Strategy</option>
                                <option value="Design">Design</option>
                                <option value="Installation">Installation</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Consultation">Consultation</option>
                                <option value="TimeOff">Time Off</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assignee</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#211611]/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                disabled={isTimeOff} // Time off is usually self-requested or assigned to specific person, simplistic here
                            >
                                <option value="">{isTimeOff ? 'Self' : 'Open Shift'}</option>
                                {resources.map((r: Resource) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                            <input
                                type="time"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#211611]/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                            <input
                                type="time"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#211611]/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    {isTimeOff && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason / Notes</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#211611]/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] outline-none transition-all dark:text-white h-20 resize-none"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Optional details..."
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-8">
                    {isEditing && onDelete && (
                        <button
                            onClick={() => onDelete(initialData.id)}
                            className="p-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete Event"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 font-medium text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave({ ...initialData, title, type, startTime, endTime, assignedTo, notes })}
                        disabled={!title}
                        className="flex-1 py-2.5 rounded-xl bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white font-medium shadow-lg shadow-[#de5c1b]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isEditing ? 'Update Event' : (isTimeOff ? 'Request Time Off' : 'Save Slot')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
