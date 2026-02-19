import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import MetricCard from '../../components/dashboard/MetricCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import SystemHealth from '../../components/dashboard/SystemHealth';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import { motion } from 'framer-motion';


// Simple helper to avoid adding date-fns dependency if npm fails
const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const Overview = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        expenses: 0,
        netProfit: 0,
        activeCount: 0,
        efficiency: 100,
        recentActivity: [] as any[],
        dailyRevenue: [] as any[],
        bestClient: '',
        retention: ''
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            try {
                // Get Organization ID
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                // Explicit check to handle potential null/never type inference issues
                const userProfile = profile as { organization_id: string } | null;

                if (!userProfile?.organization_id) {
                    setLoading(false);
                    return;
                }

                const orgId = userProfile.organization_id;

                // 1. Fetch Bookings with Service details for Revenue
                const { data: bookingsData } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        status,
                        client_id,
                        service:services (
                            price
                        ),
                        client:clients (
                            id,
                            name
                        )
                    `)
                    .eq('organization_id', orgId);

                // Cast to any to avoid complex type definition for joined tables for now
                const bookings = bookingsData as any[] || [];

                // Calculate Metrics
                const confirmedBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'completed') || [];

                // Total Revenue
                const totalRevenue = confirmedBookings.reduce((sum, booking) => {
                    const price = Array.isArray(booking.service) ? booking.service[0]?.price : booking.service?.price;
                    return sum + (Number(price) || 0);
                }, 0);

                // Total Bookings Count
                const totalBookings = bookings?.length || 0;

                // Best Client
                const clientSpend: Record<string, { name: string, spend: number, bookings: number }> = {};
                confirmedBookings.forEach(booking => {
                    if (booking.client_id && booking.client) {
                        const clientId = booking.client_id;
                        const clientName = Array.isArray(booking.client) ? booking.client[0]?.name : booking.client?.name;
                        const price = Array.isArray(booking.service) ? booking.service[0]?.price : booking.service?.price;

                        if (!clientSpend[clientId]) {
                            clientSpend[clientId] = { name: clientName || 'Unknown', spend: 0, bookings: 0 };
                        }
                        clientSpend[clientId].spend += (Number(price) || 0);
                        clientSpend[clientId].bookings += 1;
                    }
                });

                const bestClient = Object.values(clientSpend).sort((a, b) => b.spend - a.spend)[0];

                // Retention Rate
                const totalClientsWithBookings = Object.keys(clientSpend).length;
                const repeatClients = Object.values(clientSpend).filter(c => c.bookings > 1).length;
                const retentionRate = totalClientsWithBookings > 0 ? Math.round((repeatClients / totalClientsWithBookings) * 100) : 0;


                // 3. Fetch Recent Activity (Audit Logs)
                const { data: auditLogsData } = await supabase
                    .from('audit_logs')
                    .select('*')
                    .eq('organization_id', orgId)
                    .order('created_at', { ascending: false })
                    .limit(5);

                const auditLogs = auditLogsData as any[] || [];

                // 4. Fetch Expenses for Net Profit
                const { data: expensesData } = await (supabase as any)
                    .from('expenses')
                    .select('amount')
                    .eq('organization_id', orgId);

                const totalExpenses = (expensesData || []).reduce((sum: number, exp: any) => sum + (Number(exp.amount) || 0), 0);
                const netProfit = totalRevenue - totalExpenses;

                const formattedActivity = auditLogs.map(log => ({
                    id: log.id,
                    type: 'system',
                    content: `${log.action} ${log.entity_type}`,
                    time: formatTimeAgo(log.created_at),
                    user: 'System'
                }));

                // Daily Revenue for Chart (Last 7 Days)
                const last7Days: Record<string, number> = {};
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    last7Days[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
                }

                confirmedBookings.forEach(booking => {
                    const bDate = new Date(booking.booking_datetime);
                    const label = bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    if (last7Days[label] !== undefined) {
                        const price = Array.isArray(booking.service) ? booking.service[0]?.price : booking.service?.price;
                        last7Days[label] += (Number(price) || 0);
                    }
                });

                const dailyRevenue = Object.entries(last7Days).map(([name, value]) => ({ name, value }));

                setStats({
                    revenue: totalRevenue,
                    expenses: totalExpenses,
                    netProfit: netProfit,
                    activeCount: totalBookings,
                    efficiency: retentionRate,
                    recentActivity: formattedActivity,
                    dailyRevenue: dailyRevenue,
                    bestClient: bestClient ? `${bestClient.name} ($${bestClient.spend})` : 'No clients yet',
                    retention: `${retentionRate}%`
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);



    if (loading) {
        return <div className="text-white/40 p-8">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Command Center</h1>
                    <p className="text-white/40 text-sm font-medium tracking-wider">{user?.tier === 'Solo' ? 'SOLO EDITION' : 'BUSINESS EDITION'}</p>
                </div>
                <p className="text-white/40 text-sm">System Status: <span className="text-[#de5c1b] font-bold">OPTIMAL</span></p>
            </motion.div>

            {/* Hero Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Bookings"
                    value={stats.activeCount.toString()}
                    trend="Lifetime"
                    trendUp={true}
                    icon="calendar_month"
                    delay={0.1}
                    path="/schedule"
                />
                <MetricCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    trend="Gross"
                    trendUp={true}
                    icon="payments"
                    delay={0.2}
                    path="/financials"
                />
                <MetricCard
                    title="Best Client"
                    value={stats.bestClient || 'N/A'}
                    trend="Top Spender"
                    trendUp={true}
                    icon="person_celebrate"
                    delay={0.3}
                    path="/clients"
                />
                <MetricCard
                    title="Net Profit"
                    value={`$${stats.netProfit.toLocaleString()}`}
                    trend="Revenue - Expenses"
                    trendUp={stats.netProfit >= 0}
                    icon="savings"
                    delay={0.4}
                    path="/financials"
                />
            </div>

            {/* Main Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart data={stats.dailyRevenue} />
                </div>
                <div className="lg:col-span-1">
                    <SystemHealth
                        score={stats.efficiency}
                        title="System Status"
                        subtext="All systems operational. Ready for business."
                    />
                </div>
            </div>

            {/* Live Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityFeed activities={stats.recentActivity} />

                {/* Placeholder for future module, e.g., Map or Calendar snippet */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-[#1c1917]/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#de5c1b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="material-symbols-outlined text-6xl text-white/10 mb-4 group-hover:text-[#de5c1b]/40 transition-colors">map</span>
                    <h3 className="text-white font-bold text-lg mb-1">Live Fleet Map</h3>
                    <p className="text-white/40 text-xs uppercase tracking-widest">Global Positioning Module</p>
                    <button className="mt-6 px-6 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-[#de5c1b] hover:bg-[#de5c1b]/10 transition-all text-xs font-bold uppercase tracking-wider">
                        Initialize View
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Overview;
