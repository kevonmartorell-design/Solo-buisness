
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import { useSidebar } from '../../contexts/SidebarContext';
import { useBranding } from '../../contexts/BrandingContext';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { isSidebarOpen } = useSidebar();
    const { companyName, logoUrl } = useBranding();
    const { user } = useAuth();

    // ... navItems definition ...
    // ... navItems definition ...
    const allNavItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard', tiers: ['Free', 'Solo', 'Business'] },
        { name: 'Vault', path: '/vault', icon: 'lock', tiers: ['Business'] },
        { name: 'Schedule', path: '/schedule', icon: 'calendar_today', tiers: ['Solo', 'Business'] },
        { name: 'Employees', path: '/employees', icon: 'group', tiers: ['Solo', 'Business'] },
        { name: 'Analytics', path: '/analytics', icon: 'bar_chart', tiers: ['Solo', 'Business'] },
        { name: 'Financials', path: '/financials', icon: 'payments', tiers: ['Solo', 'Business'] },
        { name: 'Clients', path: '/clients', icon: 'handshake', tiers: ['Solo', 'Business'] },
        { name: 'Services & Products', path: '/services', icon: 'inventory_2', tiers: ['Solo', 'Business'] },

        { name: 'Profile', path: '/profile', icon: 'account_circle', tiers: ['Free', 'Solo', 'Business'] },
        { name: 'My Bookings', path: '/my-bookings', icon: 'event_available', tiers: ['Free', 'Solo', 'Business'] },
        { name: 'Settings', path: '/settings', icon: 'settings', tiers: ['Free', 'Solo', 'Business'] },
    ];

    // Filter items based on user's tier
    const userTier = user?.tier || 'Free';
    const navItems = allNavItems.filter(item => item.tiers.includes(userTier));

    return (
        <aside className={`fixed left-0 top-0 h-full w-72 bg-[#1c1917] border-r border-white/5 flex flex-col shadow-2xl z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex items-center gap-3 border-b border-white/5">
                <img src={logoUrl || '/aegis-logo.png'} alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">{companyName}</span>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Core Ops</p>
                    <div className="space-y-1">
                        {navItems.slice(0, 4).map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                                        isActive
                                            ? 'bg-primary text-white'
                                            : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                                    )
                                }
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="text-sm font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Growth</p>
                    <div className="space-y-1">
                        {navItems.slice(4, 7).map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                                        isActive
                                            ? 'bg-primary text-white'
                                            : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                                    )
                                }
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="text-sm font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Account</p>
                    <div className="space-y-1">
                        {navItems.slice(7).map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                                        isActive
                                            ? 'bg-primary text-white'
                                            : 'text-slate-400 hover:bg-primary/10 hover:text-primary'
                                    )
                                }
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="text-sm font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
