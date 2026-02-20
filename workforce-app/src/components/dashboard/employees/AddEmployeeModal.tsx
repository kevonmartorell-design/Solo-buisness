import { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Team Member',
        department: 'Field Ops',
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!user?.id) {
                throw new Error('User not authenticated');
            }

            // 1. Get current user's org ID
            const { data: profileData } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            const profile = profileData as { organization_id: string } | null;

            if (!profile?.organization_id) {
                throw new Error('Organization not found');
            }

            // 2. Attempt to create profile directly
            // Note: This might fail if RLS or FK constraints require an auth.users record first.
            // In a real app, you'd likely use an invite system (supabase.auth.admin.inviteUserByEmail)
            // or a database function that handles the auth user creation.
            // For now, we will try to insert into profiles.

            const fullName = `${formData.firstName} ${formData.lastName}`.trim();

            const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                    // Generate a random ID since we can't create an auth user from client easily without admin SDK
                    // In production, this ID should come from auth.users
                    id: crypto.randomUUID(),
                    organization_id: profile.organization_id,
                    name: fullName,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                    department: formData.department,

                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                } as any);

            if (insertError) {
                // If the error is related to foreign key constraint on auth.users (likely),
                // we need to inform the user.
                if (insertError.code === '23503') { // foreign_key_violation
                    throw new Error('Cannot create employee without a registered user account. Invite system coming soon.');
                }
                throw insertError;
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error adding employee:', err);
            setError(err.message || 'Failed to add employee');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#211611] rounded-2xl shadow-2xl border border-[#de5c1b]/20 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#de5c1b]/10 rounded-lg">
                            <UserPlus className="w-5 h-5 text-[#de5c1b]" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Team Member</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                            <input
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="e.g. John"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] focus:border-transparent outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                            <input
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="e.g. Doe"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] focus:border-transparent outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] focus:border-transparent outline-none transition-all dark:text-white"
                            >
                                <option value="Team Member">Team Member</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                                <option value="Contractor">Contractor</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] focus:border-transparent outline-none transition-all dark:text-white"
                            >
                                <option value="Field Ops">Field Ops</option>
                                <option value="Management">Management</option>
                                <option value="Sales">Sales</option>
                                <option value="Admin">Admin</option>
                                <option value="Support">Support</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john.doe@company.com"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#de5c1b] focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-white/10 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-[#de5c1b] hover:bg-[#c94e10] text-white font-bold shadow-lg shadow-[#de5c1b]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Add Talent
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
