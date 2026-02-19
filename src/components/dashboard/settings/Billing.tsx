import { useState, useEffect } from 'react';
import { CreditCard, ExternalLink, ShieldCheck, Zap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const Billing = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [billingInfo, setBillingInfo] = useState<{
        status: string;
        tier: string;
        next_billing_date: string | null;
        customer_id: string | null;
    } | null>(null);

    useEffect(() => {
        const fetchBilling = async () => {
            if (!user) return;
            try {
                const { data: profile } = await (supabase as any)
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                if (profile?.organization_id) {
                    const { data: org } = await (supabase as any)
                        .from('organizations')
                        .select('tier, subscription_status, subscription_period_end, stripe_customer_id')
                        .eq('id', profile.organization_id)
                        .single();

                    if (org) {
                        setBillingInfo({
                            status: org.subscription_status || 'active', // Default to active for demo/free
                            tier: org.tier,
                            next_billing_date: org.subscription_period_end,
                            customer_id: org.stripe_customer_id
                        });
                    }
                }
            } catch (err) {
                console.error('Error fetching billing info:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBilling();
    }, [user]);

    const handleManageSubscription = async () => {
        setActionLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-portal-link');
            if (error) throw error;
            if (data?.url) window.location.href = data.url;
        } catch (err) {
            console.error('Portal error:', err);
            alert('Failed to open billing portal. Please contact support.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpgrade = async (tier: string) => {
        setActionLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { tier: tier.toLowerCase() }
            });
            if (error) throw error;
            if (data?.url) window.location.href = data.url;
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Failed to initiate checkout. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-[#de5c1b] animate-spin" />
            </div>
        );
    }

    const isSubscribed = billingInfo?.tier !== 'Free';

    return (
        <div className="space-y-6">
            {/* Current Plan Card */}
            <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#de5c1b]/10 p-3 rounded-xl text-[#de5c1b]">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Your Plan</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                                    {billingInfo?.tier || 'Free'} Plan
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${billingInfo?.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                {billingInfo?.status || 'Active'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#de5c1b] mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Full Access to {billingInfo?.tier === 'business' ? 'All Features' : 'Core Tools'}</p>
                                    <p className="text-xs text-gray-500">Includes {billingInfo?.tier === 'business' ? 'priority support' : 'standard features'}.</p>
                                </div>
                            </div>
                            {billingInfo?.next_billing_date && (
                                <div className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-[#de5c1b] mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Next Billing Date</p>
                                        <p className="text-xs text-gray-500">{new Date(billingInfo.next_billing_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 flex flex-col justify-center border border-gray-100 dark:border-white/5">
                            <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium">•••• 4242</span>
                                </div>
                                <button
                                    onClick={handleManageSubscription}
                                    disabled={actionLoading}
                                    className="text-xs font-bold text-[#de5c1b] hover:underline flex items-center gap-1"
                                >
                                    Change <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-white/10">
                    <p className="text-xs text-gray-500 max-w-[60%]">
                        {isSubscribed
                            ? "Your subscription will automatically renew. You can cancel or change plans anytime."
                            : "Unlock the full power of WorkForce App with a Solo or Business plan."
                        }
                    </p>
                    {isSubscribed ? (
                        <button
                            onClick={handleManageSubscription}
                            disabled={actionLoading}
                            className="bg-white dark:bg-white/10 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            {actionLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                            Manage Billing
                        </button>
                    ) : (
                        <button
                            onClick={() => handleUpgrade('solo')}
                            disabled={actionLoading}
                            className="bg-[#de5c1b] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-[#de5c1b]/20 hover:bg-[#de5c1b]/90 transition-colors flex items-center gap-2"
                        >
                            {actionLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                            Upgrade Now
                        </button>
                    )}
                </div>
            </div>

            {/* Invoices Mockup */}
            <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Billing History</h3>
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="divide-y divide-gray-100 dark:divide-white/10">
                    {[
                        { date: 'Oct 1, 2023', amount: '$70.00', status: 'Paid', id: 'INV-001' },
                        { date: 'Sep 1, 2023', amount: '$70.00', status: 'Paid', id: 'INV-002' },
                    ].map((inv) => (
                        <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div>
                                <p className="text-sm font-bold">{inv.date}</p>
                                <p className="text-xs text-gray-500">{inv.id}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono font-bold">{inv.amount}</span>
                                <button className="text-[#de5c1b] p-1.5 hover:bg-[#de5c1b]/10 rounded-lg transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Billing;
