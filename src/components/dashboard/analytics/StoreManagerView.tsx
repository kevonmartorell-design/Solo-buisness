
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
import { STORE_DATA } from './AnalyticsData';

const StoreManagerView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Store KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnalyticsCard title="Today's Sales" value="$4,250" trend="+5.2%" icon={DollarSign} />
                <AnalyticsCard title="Labor %" value="26.5%" trend="-2.1%" icon={Users} inverseTrend />
                <AnalyticsCard title="Avg Ticket" value="$124" trend="+1.8%" icon={Target} />
                <AnalyticsCard title="Cust. Satisfaction" value="4.8/5" trend="Stable" icon={Award} />
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
    );
};

export default StoreManagerView;
