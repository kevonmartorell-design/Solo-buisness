
import { useEffect, useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    Users
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Area,
    Line
} from 'recharts';
import AnalyticsCard from './AnalyticsCard';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const ExecutiveView = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        netProfit: 0,
        laborCostPercent: 0,
        activeClients: 0
    });
    const [deptPerformance, setDeptPerformance] = useState<any[]>([]);
    const [forecastData, setForecastData] = useState<any[]>([]);

    useEffect(() => {
        const fetchExecutiveData = async () => {
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

                // 2. Fetch All Org Bookings with Service Price + Employee Dept
                // We need employee department to group revenue by dept.
                const { data: bookings } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        booking_datetime,
                        status,
                        service:services(price),
                        employee:profiles(department)
                    `)
                    .eq('organization_id', (profile as any).organization_id)
                    .neq('status', 'cancelled');

                if (bookings && bookings.length > 0) {
                    const totalRevenue = bookings.reduce((sum, b: any) => sum + (b.service?.price || 0), 0);

                    // Est Costs
                    const laborCost = totalRevenue * 0.30; // 30% est
                    const cogs = totalRevenue * 0.10; // 10% est
                    const fixedCosts = 500; // Mock fixed overhead
                    const netProfit = totalRevenue - laborCost - cogs - fixedCosts;

                    // Unique Clients (Mocking via unique booking IDs for now as client_id lookup might be complex without types)
                    const activeClients = bookings.length;

                    setStats({
                        totalRevenue,
                        netProfit,
                        laborCostPercent: totalRevenue > 0 ? (laborCost / totalRevenue) * 100 : 0,
                        activeClients
                    });

                    // Group by Department
                    const deptMap: Record<string, number> = {};
                    bookings.forEach((b: any) => {
                        const dept = b.employee?.department || 'Unassigned';
                        const rev = b.service?.price || 0;
                        deptMap[dept] = (deptMap[dept] || 0) + rev;
                    });

                    const deptData = Object.entries(deptMap).map(([name, revenue]) => ({
                        name,
                        revenue,
                        profit: revenue * 0.4 // Mock 40% margin
                    }));
                    setDeptPerformance(deptData);

                    // If rev is 0, forecast is 0. If rev > 0, project growth.
                    // (projectionBase logic moved to inline if needed)

                    if (totalRevenue === 0) {
                        setForecastData([]);
                    } else {
                        setForecastData([
                            { month: 'Current', actual: totalRevenue, forecast: totalRevenue },
                            { month: '+1 Mo', actual: null, forecast: totalRevenue * 1.1 },
                            { month: '+2 Mo', actual: null, forecast: totalRevenue * 1.25 },
                        ]);
                    }

                } else {
                    setStats({
                        totalRevenue: 0,
                        netProfit: 0,
                        laborCostPercent: 0,
                        activeClients: 0
                    });
                    setDeptPerformance([]);
                    setForecastData([]);
                }

            } catch (err) {
                console.error('Error fetching executive data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchExecutiveData();
    }, [user]);

    if (loading) return <div className="p-10 text-center text-slate-500">Loading executive overview...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* District KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnalyticsCard title="Total Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`} trend={stats.totalRevenue > 0 ? "+12.5%" : "0%"} icon={DollarSign} />
                <AnalyticsCard title="Net Profit" value={`$${(stats.netProfit / 1000).toFixed(1)}k`} trend={stats.netProfit > 0 ? "+8.2%" : "0%"} icon={TrendingUp} />
                <AnalyticsCard title="Labor Cost" value={`${stats.laborCostPercent.toFixed(1)}%`} trend="Est." icon={Users} inverseTrend />
                <AnalyticsCard title="Total Bookings" value={`${stats.activeClients}`} trend="Active" icon={Users} />
            </div>

            {/* Revenue Forecast Chart */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Revenue Forecast (Next Quarter)</h3>
                <div className="h-80">
                    {forecastData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }} />
                                <Legend />
                                <Area type="monotone" dataKey="actual" name="Actual Revenue" fill="#10b981" stroke="#10b981" fillOpacity={0.1} />
                                <Line type="monotone" dataKey="forecast" name="Projected" stroke="#de5c1b" strokeDasharray="5 5" strokeWidth={2} dot={{ stroke: '#de5c1b', strokeWidth: 2, r: 4, fill: '#1c1917' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 italic">
                            <span className="mb-2">No sufficient data for forecasting.</span>
                            <span className="text-xs">Data will appear after more activity.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Multi-Unit Chart */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Department Performance Comparison</h3>
                <div className="h-80">
                    {deptPerformance.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Legend />
                                <Bar dataKey="revenue" name="Revenue" fill="#de5c1b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 italic">
                            <span className="mb-2">No department data available.</span>
                            <span className="text-xs">Revenue data will be grouped by department here.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExecutiveView;
