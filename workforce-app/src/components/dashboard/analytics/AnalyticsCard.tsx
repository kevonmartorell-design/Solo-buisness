
import type { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    trend?: string;
    subtext?: string;
    icon: LucideIcon;
    inverseTrend?: boolean;
}

const AnalyticsCard = ({ title, value, trend, subtext, icon: Icon, inverseTrend }: AnalyticsCardProps) => {
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

export default AnalyticsCard;
