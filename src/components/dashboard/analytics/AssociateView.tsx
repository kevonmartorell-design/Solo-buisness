
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
import { ASSOCIATE_GOALS } from './AnalyticsData';

const AssociateView = () => {
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
    );
};

export default AssociateView;
