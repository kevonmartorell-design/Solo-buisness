import { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, PieChart, Plus, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Financials = () => {
    const sb = supabase as SupabaseClient<any, "public", any>;
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'payroll'>('overview');
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [revenue, setRevenue] = useState(0);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [newExpense, setNewExpense] = useState({
        category: 'Supplies',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    // Payroll State
    const [employees, setEmployees] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [payrollPeriod, setPayrollPeriod] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [payrollRuns, setPayrollRuns] = useState<any[]>([]);

    useEffect(() => {
        fetchFinancialData();
    }, [user, payrollPeriod]);

    const fetchFinancialData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: profile } = await sb
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (profile?.organization_id) {
                const orgId = profile.organization_id;

                // Fetch Expenses
                const { data: expenseData } = await sb
                    .from('expenses')
                    .select('*')
                    .eq('organization_id', orgId)
                    .order('date', { ascending: false });
                setExpenses(expenseData || []);

                // Fetch Revenue (Bookings)
                const { data: bookings } = await sb
                    .from('bookings')
                    .select('service:services(price)')
                    .eq('organization_id', orgId)
                    .eq('status', 'completed');

                const totalRevenue = bookings?.reduce((sum: number, b: any) => sum + (Number(b.service?.price) || 0), 0) || 0;
                setRevenue(totalRevenue);

                // Fetch Employees
                const { data: emps } = await sb
                    .from('profiles')
                    .select('*')
                    .eq('organization_id', orgId);
                setEmployees(emps || []);

                // Fetch Assignments + Shifts for Payroll
                const { data: assignData } = await sb
                    .from('assignments')
                    .select(`
                        *,
                        shift:shifts (*)
                    `)
                    .eq('organization_id', orgId)
                    .gte('created_at', payrollPeriod.start)
                    .lte('created_at', payrollPeriod.end);

                setAssignments(assignData || []);

                // Fetch Payroll Runs
                const { data: runs } = await sb
                    .from('payroll_runs')
                    .select('*')
                    .eq('organization_id', orgId)
                    .order('created_at', { ascending: false });
                setPayrollRuns(runs || []);
            }
        } catch (error) {
            console.error('Error fetching financials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async () => {
        if (!newExpense.amount || !newExpense.description) return;
        try {
            const { data: profile } = await supabase.auth.getUser();
            if (!profile.user) return;

            const { data: userProfile } = await sb
                .from('profiles')
                .select('organization_id')
                .eq('id', profile.user.id)
                .single();

            if (userProfile?.organization_id) {
                const { error } = await sb.from('expenses').insert({
                    organization_id: userProfile.organization_id,
                    ...newExpense,
                    amount: Number(newExpense.amount)
                });

                if (error) throw error;
                setShowAddExpense(false);
                setNewExpense({ category: 'Supplies', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
                fetchFinancialData();
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            toast.error('Failed to add expense');
        }
    };

    const handleDeleteExpense = async (id: string) => {
        if (confirm('Delete this expense?')) {
            await sb.from('expenses').delete().eq('id', id);
            fetchFinancialData();
        }
    };

    const calculatePayroll = () => {
        // Group assignments by employee
        const payrollMap: { [key: string]: any } = {};

        assignments.forEach(assign => {
            const empId = assign.employee_id;
            const shift = assign.shift;

            if (!shift) return;

            // Calculate hours from shift duration
            const start = new Date(shift.start_time);
            const end = new Date(shift.end_time);
            const hours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
            const rate = Number(shift.pay_rate) || 20; // Default $20 if not set
            const total = hours * rate;

            if (!payrollMap[empId]) {
                const emp = employees.find(e => e.id === empId);
                payrollMap[empId] = {
                    id: empId,
                    name: emp?.full_name || emp?.email || 'Unknown',
                    hours: 0,
                    total: 0,
                    rate: rate // Keep last rate for display
                };
            }

            payrollMap[empId].hours += hours;
            payrollMap[empId].total += total;
        });

        return Object.values(payrollMap);
    };

    const runPayroll = async () => {
        if (!confirm('Process payroll for this period?')) return;
        try {
            const { data: profile } = await supabase.auth.getUser();
            const { data: userProfile } = await sb
                .from('profiles')
                .select('organization_id')
                .eq('id', profile.user?.id || '')
                .single();

            if (userProfile?.organization_id) {
                const payrollItems = calculatePayroll();
                const total = payrollItems.reduce((sum, emp) => sum + emp.total, 0);

                if (total === 0) {
                    toast.error('No payroll data for this period.');
                    return;
                }

                const { error } = await sb.from('payroll_runs').insert({
                    organization_id: userProfile.organization_id,
                    pay_period_start: payrollPeriod.start,
                    pay_period_end: payrollPeriod.end,
                    total_amount: total,
                    status: 'paid',
                    processed_by: profile.user?.id
                });

                if (error) throw error;
                toast.success('Payroll processed successfully!');
                fetchFinancialData();
            }
        } catch (error) {
            console.error('Error processing payroll:', error);
            toast.error('Failed to process payroll');
        }
    };

    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const netProfit = revenue - totalExpenses;

    if (loading) return <div className="p-8 text-gray-500">Loading financials...</div>;

    return (
        <div className="p-6 space-y-6 bg-[#f8f6f6] dark:bg-[#211611] min-h-screen text-gray-900 dark:text-gray-100 font-display">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tight">Financials & Payroll</h1>
                    <p className="text-sm text-gray-500">Manage revenue, expenses, and team payments</p>
                </div>
                <div className="flex gap-2">
                    {['overview', 'expenses', 'payroll'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === tab
                                ? 'bg-[#de5c1b] text-white'
                                : 'bg-white dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-500/20 text-green-500 rounded-xl"><DollarSign className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Total Revenue</p>
                                    <p className="text-2xl font-bold">${revenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-red-500/20 text-red-500 rounded-xl"><PieChart className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Total Expenses</p>
                                    <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-[#de5c1b]/20 text-[#de5c1b] rounded-xl"><DollarSign className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Net Profit</p>
                                    <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        ${netProfit.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPENSES TAB */}
            {activeTab === 'expenses' && (
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Expense Log</h3>
                        <button
                            onClick={() => setShowAddExpense(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-[#de5c1b] text-white rounded-lg text-xs font-bold uppercase hover:bg-[#de5c1b]/90"
                        >
                            <Plus className="w-4 h-4" /> Add Expense
                        </button>
                    </div>

                    {showAddExpense && (
                        <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                    className="w-full p-2 rounded bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                                <select
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                    className="w-full p-2 rounded bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10"
                                >
                                    {['Supplies', 'Rent', 'Utilities', 'Marketing', 'Software', 'Other'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    placeholder="e.g. Office chairs"
                                    className="w-full p-2 rounded bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Amount ($)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        className="w-full p-2 rounded bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10"
                                    />
                                    <button onClick={handleAddExpense} className="p-2 bg-green-500 text-white rounded hover:bg-green-600"><Plus className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Category</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {expenses.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No expenses recorded.</td></tr>
                            ) : (
                                expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4">{expense.date}</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-xs font-bold">{expense.category}</span></td>
                                        <td className="px-6 py-4">{expense.description}</td>
                                        <td className="px-6 py-4 text-right font-mono">${Number(expense.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* PAYROLL TAB */}
            {activeTab === 'payroll' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="font-bold text-lg mb-2">Run Payroll</h3>
                                <div className="flex gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={payrollPeriod.start}
                                            onChange={(e) => setPayrollPeriod({ ...payrollPeriod, start: e.target.value })}
                                            className="p-2 rounded bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={payrollPeriod.end}
                                            onChange={(e) => setPayrollPeriod({ ...payrollPeriod, end: e.target.value })}
                                            className="p-2 rounded bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={runPayroll}
                                className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all flex items-center gap-2"
                            >
                                <DollarSign className="w-5 h-5" /> Process Payroll
                            </button>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">Employee</th>
                                    <th className="px-4 py-3 text-right">Hours</th>
                                    <th className="px-4 py-3 text-right">Rate</th>
                                    <th className="px-4 py-3 text-right">Gross Pay</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {calculatePayroll().map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="px-4 py-3 font-medium">{emp.name}</td>
                                        <td className="px-4 py-3 text-right">{emp.hours.toFixed(1)} hrs</td>
                                        <td className="px-4 py-3 text-right">${emp.rate}/hr</td>
                                        <td className="px-4 py-3 text-right font-bold text-green-500">${emp.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10">
                        <h3 className="font-bold text-lg mb-4">Payroll History</h3>
                        <div className="space-y-3">
                            {payrollRuns.length === 0 ? (
                                <p className="text-gray-500 text-sm">No previous payroll runs.</p>
                            ) : (
                                payrollRuns.map(run => (
                                    <div key={run.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                                            <div>
                                                <p className="font-bold text-sm">Payroll Run</p>
                                                <p className="text-xs text-gray-500">{run.pay_period_start} - {run.pay_period_end}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-500">${Number(run.total_amount).toLocaleString()}</p>
                                            <p className="text-xs text-gray-400 uppercase font-bold">{run.status}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Financials;
