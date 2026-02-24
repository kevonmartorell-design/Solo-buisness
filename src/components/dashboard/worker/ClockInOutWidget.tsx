import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Clock, Play, Square, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface TimeEntry {
    id: string;
    clock_in: string;
    clock_out: string | null;
    status: 'active' | 'completed';
}

const ClockInOutWidget = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (user) {
            fetchActiveEntry();
        }
    }, [user]);

    const fetchActiveEntry = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('time_entries')
                .select('*')
                .eq('employee_id', user?.id)
                .eq('status', 'active')
                .order('clock_in', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setActiveEntry(data || null);
        } catch (error) {
            console.error('Error fetching time entry:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClockIn = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // First get the user's organization_id from profiles
            const { data: profile } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) throw new Error('No organization found');

            const { data, error } = await supabase
                .from('time_entries')
                .insert([{
                    employee_id: user.id,
                    organization_id: profile.organization_id,
                    status: 'active'
                }])
                .select()
                .single();

            if (error) throw error;
            setActiveEntry(data);
        } catch (error) {
            console.error('Error clocking in:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        if (!activeEntry) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('time_entries')
                .update({
                    clock_out: new Date().toISOString(),
                    status: 'completed'
                })
                .eq('id', activeEntry.id);

            if (error) throw error;
            setActiveEntry(null);
        } catch (error) {
            console.error('Error clocking out:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (start: string) => {
        const diffMs = currentTime.getTime() - new Date(start).getTime();
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        return `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Time Clock</h3>
            <div className="text-3xl font-mono text-gray-800 dark:text-gray-100 font-bold mb-6 tracking-wider">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>

            {loading ? (
                <div className="h-12 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            ) : activeEntry ? (
                <div className="flex flex-col items-center w-full">
                    <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        On the clock for: {formatDuration(activeEntry.clock_in)}
                    </div>
                    <button
                        onClick={handleClockOut}
                        className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Square className="w-5 h-5 fill-current" />
                        Clock Out
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full">
                    <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        You are currently off the clock.
                    </div>
                    <button
                        onClick={handleClockIn}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        Clock In
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClockInOutWidget;
