import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Phone,
    Mail,
    LayoutGrid,
    List as ListIcon,
    TrendingUp,
    Users,
    Clock,
    ShieldCheck,
    Edit2,
    ShieldOff,
    Trash2
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    role: string;
    department: 'Field Ops' | 'Management' | 'Sales' | 'Admin';
    status: 'active' | 'on-leave' | 'inactive';
    clockStatus: 'clocked-in' | 'clocked-out' | 'break';
    efficiency?: number;
    email: string;
    phone: string;
    location: string;
    certifications: { name: string; status: 'valid' | 'expiring' | 'expired' }[];
    imgUrl: string;
    joinDate: string;
}

import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ... (imports remain)

import AddEmployeeModal from '../../components/dashboard/employees/AddEmployeeModal';

const Employees = () => {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchEmployees = async () => {
        if (!user) return;
        try {
            // Get Org ID
            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) {
                setLoading(false);
                return;
            }
            const orgId = profile.organization_id;

            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('id, name, role, department, email, phone, avatar_url, created_at')
                .eq('organization_id', orgId);

            if (error) throw error;

            if (profiles) {
                const mappedEmployees: Employee[] = profiles.map((p: any) => ({
                    id: p.id,
                    name: p.name || 'Unknown User',
                    role: p.role ? p.role.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Associate',
                    department: p.department || 'Field Ops', // specific types might mismatch, casting for now
                    status: 'active', // Default
                    clockStatus: 'clocked-out', // Default
                    efficiency: p.efficiency, // Undefined if not in schema
                    email: p.email || 'N/A',
                    phone: p.phone || 'N/A',
                    location: p.location || 'Remote',
                    certifications: [], // Empty for now
                    imgUrl: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'User')}&background=random`,
                    joinDate: new Date(p.created_at).toLocaleDateString()
                }));
                setEmployees(mappedEmployees);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Employees
    useEffect(() => {
        fetchEmployees();
    }, [user]);

    // Metrics Calculation
    const totalEmployees = employees.length;
    const activeNow = employees.filter(e => e.clockStatus === 'clocked-in').length;
    const avgEfficiency = totalEmployees > 0
        ? Math.round(employees.reduce((acc, curr) => acc + (curr.efficiency || 0), 0) / totalEmployees)
        : 0;
    const expiringCerts = employees.filter(e => e.certifications.some(c => c.status === 'expiring' || c.status === 'expired')).length;

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#151210]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#de5c1b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading team...</p>
                </div>
            </div>
        );
    }

    // Filter Logic
    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'All' || emp.department === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-8 min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Team Command Center</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your workforce, track performance, and monitor active status.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#de5c1b] hover:bg-[#c94e10] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-[#de5c1b]/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Talent
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Headcount"
                    value={totalEmployees.toString()}
                    trend="+2 this month"
                    icon={Users}
                    color="blue"
                />
                <KPICard
                    title="Active Now"
                    value={activeNow.toString()}
                    subtext={`${Math.round((activeNow / totalEmployees) * 100)}% coverage`}
                    icon={Clock}
                    color="emerald"
                    active
                />
                <KPICard
                    title="Avg Efficiency"
                    value={`${avgEfficiency}%`}
                    trend="+4.2% vs last week"
                    icon={TrendingUp}
                    color="orange"
                />
                <KPICard
                    title="Compliance Alert"
                    value={expiringCerts.toString()}
                    subtext="Certs expiring soon"
                    icon={ShieldCheck}
                    color="red"
                    alert={expiringCerts > 0}
                />
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white dark:bg-[#1c1917] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#de5c1b]/50 transition-all text-slate-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="appearance-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300"
                        >
                            <option value="All">All Departments</option>
                            <option value="Field Ops">Field Ops</option>
                            <option value="Management">Management</option>
                            <option value="Sales">Sales</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="flex bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#2c2420] text-[#de5c1b] shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Employee Grid/List View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEmployees.map(emp => (
                        <EmployeeCard key={emp.id} employee={emp} onAction={fetchEmployees} />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1c1917] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Employee</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Role & Dept</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Efficiency</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Contact</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(emp => (
                                <EmployeeRow key={emp.id} employee={emp} onAction={fetchEmployees} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AddEmployeeModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={() => {
                    fetchEmployees();
                    setShowAddModal(false);
                }}
            />
        </div>
    );
};

// Sub-components

const KPICard = ({ title, value, trend, subtext, icon: Icon, color, active, alert }: any) => (
    <div className={`bg-white dark:bg-[#1c1917] border ${alert ? 'border-red-500/50 dark:border-red-500/30 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-white/10'} rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group`}>
        {active && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 m-3 animate-pulse"></div>}
        <div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${color === 'orange' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : color === 'emerald' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        </div>
        <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
            {trend && <p className="text-xs font-medium text-emerald-500 mt-1">{trend}</p>}
            {subtext && <p className="text-xs font-medium text-slate-400 mt-1">{subtext}</p>}
        </div>
    </div>
);

const EmployeeActionMenu = ({ employee, onAction }: { employee: Employee, onAction: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRemove = async () => {
        setIsOpen(false);
        if (!confirm(`Are you sure you want to remove ${employee.name} from the team?`)) return;
        try {
            const { error } = await (supabase as any).from('profiles').update({ organization_id: null }).eq('id', employee.id);
            if (error) throw error;
            toast.success(`${employee.name} has been removed.`);
            onAction();
        } catch (err: any) {
            toast.error(err.message || 'Failed to remove employee');
        }
    };

    return (
        <div className="relative" ref={menuRef} onClick={e => e.stopPropagation()}>
            <button
                className="text-slate-400 hover:text-[#de5c1b] p-1 rounded-md transition-colors cursor-pointer"
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
            >
                <MoreVertical className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-8 mt-1 w-48 bg-white dark:bg-[#1c1917] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => { setIsOpen(false); toast.success('Edit options coming soon!', { icon: '🚧' }); }} className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Edit2 className="w-4 h-4" /> Edit Details
                    </button>
                    <button onClick={() => { setIsOpen(false); toast.success('Status options coming soon!', { icon: '🚧' }); }} className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 text-amber-600 dark:text-amber-500">
                        <ShieldOff className="w-4 h-4" /> Deactivate
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-white/10 my-1"></div>
                    <button onClick={handleRemove} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Trash2 className="w-4 h-4" /> Remove User
                    </button>
                </div>
            )}
        </div>
    );
};

const EmployeeCard = ({ employee, onAction }: { employee: Employee, onAction: () => void }) => (
    <div className="bg-white dark:bg-[#1c1917] border border-slate-200 dark:border-white/10 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-[#de5c1b]/30 transition-all group relative overflow-hidden">
        <div className="absolute top-4 right-4">
            <EmployeeActionMenu employee={employee} onAction={onAction} />
        </div>

        <div className="flex items-start gap-4">
            <div className="relative">
                <img src={employee.imgUrl} alt={employee.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 dark:border-white/10" />
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1c1917] ${employee.clockStatus === 'clocked-in' ? 'bg-emerald-500' : employee.status === 'on-leave' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#de5c1b] transition-colors">{employee.name}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{employee.role}</p>
                <span className="text-xs font-bold py-0.5 px-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 mt-1 inline-block">{employee.department}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-100 dark:border-white/5">
            <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Efficiency</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#de5c1b]" style={{ width: `${employee.efficiency || 0}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{employee.efficiency !== undefined ? `${employee.efficiency}%` : 'N/A'}</span>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Certs</p>
                <div className="flex -space-x-1 mt-1">
                    {employee.certifications.length > 0 ? employee.certifications.map((cert, i) => (
                        <div key={i} title={cert.name} className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-white dark:border-[#1c1917] ${cert.status === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                            {cert.name[0]}
                        </div>
                    )) : <span className="text-xs text-slate-400">None</span>}
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
            <button
                onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${employee.phone}`; }}
                className="flex-1 py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-[#de5c1b] transition-colors font-medium border border-transparent hover:border-[#de5c1b]/20"
            >
                <Phone className="w-4 h-4" /> Call
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${employee.email}`; }}
                className="flex-1 py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-[#de5c1b] transition-colors font-medium border border-transparent hover:border-[#de5c1b]/20"
            >
                <Mail className="w-4 h-4" /> Msg
            </button>
        </div>
    </div >
);

const EmployeeRow = ({ employee, onAction }: { employee: Employee, onAction: () => void }) => (
    <tr className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
        <td className="p-4">
            <div className="flex items-center gap-3">
                <img src={employee.imgUrl} alt={employee.name} className="w-9 h-9 rounded-full object-cover" />
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-[#de5c1b] transition-colors">{employee.name}</span>
            </div>
        </td>
        <td className="p-4">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{employee.role}</span>
                <span className="text-xs text-slate-400">{employee.department}</span>
            </div>
        </td>
        <td className="p-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${employee.clockStatus === 'clocked-in'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${employee.clockStatus === 'clocked-in' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                {employee.clockStatus === 'clocked-in' ? 'Active' : 'Offline'}
            </span>
        </td>
        <td className="p-4">
            <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">{employee.efficiency}%</span>
                <div className="w-16 h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#de5c1b]" style={{ width: `${employee.efficiency}%` }}></div>
                </div>
            </div>
        </td>
        <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
            <div className="flex items-center gap-3">
                <Phone
                    onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${employee.phone}`; }}
                    className="w-4 h-4 hover:text-[#de5c1b] cursor-pointer"
                />
                <Mail
                    onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${employee.email}`; }}
                    className="w-4 h-4 hover:text-[#de5c1b] cursor-pointer"
                />
            </div>
        </td>
        <td className="p-4 text-right">
            <EmployeeActionMenu employee={employee} onAction={onAction} />
        </td>
    </tr>
);

export default Employees;
