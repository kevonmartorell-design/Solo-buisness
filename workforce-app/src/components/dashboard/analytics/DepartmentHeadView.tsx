
import { useEffect, useState } from 'react';
import {
    Activity,
    Clock,
    Target
} from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const DepartmentHeadView = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        efficiency: 0,
        avgServiceTime: 0,
        openTickets: 0
    });
    const [teamData, setTeamData] = useState<any[]>([]);
    const [deptName, setDeptName] = useState<string>('');

    useEffect(() => {
        const fetchDeptData = async () => {
            if (!user) return;

            try {
                // 1. Get User's Dept & Org
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('organization_id, department')
                    .eq('id', user.id)
                    .single();

                const profile = profileData as { organization_id: string; department: string } | null;

                if (!profile?.organization_id) {
                    setLoading(false);
                    return;
                }

                const dept = profile.department || 'Unassigned';
                setDeptName(dept);

                // 2. Fetch Team Members in Dept (for Leaderboard)
                const { data: teamMembersData } = await supabase
                    .from('profiles')
                    .select('id, name')
                    .eq('organization_id', profile.organization_id)
                    .eq('department', dept);

                const teamMembers = teamMembersData as { id: string; name: string }[] | null;

                // 3. Fetch Bookings for this Dept
                // Since we don't have a direct department filter on bookings, we filter by employees in that dept
                // OR if we had a view. For now, we'll fetch bookings where employee_id is in teamMembers list.

                let deptBookings: any[] = [];
                let openTicketsCount = 0;

                if (teamMembers && teamMembers.length > 0) {
                    const memberIds = teamMembers.map(m => m.id);
                    const { data: bookings } = await supabase
                        .from('bookings')
                        .select(`
                            id,
                            booking_datetime,
                            status,
                            employee_id,
                            service:services(duration)
                        `)
                        .in('employee_id', memberIds)
                        .neq('status', 'cancelled');

                    if (bookings) {
                        deptBookings = bookings;
                        openTicketsCount = bookings.filter((b: any) => b.status === 'pending' || b.status === 'confirmed').length; // 'confirmed' approx 'open' for now
                    }

                    // Calculate Team Efficiency (Mock Logic: Real duration vs Expected)
                    // We don't have real duration logged yet, so we'll mock variability based on bookings count
                    const teamStats = teamMembers.map(member => {
                        const memberBookings = deptBookings.filter((b: any) => b.employee_id === member.id);
                        const count = memberBookings.length;

                        // Mock Efficiency: Random between 85-98% if they have bookings, else 0
                        const efficiency = count > 0 ? Math.floor(Math.random() * (98 - 85 + 1) + 85) : 0;
                        const avgTime = count > 0 ? 45 + Math.floor(Math.random() * 10) : 0; // Mock avg time

                        return {
                            name: member.name,
                            efficiency,
                            avgTime
                        };
                    }).sort((a, b) => b.efficiency - a.efficiency);

                    setTeamData(teamStats);

                    // Overall Stats
                    const avgEff = teamStats.length > 0 ? teamStats.reduce((sum, t) => sum + t.efficiency, 0) / teamStats.length : 0;
                    const avgSvcTime = teamStats.length > 0 ? teamStats.reduce((sum, t) => sum + t.avgTime, 0) / teamStats.length : 0;

                    setStats({
                        efficiency: Math.round(avgEff),
                        avgServiceTime: Math.round(avgSvcTime),
                        openTickets: openTicketsCount
                    });
                } else {
                    // No team members in dept
                    setTeamData([]);
                    setStats({ efficiency: 0, avgServiceTime: 0, openTickets: 0 });
                }

            } catch (err) {
                console.error('Error fetching department data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeptData();
    }, [user]);

    if (loading) return <div className="p-10 text-center text-slate-500">Loading department analytics...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Dept Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnalyticsCard title="Team Efficiency" value={`${stats.efficiency}%`} trend={stats.efficiency > 0 ? "Stable" : "No Data"} icon={Activity} />
                <AnalyticsCard title="Avg Service Time" value={`${stats.avgServiceTime}m`} trend="Est." icon={Clock} inverseTrend />
                <AnalyticsCard title="Open Tickets" value={`${stats.openTickets}`} trend="Active" icon={Target} />
            </div>

            {/* Team Leaderboard */}
            <div className="bg-white dark:bg-[#1c1917] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Technician Efficiency Leaderboard</h3>
                    {deptName && <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-white/5 rounded text-slate-600 dark:text-slate-400">Department: {deptName}</span>}
                </div>
                <div className="overflow-x-auto">
                    {teamData.length > 0 && teamData.some(t => t.efficiency > 0) ? (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                <tr>
                                    <th className="px-4 py-3 font-bold text-slate-500">Employee</th>
                                    <th className="px-4 py-3 font-bold text-slate-500">Efficiency Score</th>
                                    <th className="px-4 py-3 font-bold text-slate-500">Avg Time</th>
                                    <th className="px-4 py-3 font-bold text-slate-500 text-right">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {teamData.map((emp, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{emp.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{emp.efficiency}%</span>
                                                <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${emp.efficiency > 90 ? 'bg-emerald-500' : emp.efficiency > 80 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${emp.efficiency}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{emp.avgTime}m</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${emp.efficiency > 90 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                emp.efficiency > 80 ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                                                    'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                                }`}>
                                                {emp.efficiency > 90 ? 'Excellent' : emp.efficiency > 80 ? 'Good' : 'Review'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-slate-400 italic">
                            <span className="mb-2">No active team data found for your department.</span>
                            <span className="text-xs">Ensure your profile has a department assigned and team members are active.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentHeadView;
