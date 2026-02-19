
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';

// Import View Components
import ExecutiveView from '../../components/dashboard/analytics/ExecutiveView';
import StoreManagerView from '../../components/dashboard/analytics/StoreManagerView';
import DepartmentHeadView from '../../components/dashboard/analytics/DepartmentHeadView';
import AssociateView from '../../components/dashboard/analytics/AssociateView';
import PersonalView from '../../components/dashboard/analytics/PersonalView';

export type ViewMode = 'Executive' | 'Store Manager' | 'Department Head' | 'Associate' | 'Personal';

const Analytics = () => {
    const { toggleSidebar } = useSidebar();
    const [viewMode, setViewMode] = useState<ViewMode>('Personal'); // Default to Personal for user convenience

    const getViewDescription = (mode: ViewMode) => {
        switch (mode) {
            case 'Executive': return 'District Overview & Multi-Unit Performance';
            case 'Store Manager': return 'Profitability & Labor Control';
            case 'Department Head': return 'Team Efficiency & Service Quality';
            case 'Associate': return 'Personal Earnings & Goals';
            case 'Personal': return 'My Business Growth & Client Retention';
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-[#151210] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
            {/* --- Header --- */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#211611]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                The Money Brain
                                <span className="px-2 py-0.5 rounded-full bg-[#de5c1b]/10 text-[#de5c1b] text-[10px] uppercase font-bold tracking-wider border border-[#de5c1b]/20">
                                    {viewMode} View
                                </span>
                            </h1>
                            <p className="text-xs text-slate-500 font-medium hidden md:block">
                                {getViewDescription(viewMode)}
                            </p>
                        </div>
                    </div>

                    {/* View Simulation Toggle */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                        {(['Personal', 'Executive', 'Store Manager', 'Department Head', 'Associate'] as ViewMode[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === mode
                                    ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                    }`}
                            >
                                {mode === 'Store Manager' ? 'Manager' : mode === 'Department Head' ? 'Dept' : mode}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
                {viewMode === 'Executive' && <ExecutiveView />}
                {viewMode === 'Store Manager' && <StoreManagerView />}
                {viewMode === 'Department Head' && <DepartmentHeadView />}
                {viewMode === 'Associate' && <AssociateView />}
                {viewMode === 'Personal' && <PersonalView />}
            </main>
        </div>
    );
};

export default Analytics;
