import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface SystemHealthProps {
    score?: number;
    title?: string;
    subtext?: string;
}

const SystemHealth = ({ score = 100, title = "System Health", subtext = "All systems operational." }: SystemHealthProps) => {
    const data = [
        { name: 'Health', value: score, fill: '#de5c1b' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#1c1917]/50 border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#de5c1b]/30 transition-colors"
        >
            <div className="absolute inset-0 bg-[#de5c1b]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-3xl"></div>

            <h3 className="text-white font-bold text-lg mb-2 relative z-10">{title}</h3>

            <div className="relative size-64 min-h-[256px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={20}
                        data={data}
                        startAngle={180}
                        endAngle={-180}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background={{ fill: '#333' }}
                            dataKey="value"
                            cornerRadius={30 / 2}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white tracking-tighter">{score}%</span>
                    <span className="text-[#de5c1b] text-sm font-bold uppercase tracking-widest mt-2 animate-pulse">
                        {score >= 90 ? 'Optimal' : score >= 70 ? 'Good' : 'Attention'}
                    </span>
                </div>
            </div>

            <p className="text-white/40 text-xs text-center mt-4 max-w-[200px]">
                {subtext}
            </p>
        </motion.div>
    );
};

export default SystemHealth;
