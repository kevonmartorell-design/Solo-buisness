import { useState, useEffect } from 'react';
import {
    CalendarDays,
    DollarSign,
    UserCheck,
    Repeat
} from 'lucide-react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import AnalyticsCard from './AnalyticsCard';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const PersonalView = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        bookings: 0,
        revenue: 0,
        bestClient: 'N/A',
        bestClientSpend: 0,
        retention: 0
    });
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [serviceData, setServiceData] = useState<any[]>([]);
    const [topClients, setTopClients] = useState<any[]>([]);
    const [heatmapData, setHeatmapData] = useState<any[]>([]);

    useEffect(() => {
        const fetchPersonalMetrics = async () => {
            if (!user) return;

            try {
                // Get Org ID
                const { data: profile } = await (supabase as any)
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                if (!profile?.organization_id) {
                    return;
                }
                const orgId = profile.organization_id;

                // Fetch real bookings data
                const { data: bookings, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        booking_datetime,
                        status,
                        service:services (name, price),
                        client:clients (name)
                    `)
                    .eq('organization_id', orgId);

                if (error) throw error;

                // Filter for confirmed/completed bookings
                const validBookings: any[] = bookings?.filter((b: any) =>
                    ['approved', 'confirmed', 'completed'].includes(b.status)
                ) || [];

                // Sort bookings by date for correct monthly order
                validBookings.sort((a, b) => {
                    const dateA = new Date(a.booking_datetime || 0).getTime();
                    const dateB = new Date(b.booking_datetime || 0).getTime();
                    return dateA - dateB;
                });

                // --- Calculate Metrics ---
                const totalBookings = validBookings.length;
                let totalRevenue = 0;

                const clientModals: Record<string, { spend: number, visits: number }> = {};
                const serviceCounts: Record<string, number> = {};
                const monthlyRevenue: Record<string, number> = {};
                const dayCounts: Record<string, number> = {};

                validBookings.forEach(booking => {
                    // Handle potential array/object response from Supabase joins
                    const sPrice = Array.isArray(booking.service) ? booking.service[0]?.price : booking.service?.price;
                    const price = Number(sPrice) || 0;
                    totalRevenue += price;

                    // Client Stats
                    const cData = booking.client;
                    const clientName = (Array.isArray(cData) ? cData[0]?.name : cData?.name) || 'Unknown';

                    if (!clientModals[clientName]) {
                        clientModals[clientName] = { spend: 0, visits: 0 };
                    }
                    clientModals[clientName].spend += price;
                    clientModals[clientName].visits += 1;

                    // Service Stats
                    const sData = booking.service;
                    const serviceName = (Array.isArray(sData) ? sData[0]?.name : sData?.name) || 'Unknown';
                    serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;

                    // Monthly Revenue & Heatmap
                    if (booking.booking_datetime) {
                        const date = new Date(booking.booking_datetime);
                        const monthKey = date.toLocaleString('default', { month: 'short' });
                        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + price;

                        const day = date.toLocaleString('default', { weekday: 'short' });
                        dayCounts[day] = (dayCounts[day] || 0) + 1;
                    }
                });

                // Best Client
                const sortedClients = Object.entries(clientModals)
                    .map(([name, data]) => ({ name, ...data }))
                    .sort((a, b) => b.spend - a.spend);

                const bestClientName = sortedClients[0]?.name || 'N/A';
                const bestClientSpend = sortedClients[0]?.spend || 0;

                // Retention Rate
                const totalUniqueClients = Object.keys(clientModals).length;
                const repeatClients = Object.values(clientModals).filter(c => c.visits > 1).length;
                const retentionRate = totalUniqueClients > 0
                    ? Math.round((repeatClients / totalUniqueClients) * 100)
                    : 0;

                setStats({
                    bookings: totalBookings,
                    revenue: totalRevenue,
                    bestClient: bestClientName,
                    bestClientSpend: bestClientSpend,
                    retention: retentionRate
                });

                // --- Prepare Chart Data ---
                // Monthly Revenue (Keys are already in chronological order if validBookings was sorted, mostly)
                // But Object.entries might not guarantee order. 
                // We'll trust the insertion order for now as simple fix.
                const mData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
                    month,
                    revenue
                }));
                setMonthlyData(mData.length ? mData : [{ month: 'No Data', revenue: 0 }]);

                // Service Distribution
                const sData = Object.entries(serviceCounts).map(([name, value], i) => ({
                    name,
                    value,
                    fill: ['#de5c1b', '#ea580c', '#f97316', '#fb923c'][i % 4]
                }));
                setServiceData(sData.length ? sData : [{ name: 'None', value: 1, fill: '#eee' }]);

                // Heatmap Data
                const hData = Object.entries(dayCounts).map(([day, value]) => ({
                    day,
                    value,
                    time: 'Peak'
                }));
                setHeatmapData(hData.length ? hData : []);

                // Top Clients
                const topList = sortedClients.slice(0, 3).map(c => ({
                    name: c.name,
                    spent: `$${c.spend.toLocaleString()}`,
                    visits: c.visits,
                    fidelity: c.visits > 5 ? 'High' : 'Medium'
                }));
                setTopClients(topList);

                // setStats(...)
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                // Done
            }
        };

        fetchPersonalMetrics();
    }, [user]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Personal KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnalyticsCard title="Total Bookings" value={stats.bookings.toString()} icon={CalendarDays} />
                <AnalyticsCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} />
                <AnalyticsCard title="Best Client" value={stats.bestClient} subtext={`$${stats.bestClientSpend.toLocaleString()} Spent`} icon={UserCheck} />
                <AnalyticsCard title="Retention Rate" value={`${stats.retention}%`} icon={Repeat} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue & Bookings Chart */}
                <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Booking & Revenue Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#de5c1b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#de5c1b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#de5c1b" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Distribution Pie Chart */}
                <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Revenue by Service</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {serviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Booking Heatmap */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Booking Density (Days)</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={heatmapData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }}
                            />
                            <Bar dataKey="value" fill="#de5c1b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Clients List */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Your Best Clients</h3>
                    <button className="text-xs font-bold text-[#de5c1b]">View All</button>
                </div>
                <div className="space-y-3">
                    {topClients.length > 0 ? topClients.map((client, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#de5c1b]/10 flex items-center justify-center text-[#de5c1b] font-bold">
                                    {(client.name || '?').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{client.name}</p>
                                    <p className="text-xs text-slate-500">{client.visits} Visits • {client.fidelity} Fidelity</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#de5c1b]">{client.spent}</p>
                                <p className="text-[10px] text-emerald-500 font-bold">Top 5%</p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-slate-500 p-4">No client data available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalView;
