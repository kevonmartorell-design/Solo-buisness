import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { CalendarClock, Loader2 } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';

interface TimeEntry {
    id: string;
    clock_in: string;
    clock_out: string | null;
    status: string;
}

const ShiftHistoryWidget = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<TimeEntry[]>([]);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('time_entries')
                .select('*')
                .eq('employee_id', user?.id)
                .eq('status', 'completed')
                .order('clock_out', { ascending: false })
                .limit(5);

            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            console.error('Error fetching shift history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (start: string, end: string) => {
        const mins = differenceInMinutes(new Date(end), new Date(start));
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        if (hours === 0) return `${remainingMins}m`;
        return `${hours}h ${remainingMins}m`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <CalendarClock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Shifts</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            ) : entries.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>No recently completed shifts.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {entries.map((entry) => (
                        <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    {format(new Date(entry.clock_in), 'MMM d, yyyy')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {format(new Date(entry.clock_in), 'h:mm a')} - {entry.clock_out ? format(new Date(entry.clock_out), 'h:mm a') : '...'}
                                </p>
                            </div>
                            {entry.clock_out && (
                                <div className="mt-2 sm:mt-0 text-right">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        {formatDuration(entry.clock_in, entry.clock_out)}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShiftHistoryWidget;
