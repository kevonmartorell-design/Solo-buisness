import { motion } from 'framer-motion';

const activities = [
    { id: 1, type: 'job', content: 'HVAC Maintenance completed', time: '12 min ago', user: 'Alex M.' },
    { id: 2, type: 'lead', content: 'New Lead: "Downtown Office Complex"', time: '28 min ago', user: 'System' },
    { id: 3, type: 'alert', content: 'Inventory Low: Zone 4', time: '1h ago', user: 'Warehouse Bot' },
    { id: 4, type: 'payment', content: 'Invoice #4092 Paid ($4,200)', time: '2h ago', user: 'Finance' },
];

const ActivityFeed = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#1c1917]/50 border border-white/5 rounded-2xl p-6"
        >
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="size-2 bg-[#de5c1b] rounded-full animate-pulse"></span>
                Live Intelligence
            </h3>

            <div className="space-y-6">
                {activities.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex gap-4 group"
                    >
                        <div className="relative mt-1">
                            <div className="size-2 rounded-full bg-white/20 group-hover:bg-[#de5c1b] transition-colors ring-4 ring-[#1c1917]"></div>
                            {index !== activities.length - 1 && (
                                <div className="absolute top-2 left-1 h-full w-px bg-white/5 group-hover:bg-[#de5c1b]/20 transition-colors"></div>
                            )}
                        </div>
                        <div className="flex-1 pb-2 border-b border-white/5 group-last:border-0">
                            <p className="text-white text-sm font-medium hover:text-[#de5c1b] transition-colors cursor-pointer">
                                {item.content}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{item.time}</span>
                                <span className="size-1 rounded-full bg-white/20"></span>
                                <span className="text-[10px] text-[#de5c1b]/80 font-bold uppercase tracking-wider">{item.user}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default ActivityFeed;
