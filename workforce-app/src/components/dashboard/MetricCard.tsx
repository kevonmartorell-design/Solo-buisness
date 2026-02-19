import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface MetricCardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: string;
    delay?: number;
    path?: string;
}

const MetricCard = ({ title, value, trend, trendUp, icon, delay = 0, path }: MetricCardProps) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="relative overflow-hidden rounded-2xl bg-[#1c1917]/50 border border-white/5 p-6 group hover:border-[#de5c1b]/30 transition-colors"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#de5c1b]/10 rounded-lg text-[#de5c1b]">
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>
                    {path && (
                        <button
                            onClick={() => navigate(path)}
                            className="bg-[#de5c1b]/10 text-[#de5c1b] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-[#de5c1b] hover:text-white"
                        >
                            Inspect
                        </button>
                    )}
                </div>
                {trend && (
                    <div className={clsx(
                        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                        trendUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                        <span className="material-symbols-outlined text-sm">
                            {trendUp ? 'trending_up' : 'trending_down'}
                        </span>
                        {trend}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
                <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
            </div>
        </motion.div>
    );
};

export default MetricCard;
