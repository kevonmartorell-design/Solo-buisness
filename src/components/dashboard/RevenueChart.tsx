import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';



interface RevenueChartProps {
    data?: { name: string; value: number }[];
}

const RevenueChart = ({ data = [] }: RevenueChartProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1c1917]/50 border border-white/5 rounded-2xl p-6 h-[400px] relative overflow-hidden flex flex-col"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg">Revenue Trend</h3>
                    <p className="text-white/40 text-sm">Real-time financial performance</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#de5c1b]/10 text-[#de5c1b] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#de5c1b]/20 transition-colors">7D</button>
                    <button className="px-3 py-1 text-white/40 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">30D</button>
                    <button className="px-3 py-1 text-white/40 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">YTD</button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#de5c1b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#de5c1b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#181311',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#de5c1b"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart >
                </ResponsiveContainer >
            </div>
        </motion.div >
    );
};

export default RevenueChart;
