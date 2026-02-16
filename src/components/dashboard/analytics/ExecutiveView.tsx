
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
import { EXECUTIVE_DATA, EXECUTIVE_FORECAST_DATA } from './AnalyticsData';

const ExecutiveView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* District KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnalyticsCard title="Total Revenue" value="$166k" trend="+12.5%" icon={DollarSign} />
                <AnalyticsCard title="Net Profit" value="$40.1k" trend="+8.2%" icon={TrendingUp} />
                <AnalyticsCard title="Labor Cost" value="28.4%" trend="-1.2%" icon={Users} inverseTrend />
                <AnalyticsCard title="Active Clients" value="1,248" trend="+34" icon={Users} />
            </div>

            {/* Revenue Forecast Chart */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Revenue Forecast (Next Quarter)</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={EXECUTIVE_FORECAST_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: '#1c1917', borderColor: '#333', color: '#fff' }} />
                            <Legend />
                            <Area type="monotone" dataKey="actual" name="Actual Revenue" fill="#10b981" stroke="#10b981" fillOpacity={0.1} />
                            <Line type="monotone" dataKey="forecast" name="Projected" stroke="#de5c1b" strokeDasharray="5 5" strokeWidth={2} dot={{ stroke: '#de5c1b', strokeWidth: 2, r: 4, fill: '#1c1917' }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
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
    );
};

export default ExecutiveView;
