
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
import { PERSONAL_BOOKINGS, SERVICE_DISTRIBUTION_DATA, BOOKING_HEATMAP_DATA } from './AnalyticsData';

const PersonalView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Personal KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnalyticsCard title="Total Bookings" value="106" trend="+12" icon={CalendarDays} />
                <AnalyticsCard title="Total Revenue" value="$12.4k" trend="+8.5%" icon={DollarSign} />
                <AnalyticsCard title="Best Client" value="Marcus S." subtext="$4,250 Spent" icon={UserCheck} />
                <AnalyticsCard title="Retention Rate" value="78%" trend="+4%" icon={Repeat} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue & Bookings Chart */}
                <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Booking & Revenue Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height={320}>
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

                {/* Service Distribution Pie Chart */}
                <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Revenue by Service</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={SERVICE_DISTRIBUTION_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {SERVICE_DISTRIBUTION_DATA.map((entry, index) => (
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

            {/* Booking Heatmap (Simplified as Bar Chart for now, simulating density) */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Booking Density (Peak Hours)</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={BOOKING_HEATMAP_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-[#1c1917] border border-[#333] p-2 rounded shadow text-white text-xs">
                                                <p className="font-bold">{payload[0].payload.day}</p>
                                                <p>{payload[0].payload.time}: {payload[0].value} bookings</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
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
    );
};

export default PersonalView;
