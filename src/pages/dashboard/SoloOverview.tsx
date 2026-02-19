import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import MetricCard from '../../components/dashboard/MetricCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle, UserPlus, CalendarPlus } from 'lucide-react';



const SoloOverview = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        upcomingBookings: 0,
        avgProjectValue: 0,
        dailyRevenue: [] as any[],
        recentActivity: [] as any[]
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

                const userProfile = profile as { organization_id: string } | null;

                if (!userProfile?.organization_id) {
                    setLoading(false);
                    return;
                }

                const orgId = userProfile.organization_id;

                // Fetch Bookings
                const { data: bookingsData, error } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        status,
                        booking_datetime,
                        service:services (
                            price
                        )
                    `)
                    .eq('organization_id', orgId);

                if (error) throw error;

                const bookings = bookingsData as any[] || [];

                // Metrics Calculation
                const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');

                // Revenue
                const totalRevenue = confirmedBookings.reduce((sum, booking) => {
                    const price = Array.isArray(booking.service) ? booking.service[0]?.price : booking.service?.price;
                    return sum + (Number(price) || 0);
                }, 0);

                // Upcoming Bookings (Confirmed & Future Date)
                const now = new Date();
                const upcomingCount = bookings.filter(b =>
                    b.status === 'confirmed' && new Date(b.booking_datetime) > now
                ).length;

                // Avg Project Value
                const avgValue = confirmedBookings.length > 0 ? totalRevenue / confirmedBookings.length : 0;

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
                    upcomingBookings: upcomingCount,
                    avgProjectValue: Math.round(avgValue),
                    dailyRevenue: dailyRevenue,
                    recentActivity: confirmedBookings.slice(0, 5).map(b => ({
                        id: b.id,
                        type: 'booking',
                        content: `Completed booking`,
                        time: new Date(b.booking_datetime).toLocaleDateString()
                    }))
                });

            } catch (error) {
                console.error('Error fetching solo dashboard data:', error);
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
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">My Business</h1>
                    <p className="text-white/40 text-sm font-medium tracking-wider">SOLO EDITION</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/schedule" className="bg-[#de5c1b] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#de5c1b]/90 transition-colors">
                        <CalendarPlus className="w-4 h-4" />
                        <span>New Booking</span>
                    </Link>
                </div>
            </motion.div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    trend="Gross Income"
                    trendUp={true}
                    icon="payments"
                    delay={0.1}
                    path="/financials"
                />
                <MetricCard
                    title="Upcoming Jobs"
                    value={stats.upcomingBookings.toString()}
                    trend="Next 7 Days"
                    trendUp={true}
                    icon="event"
                    delay={0.2}
                    path="/schedule"
                />
                <MetricCard
                    title="Avg. Job Value"
                    value={`$${stats.avgProjectValue.toLocaleString()}`}
                    trend="Per Booking"
                    trendUp={true}
                    icon="price_check"
                    delay={0.3}
                    path="/analytics"
                />
            </div>

            {/* Quick Actions & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart data={stats.dailyRevenue} />
                </div>

                {/* Quick Actions Panel */}
                <div className="lg:col-span-1 bg-[#1c1917]/50 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/clients" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:text-blue-300">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Add New Client</p>
                                <p className="text-xs text-white/40">Enter client details manually</p>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:text-emerald-300">
                                <PlusCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Create Invoice</p>
                                <p className="text-xs text-white/40">Send a bill for completed work</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoloOverview;
