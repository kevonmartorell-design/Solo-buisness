
import { useEffect, useState } from 'react';
import {
    DollarSign
} from 'lucide-react';
import {
    RadialBarChart,
    RadialBar,
    Legend,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

// Mock goals for now, hard to dynamic without a 'goals' table
const ASSOCIATE_GOALS = [
    { name: 'Sales', uv: 31.47, pv: 2400, fill: '#8884d8' },
    { name: 'Services', uv: 26.69, pv: 4567, fill: '#83a6ed' },
    { name: 'Retail', uv: 15.69, pv: 1398, fill: '#8dd1e1' },
    { name: 'Rebooking', uv: 8.22, pv: 9800, fill: '#82ca9d' },
];

const AssociateView = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    // const [earnings, setEarnings] = useState(0); 
    const [hourlyEarnings, setHourlyEarnings] = useState(0); // Mock for now or calc from timesheet
    const [commissionEarnings, setCommissionEarnings] = useState(0);
    const [recentCommissions, setRecentCommissions] = useState<any[]>([]);

    useEffect(() => {
        const fetchAssociateData = async () => {
            if (!user) return;

            try {
                // 1. Fetch Bookings for this user (Employee)
                // We assume 'price' is on the service.
                const { data: bookings } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        booking_datetime,
                        service:services(name, price)
                    `)
                    .eq('employee_id', user.id)
                    .neq('status', 'cancelled'); // Don't count cancelled

                if (bookings) {
                    // Filter for "This Week" - simplified to all for now or simple JS filter
                    // For MVP let's just sum all to show "Total" or filter simple
                    const now = new Date();
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

                    const thisWeekBookings = bookings.filter((b: any) => new Date(b.booking_datetime) >= startOfWeek);

                    const totalServiceRevenue = thisWeekBookings.reduce((sum: number, b: any) => {
                        return sum + (b.service?.price || 0);
                    }, 0);

                    // Mock Commission Logic: 15% of service revenue
                    const estimatedCommission = totalServiceRevenue * 0.15;

                    // setEarnings(estimatedCommission); // Earnings = Commission for this view? Or Total?
                    // If we don't have hourly data yet, base earnings default to 0.
                    // This will be updated when shift/timesheet tracking is fully implemented.
                    setHourlyEarnings(0);
                    setCommissionEarnings(estimatedCommission);

                    // Recent History
                    const recent = bookings
                        .sort((a: any, b: any) => new Date(b.booking_datetime).getTime() - new Date(a.booking_datetime).getTime())
                        .slice(0, 3)
                        .map((b: any) => ({
                            id: b.id,
                            title: b.service?.name || 'Service',
                            date: new Date(b.booking_datetime).toLocaleDateString(),
                            amount: (b.service?.price || 0) * 0.15
                        }));
                    setRecentCommissions(recent);
                }

            } catch (err) {
                console.error('Error fetching associate data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssociateData();
    }, [user]);

    if (loading) return <div className="p-10 text-center text-slate-500">Loading analytics...</div>;

    const totalEarnings = hourlyEarnings + commissionEarnings;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Earnings */}
                <div className="bg-gradient-to-br from-[#de5c1b] to-[#b84510] rounded-xl p-6 text-white shadow-lg shadow-[#de5c1b]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-white/80 font-medium mb-1">Estimated Earnings (This Week)</p>
                        <h2 className="text-4xl font-bold mb-6">${totalEarnings.toFixed(2)}</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                <p className="text-xs text-white/70 uppercase font-bold">Base / Hourly</p>
                                <p className="text-xl font-bold">${hourlyEarnings.toFixed(2)}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                <p className="text-xs text-white/70 uppercase font-bold">Commission</p>
                                <p className="text-xl font-bold">${commissionEarnings.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Goals Progress */}
                <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 w-full text-left">Weekly Bonus Goals</h3>
                    <div className="h-[320px] min-h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <RadialBarChart innerRadius="20%" outerRadius="100%" data={ASSOCIATE_GOALS} startAngle={180} endAngle={0}>
                                <RadialBar background dataKey="value" cornerRadius={10} label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }} />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-2">You are <strong className="text-emerald-500">85%</strong> of the way to your weekly bonus!</p>
                </div>
            </div>

            {/* Recent Shifts/History */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Commission History</h3>
                <div className="space-y-3">
                    {recentCommissions.length > 0 ? recentCommissions.map((comm) => (
                        <div key={comm.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white capitalize">{comm.title} Commission</p>
                                    <p className="text-xs text-slate-500">Ticket #{comm.id.slice(0, 4)} • {comm.date}</p>
                                </div>
                            </div>
                            <span className="font-bold text-emerald-500">+${comm.amount.toFixed(2)}</span>
                        </div>
                    )) : (
                        <div className="text-center py-4 text-slate-400 text-sm">No commissions earned yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssociateView;
