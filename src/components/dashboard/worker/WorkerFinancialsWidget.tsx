import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { DollarSign, Loader2, TrendingUp } from 'lucide-react';
import { differenceInMinutes, startOfWeek, endOfWeek } from 'date-fns';

const WorkerFinancialsWidget = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [weeklyHours, setWeeklyHours] = useState(0);
    const [estimatedPayout, setEstimatedPayout] = useState(0);
    const [payRate, setPayRate] = useState(0);

    useEffect(() => {
        if (user) {
            fetchFinancials();
        }
    }, [user]);

    const fetchFinancials = async () => {
        try {
            // First get the user's pay rate. In a real scenario, this might come from a specific employee table.
            // For now, let's assume a default rate if not defined, or check assignments/shifts
            // We'll just hardcode an estimation logic or fetch from profile if added.
            const assumedPayRate = 18.50;
            setPayRate(assumedPayRate);

            // Fetch time entries for the current week
            const start = startOfWeek(new Date()).toISOString();
            const end = endOfWeek(new Date()).toISOString();

            const { data, error } = await supabase
                .from('time_entries')
                .select('clock_in, clock_out, status')
                .eq('employee_id', user?.id)
                .gte('clock_in', start)
                .lte('clock_in', end)
                .eq('status', 'completed');

            if (error) throw error;

            let totalMinutes = 0;
            if (data) {
                data.forEach(entry => {
                    if (entry.clock_out) {
                        totalMinutes += differenceInMinutes(new Date(entry.clock_out), new Date(entry.clock_in));
                    }
                });
            }

            const hours = totalMinutes / 60;
            setWeeklyHours(hours);
            setEstimatedPayout(hours * assumedPayRate);

        } catch (error) {
            console.error('Error fetching financials:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Earnings Estimate</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estimated Payout</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-4xl font-bold text-gray-900 dark:text-white">
                                ${estimatedPayout.toFixed(2)}
                            </h4>
                            <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hours Logged</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {weeklyHours.toFixed(1)}h
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Base Rate</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${payRate.toFixed(2)}/hr
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerFinancialsWidget;
