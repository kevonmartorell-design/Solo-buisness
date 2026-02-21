
import { useEffect, useState } from 'react';
import {
    DollarSign,
    Users,
    Target,
    Award
} from 'lucide-react';
import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import AnalyticsCard from './AnalyticsCard';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const StoreManagerView = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todaySales: 0,
        laborPercent: 0,
        avgTicket: 0,
        custSatisfaction: 5.0
    });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!user) return;

            try {
                // 1. Get Org ID
                const { data: profile } = await (supabase as any)
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                if (!profile?.organization_id) {
                    setLoading(false);
                    return;
                }

                // 2. Fetch All Org Bookings
                const { data: bookings } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        booking_datetime,
                        status,
                        service:services(price)
                    `)
                    .eq('organization_id', (profile as any).organization_id)
                    .neq('status', 'cancelled');

                if (bookings && bookings.length > 0) {
                    // Calculate Today's Sales
                    const today = new Date().toDateString();
                    const todayBookings = bookings.filter((b: any) => new Date(b.booking_datetime).toDateString() === today);
                    const todayRevenue = todayBookings.reduce((sum, b: any) => sum + (b.service?.price || 0), 0);

                    // Avg Ticket (All Time for stability or Today)
                    const totalRevenue = bookings.reduce((sum, b: any) => sum + (b.service?.price || 0), 0);
                    const avgTicket = bookings.length > 0 ? totalRevenue / bookings.length : 0;

                    setStats({
                        todaySales: todayRevenue,
                        laborPercent: 28.5, // Mock for now
                        avgTicket: avgTicket,
                        custSatisfaction: 4.9 // Mock
                    });

                    // Generate Chart Data (Last 7 Days)
                    const last7Days = Array.from({ length: 7 }, (_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (6 - i));
                        return d.toDateString();
                    });

                    const dailyData = last7Days.map(dateStr => {
                        const dayBookings = bookings.filter((b: any) => new Date(b.booking_datetime).toDateString() === dateStr);
                        const dayRevenue = dayBookings.reduce((sum: number, b: any) => sum + (b.service?.price || 0), 0);
                        return {
                            day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
                            revenue: dayRevenue,
                            laborPercent: dayRevenue > 0 ? Math.max(20, Math.min(40, 30 + (Math.random() * 5))) : 0 // Mock variability
                        };
                    });
                    setChartData(dailyData);

                } else {
                    // No data state
                    setStats({
                        todaySales: 0,
                        laborPercent: 0,
                        avgTicket: 0,
                        custSatisfaction: 5.0
                    });
                    setChartData([]);
                }

            } catch (err) {
                console.error('Error fetching store data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [user]);

    if (loading) return <div className="p-10 text-center text-slate-500">Loading store analytics...</div>;

    // Derived P&L
    const grossRevenue = stats.todaySales;
    const laborCost = grossRevenue * (stats.laborPercent / 100);
    const cogs = grossRevenue * 0.15; // Est 15%
    const netProfit = grossRevenue - laborCost - cogs;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Store KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnalyticsCard title="Today's Sales" value={`$${stats.todaySales.toFixed(2)}`} trend={stats.todaySales > 0 ? "Active" : "No Activity"} icon={DollarSign} />
                <AnalyticsCard title="Labor %" value={`${stats.laborPercent.toFixed(1)}%`} trend="Est." icon={Users} inverseTrend />
                <AnalyticsCard title="Avg Ticket" value={`$${stats.avgTicket.toFixed(0)}`} trend="Global" icon={Target} />
                <AnalyticsCard title="Cust. Satisfaction" value={`${stats.custSatisfaction}/5`} trend="Stable" icon={Award} />
            </div>

            {/* Labor vs Revenue Chart */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Revenue Flow & Labor Cost (7 Days)</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#de5c1b] rounded-full"></span><span className="text-xs text-slate-500">Revenue</span></div>
                        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-full"></span><span className="text-xs text-slate-500">Labor %</span></div>
                    </div>
                </div>
                <div className="h-80">
                    {chartData.length > 0 && chartData.some(d => d.revenue > 0) ? (
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <ComposedChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }} />
                                <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#de5c1b" fillOpacity={0.1} stroke="#de5c1b" strokeWidth={3} />
                                <Line yAxisId="right" type="monotone" dataKey="laborPercent" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 italic">
                            <span className="mb-2">No revenue data recorded for this week.</span>
                            <span className="text-xs">Bookings with prices will appear here.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Real-time P&L Estimate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Daily P&L Estimate (Projected)</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                            <span className="text-sm text-slate-500">Gross Revenue</span>
                            <span className="font-bold text-slate-900 dark:text-white">${grossRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                            <span className="text-sm text-slate-500">Labor Cost (Est)</span>
                            <span className="font-bold text-red-500">-${laborCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                            <span className="text-sm text-slate-500">COGS (Est 15%)</span>
                            <span className="font-bold text-red-500">-${cogs.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-slate-900 dark:text-white">Est. Net Profit</span>
                            <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                ${netProfit.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreManagerView;
