
import { useState } from 'react';
import {
    Menu,
    CalendarDays,
    TrendingUp,
    Users,
    DollarSign,
    Activity,
    Target,
    Clock,
    Award,
    Briefcase,
    UserCheck,
    Repeat
} from 'lucide-react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ComposedChart,
    Line,
    RadialBarChart,
    RadialBar,
    Legend
} from 'recharts';
import { useSidebar } from '../../contexts/SidebarContext';

// --- Types ---

type ViewMode = 'Executive' | 'Store Manager' | 'Department Head' | 'Associate' | 'Personal';

// --- Mock Data ---

const EXECUTIVE_DATA = [
    { name: 'North Store', revenue: 45000, profit: 12000, labor: 28 },
    { name: 'South Store', revenue: 38000, profit: 8500, labor: 32 },
    { name: 'East Store', revenue: 52000, profit: 15400, labor: 25 },
    { name: 'West Store', revenue: 31000, profit: 4200, labor: 38 },
];

const STORE_DATA = [
    { day: 'Mon', revenue: 4200, laborCost: 1200, laborPercent: 28 },
    { day: 'Tue', revenue: 3800, laborCost: 1100, laborPercent: 29 },
    { day: 'Wed', revenue: 4500, laborCost: 1250, laborPercent: 27 },
    { day: 'Thu', revenue: 5100, laborCost: 1400, laborPercent: 27 },
    { day: 'Fri', revenue: 7800, laborCost: 1900, laborPercent: 24 },
    { day: 'Sat', revenue: 8900, laborCost: 2100, laborPercent: 23 },
    { day: 'Sun', revenue: 2100, laborCost: 900, laborPercent: 42 },
];

const DEPT_EFFICIENCY_DATA = [
    { name: 'John A.', efficiency: 98, avgTime: 45 },
    { name: 'Sarah J.', efficiency: 92, avgTime: 52 },
    { name: 'Mike C.', efficiency: 85, avgTime: 58 },
    { name: 'Emma W.', efficiency: 78, avgTime: 65 },
];

const ASSOCIATE_GOALS = [
    { name: 'Revenue', x: 1, fill: '#de5c1b', value: 85 },
    { name: 'Tips', x: 1, fill: '#10b981', value: 92 },
    { name: 'Reviews', x: 1, fill: '#3b82f6', value: 78 },
];

const PERSONAL_BOOKINGS = [
    { month: 'Jan', bookings: 12, revenue: 1200 },
    { month: 'Feb', bookings: 15, revenue: 1500 },
    { month: 'Mar', bookings: 18, revenue: 1800 },
    { month: 'Apr', bookings: 14, revenue: 1400 },
    { month: 'May', bookings: 22, revenue: 2200 },
    { month: 'Jun', bookings: 25, revenue: 2500 },
];

