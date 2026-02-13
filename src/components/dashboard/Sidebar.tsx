
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import { useSidebar } from '../../contexts/SidebarContext';
import { useBranding } from '../../contexts/BrandingContext';

const Sidebar = () => {
    const { isSidebarOpen } = useSidebar();
    const { companyName, logoUrl } = useBranding();

    // ... navItems definition ...
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Vault', path: '/vault', icon: 'lock' },
        { name: 'Schedule', path: '/schedule', icon: 'calendar_today' },
        { name: 'Employees', path: '/employees', icon: 'group' },
        { name: 'Analytics', path: '/analytics', icon: 'bar_chart' },
        { name: 'Clients', path: '/clients', icon: 'handshake' },
        { name: 'Services & Products', path: '/services', icon: 'inventory_2' },
        { name: 'Profile', path: '/profile', icon: 'account_circle' },
        { name: 'Settings', path: '/settings', icon: 'settings' },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-full w-72 bg-[#1c1917] border-r border-white/5 flex flex-col shadow-2xl z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex items-center gap-3 border-b border-primary/5">
                {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <span className="material-symbols-outlined text-primary text-sm">person</span>
                    </div>
                )}
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
