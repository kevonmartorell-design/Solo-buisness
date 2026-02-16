
import {
    Activity,
    Clock,
    Target
} from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import { DEPT_EFFICIENCY_DATA } from './AnalyticsData';

const DepartmentHeadView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Dept Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnalyticsCard title="Team Efficiency" value="94%" trend="+2%" icon={Activity} />
                <AnalyticsCard title="Avg Service Time" value="48m" trend="-5m" icon={Clock} inverseTrend />
                <AnalyticsCard title="Open Tickets" value="3" trend="Low" icon={Target} />
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
    );
};

export default DepartmentHeadView;