const Analytics = () => {
    const { toggleSidebar } = useSidebar();
    const [viewMode, setViewMode] = useState<ViewMode>('Personal'); // Default to Personal for user convenience

    const getViewDescription = (mode: ViewMode) => {
        switch (mode) {
            case 'Executive': return 'District Overview & Multi-Unit Performance';
            case 'Store Manager': return 'Profitability & Labor Control';
            case 'Department Head': return 'Team Efficiency & Service Quality';
            case 'Associate': return 'Personal Earnings & Goals';
            case 'Personal': return 'My Business Growth & Client Retention';
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-[#151210] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
            {/* --- Header --- */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#211611]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                The Money Brain
                                <span className="px-2 py-0.5 rounded-full bg-[#de5c1b]/10 text-[#de5c1b] text-[10px] uppercase font-bold tracking-wider border border-[#de5c1b]/20">
                                    {viewMode} View
                                </span>
                            </h1>
                            <p className="text-xs text-slate-500 font-medium hidden md:block">
                                {getViewDescription(viewMode)}
                            </p>
                        </div>
                    </div>

                    {/* View Simulation Toggle */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                        {(['Personal', 'Executive', 'Store Manager', 'Department Head', 'Associate'] as ViewMode[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === mode
                                        ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                    }`}
                            >
                                {mode === 'Store Manager' ? 'Manager' : mode === 'Department Head' ? 'Dept' : mode}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">

                {/* --- EXECUTIVE VIEW --- */}
                {viewMode === 'Executive' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* District KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <KPI_Card title="Total Revenue" value="$166k" trend="+12.5%" icon={DollarSign} />
                            <KPI_Card title="Net Profit" value="$40.1k" trend="+8.2%" icon={TrendingUp} />
                            <KPI_Card title="Labor Cost" value="28.4%" trend="-1.2%" icon={Users} inverseTrend />
                            <KPI_Card title="Active Clients" value="1,248" trend="+34" icon={Users} />
                        </div>

                        {/* Multi-Unit Chart */}
                        <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Store Performance Comparison</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={EXECUTIVE_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }}
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Revenue" fill="#de5c1b" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- STORE MANAGER VIEW --- */}
                {viewMode === 'Store Manager' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* Store KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <KPI_Card title="Today's Sales" value="$4,250" trend="+5.2%" icon={DollarSign} />
                            <KPI_Card title="Labor %" value="26.5%" trend="-2.1%" icon={Users} inverseTrend />
                            <KPI_Card title="Avg Ticket" value="$124" trend="+1.8%" icon={Target} />
                            <KPI_Card title="Cust. Satisfaction" value="4.8/5" trend="Stable" icon={Award} />
                        </div>

                        {/* Labor vs Revenue Chart */}
                        <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Revenue Flow & Labor Cost</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#de5c1b] rounded-full"></span><span className="text-xs text-slate-500">Revenue</span></div>
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-full"></span><span className="text-xs text-slate-500">Labor %</span></div>
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={STORE_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }} />
                                        <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#de5c1b" fillOpacity={0.1} stroke="#de5c1b" strokeWidth={3} />
                                        <Line yAxisId="right" type="monotone" dataKey="laborPercent" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Real-time P&L Estimate */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Daily P&L Estimate</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-sm text-slate-500">Gross Revenue</span>
                                        <span className="font-bold text-slate-900 dark:text-white">$4,250.00</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-sm text-slate-500">Labor Cost (Est)</span>
                                        <span className="font-bold text-red-500">-$1,126.25</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                                        <span className="text-sm text-slate-500">COGS (Est 15%)</span>
                                        <span className="font-bold text-red-500">-$637.50</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-bold text-slate-900 dark:text-white">Est. Net Profit</span>
                                        <span className="text-xl font-bold text-emerald-500">$2,486.25</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- DEPARTMENT HEAD VIEW --- */}
                {viewMode === 'Department Head' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* Dept Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <KPI_Card title="Team Efficiency" value="94%" trend="+2%" icon={Activity} />
                            <KPI_Card title="Avg Service Time" value="48m" trend="-5m" icon={Clock} inverseTrend />
                            <KPI_Card title="Open Tickets" value="3" trend="Low" icon={Target} />
                        </div>

                        {/* Team Leaderboard */}
                        <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Technician Efficiency Leaderboard</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-slate-500">Employee</th>
                                            <th className="px-4 py-3 font-bold text-slate-500">Efficiency Score</th>
                                            <th className="px-4 py-3 font-bold text-slate-500">Avg Time</th>
                                            <th className="px-4 py-3 font-bold text-slate-500 text-right">Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {DEPT_EFFICIENCY_DATA.map((emp, i) => (
                                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{emp.name}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">{emp.efficiency}%</span>
                                                        <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${emp.efficiency > 90 ? 'bg-emerald-500' : emp.efficiency > 80 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${emp.efficiency}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">{emp.avgTime}m</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${emp.efficiency > 90 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                            emp.efficiency > 80 ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                                                                'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                                        }`}>
                                                        {emp.efficiency > 90 ? 'Excellent' : emp.efficiency > 80 ? 'Good' : 'Review'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ASSOCIATE VIEW --- */}
                {viewMode === 'Associate' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Earnings */}
                            <div className="bg-gradient-to-br from-[#de5c1b] to-[#b84510] rounded-xl p-6 text-white shadow-lg shadow-[#de5c1b]/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <DollarSign className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-white/80 font-medium mb-1">Estimated Earnings (This Week)</p>
                                    <h2 className="text-4xl font-bold mb-6">$842.50</h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                            <p className="text-xs text-white/70 uppercase font-bold">Hourly</p>
                                            <p className="text-xl font-bold">$640.00</p>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                            <p className="text-xs text-white/70 uppercase font-bold">Tips/Comm.</p>
                                            <p className="text-xl font-bold">$202.50</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Goals Progress */}
                            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 w-full text-left">Weekly Bonus Goals</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
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
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Service Commission</p>
                                                <p className="text-xs text-slate-500">Ticket #8842 • Yesterday</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-emerald-500">+$24.50</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PERSONAL VIEW (SOLO/CONTRACTOR) --- */}
                {viewMode === 'Personal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* Personal KPI Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <KPI_Card title="Total Bookings" value="106" trend="+12" icon={CalendarDays} />
                            <KPI_Card title="Total Revenue" value="$12.4k" trend="+8.5%" icon={DollarSign} />
                            <KPI_Card title="Best Client" value="Marcus S." subtext="$4,250 Spent" icon={UserCheck} />
                            <KPI_Card title="Retention Rate" value="78%" trend="+4%" icon={Repeat} />
                        </div>

                        {/* Revenue & Bookings Chart */}
                        <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Booking & Revenue Growth</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PERSONAL_BOOKINGS}>
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

                        {/* Top Clients List */}
                        <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Your Best Clients</h3>
                                <button className="text-xs font-bold text-[#de5c1b]">View All</button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: 'Marcus Sterling', spent: '$4,250', visits: 14, fidelity: 'High' },
                                    { name: 'Elena Vance', spent: '$3,890', visits: 12, fidelity: 'High' },
                                    { name: 'Julian Thorne', spent: '$2,940', visits: 11, fidelity: 'Medium' }
                                ].map((client, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#de5c1b]/10 flex items-center justify-center text-[#de5c1b] font-bold">
                                                {client.name.split(' ').map(n => n[0]).join('')}
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
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

const KPI_Card = ({ title, value, trend, subtext, icon: Icon, inverseTrend }: any) => {
    const isPositive = trend?.startsWith('+');
    const isGood = inverseTrend ? !isPositive : isPositive;

    return (
        <div className="bg-white dark:bg-[#1c1917] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm hover:border-[#de5c1b]/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
                <div className={`p-1.5 rounded-lg ${!trend ? 'bg-[#de5c1b]/10 text-[#de5c1b]' : isGood ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' : 'bg-red-50 text-red-500 dark:bg-red-500/10'}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
                {trend && <span className={`text-xs font-bold mb-1 ${isGood ? 'text-emerald-500' : 'text-red-500'}`}>{trend}</span>}
                {subtext && <span className="text-xs font-medium text-slate-500 mb-1">{subtext}</span>}
            </div>
        </div>
    );
};

export default Analytics;
