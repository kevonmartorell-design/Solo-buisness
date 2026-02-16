import MetricCard from '../../components/dashboard/MetricCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import SystemHealth from '../../components/dashboard/SystemHealth';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import { motion } from 'framer-motion';
import { useVault } from '../../contexts/VaultContext';

const Overview = () => {
    const { industry } = useVault();

    const getIndustryMetrics = () => {
        switch (industry) {
            case 'Healthcare':
                return { active: 'Active Patients', icon: 'medical_services', unit: 'Patients' };
            case 'Construction':
                return { active: 'Active Jobs', icon: 'construction', unit: 'Sites' };
            case 'Security':
                return { active: 'Active Patrols', icon: 'security', unit: 'Routes' };
            case 'Logistics':
                return { active: 'Active Fleets', icon: 'local_shipping', unit: 'Vehicles' };
            case 'Hospitality':
                return { active: 'Open Tables', icon: 'restaurant', unit: 'Reservations' };
            default:
                return { active: 'Active Jobs', icon: 'work', unit: 'Jobs' };
        }
    };

    const metrics = getIndustryMetrics();

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Command Center</h1>
                    <p className="text-white/40 text-sm font-medium tracking-wider">{industry.toUpperCase()} EDITION</p>
                </div>
                <p className="text-white/40 text-sm">System Status: <span className="text-[#de5c1b] font-bold">OPTIMAL</span></p>
            </motion.div>

            {/* Hero Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value="$94,203"
                    trend="+12% vs last week"
                    trendUp={true}
                    icon="payments"
                    delay={0.1}
                />
                <MetricCard
                    title={metrics.active}
                    value="24"
                    trend="+4 new today"
                    trendUp={true}
                    icon={metrics.icon}
                    delay={0.2}
                />
                <MetricCard
                    title="Efficiency"
                    value="98.5%"
                    trend="+2% vs avg"
                    trendUp={true}
                    icon="bolt"
                    delay={0.3}
                />
            </div>

            {/* Main Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-1">
                    <SystemHealth />
                </div>
            </div>

            {/* Live Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityFeed />

                {/* Placeholder for future module, e.g., Map or Calendar snippet */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-[#1c1917]/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#de5c1b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="material-symbols-outlined text-6xl text-white/10 mb-4 group-hover:text-[#de5c1b]/40 transition-colors">map</span>
                    <h3 className="text-white font-bold text-lg mb-1">Live Fleet Map</h3>
                    <p className="text-white/40 text-xs uppercase tracking-widest">Global Positioning Module</p>
                    <button className="mt-6 px-6 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-[#de5c1b] hover:bg-[#de5c1b]/10 transition-all text-xs font-bold uppercase tracking-wider">
                        Initialize View
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Overview;
