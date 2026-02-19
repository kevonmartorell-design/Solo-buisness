import React from 'react';
import { Check, X, Star, Shield, Zap } from 'lucide-react';
import type { Tier } from '../../../contexts/AuthContext';

interface TierUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (tier: Tier) => void;
    currentTier: Tier;
    targetTier: Tier;
}

const TierUpgradeModal: React.FC<TierUpgradeModalProps> = ({ isOpen, onClose, onConfirm, currentTier, targetTier }) => {
    if (!isOpen) return null;

    const plans = {
        Free: {
            icon: Shield,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
            borderColor: 'border-gray-500/20',
            features: [
                'Basic Scheduling',
                'Client Management',
                'General Analytics'
            ]
        },
        Solo: {
            icon: Zap,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            features: [
                'Advanced Scheduling',
                'Financial Tracking',
                'Digital Vault (Personal)',
                'Priority Support'
            ]
        },
        Business: {
            icon: Star,
            color: 'text-[#de5c1b]',
            bgColor: 'bg-[#de5c1b]/10',
            borderColor: 'border-[#de5c1b]/20',
            features: [
                'Full Branding Studio',
                'Employee Management & Payroll',
                'Aegis AI Business Coaching',
                'Digital Vault (Organization)',
                'White-label Communication'
            ]
        }
    };

    const targetPlan = plans[targetTier];
    const isUpgrade = (currentTier === 'Free') || (currentTier === 'Solo' && targetTier === 'Business');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1c1917] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-300">
                {/* Header Image/Icon Section */}
                <div className={`${targetPlan.bgColor} p-8 flex flex-col items-center justify-center relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4">
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className={`p-4 rounded-2xl bg-white dark:bg-[#1c1917] shadow-xl mb-4 ${targetPlan.color}`}>
                        <targetPlan.icon className="w-10 h-10" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isUpgrade ? 'Upgrade to' : 'Switch to'} {targetTier}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Unlock the full power of WorkForce</p>
                </div>

                <div className="p-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">What's Included</h3>
                    <div className="space-y-3 mb-8">
                        {targetPlan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className={`mt-0.5 p-0.5 rounded-full ${targetPlan.bgColor} ${targetPlan.color}`}>
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => onConfirm(targetTier)}
                            className="w-full py-4 bg-[#de5c1b] text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#de5c1b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Confirm {isUpgrade ? 'Upgrade' : 'Switch'}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold uppercase tracking-widest text-xs transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>

                    <p className="text-[10px] text-center text-slate-400 mt-4">
                        By confirming, your organization's tier will be updated immediately.
                        Billing will be adjusted in your next cycle.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TierUpgradeModal;
