import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Star, Zap, ChevronLeft, Rocket } from 'lucide-react';

const UpgradeRequired = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = (location.state as any)?.from?.pathname || '/dashboard';

    const plans = [
        {
            name: 'Solo',
            price: '$40',
            description: 'For the individual professional',
            icon: Zap,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            features: [
                'Advanced Scheduling',
                'Financial Tracking',
                'Personal Digital Vault',
                'Standard Analytics'
            ]
        },
        {
            name: 'Business',
            price: '$70',
            description: 'Scalable team management',
            icon: Star,
            color: 'text-[#de5c1b]',
            bgColor: 'bg-[#de5c1b]/10',
            popular: true,
            features: [
                'Full Branding Studio',
                'Employee Management',
                'Aegis AI Coaching',
                'Org-wide Digital Vault',
                'White-label Communication'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8f6f6] dark:bg-[#151210] font-display flex flex-col">
            <header className="p-6">
                <button
                    onClick={() => navigate(returnTo)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#de5c1b] transition-colors font-bold text-sm uppercase tracking-widest"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-6xl mx-auto w-full">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#de5c1b]/10 text-[#de5c1b] font-bold text-xs uppercase tracking-[0.2em] mb-4">
                        <Shield className="w-4 h-4" />
                        Premium Feature
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                        Elevate Your <span className="text-[#de5c1b]">WorkForce</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
                        The feature you're trying to access is part of our professional tiers. Upgrade now to scale your business with advanced tools.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white dark:bg-[#1c1917] rounded-3xl p-8 border-2 transition-all hover:scale-[1.02] ${plan.popular ? 'border-[#de5c1b] shadow-2xl shadow-[#de5c1b]/10' : 'border-gray-100 dark:border-white/5 shadow-xl'}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#de5c1b] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-4 rounded-2xl ${plan.bgColor} ${plan.color}`}>
                                    <plan.icon className="w-8 h-8" />
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                                    <span className="text-gray-500 text-sm font-bold tracking-widest uppercase block mt-1">/ Month</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                            <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                                        <div className={`p-0.5 rounded-full ${plan.bgColor} ${plan.color}`}>
                                            <Shield className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => navigate('/settings', { state: { upgradeTo: plan.name } })}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${plan.popular ? 'bg-[#de5c1b] text-white shadow-lg shadow-[#de5c1b]/30 hover:bg-[#de5c1b]/90' : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10'}`}
                            >
                                Get {plan.name}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Trusted by over 10,000+ professionals worldwide</p>
                    <div className="flex items-center justify-center gap-8 opacity-30 grayscale contrast-125">
                        <Shield className="w-8 h-8" />
                        <Star className="w-8 h-8" />
                        <Rocket className="w-8 h-8" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UpgradeRequired;
