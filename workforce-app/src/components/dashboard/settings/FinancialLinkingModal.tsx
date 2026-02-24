import { useState } from 'react';
import { Landmark, CreditCard, ChevronRight, X, Loader2, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock list of popular banks
const POPULAR_BANKS = [
    { id: 'chase', name: 'Chase', logo: '🏦' },
    { id: 'bofa', name: 'Bank of America', logo: '🏛️' },
    { id: 'wells', name: 'Wells Fargo', logo: '🐎' },
    { id: 'citi', name: 'Citi', logo: '💳' },
    { id: 'usbank', name: 'US Bank', logo: '🛡️' },
    { id: 'pnc', name: 'PNC', logo: '🏦' },
];

export interface LinkedAccount {
    id: string;
    type: 'bank' | 'card';
    name: string;
    desc: string;
    icon: string;
    color: string;
}

interface FinancialLinkingModalProps {
    onClose: () => void;
    onAdd: (account: Omit<LinkedAccount, 'id'>) => void;
}

const FinancialLinkingModal = ({ onClose, onAdd }: FinancialLinkingModalProps) => {
    const [step, setStep] = useState<'type' | 'bank_list' | 'bank_connecting' | 'bank_success' | 'card_form'>('type');

    // For bank connection flow
    const [selectedBank, setSelectedBank] = useState<{ name: string, logo: string } | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // For card connection flow
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [isSavingCard, setIsSavingCard] = useState(false);

    const handleBankSelect = (bank: typeof POPULAR_BANKS[0]) => {
        setSelectedBank(bank);
        setStep('bank_connecting');
        setIsConnecting(true);

        // Simulate secure connection process
        setTimeout(() => {
            setIsConnecting(false);
            setStep('bank_success');
        }, 2000);
    };

    const handleBankSuccess = () => {
        if (!selectedBank) return;
        onAdd({
            type: 'bank',
            name: selectedBank.name,
            desc: 'Main Checking (...4291)',
            icon: 'Landmark',
            color: 'blue'
        });
    };

    const handleCardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingCard(true);

        // Simulate card validation & save
        setTimeout(() => {
            setIsSavingCard(false);
            // Default to Visa/Mastercard style naming based on what they typed, or just generic
            const last4 = cardDetails.number.slice(-4) || '1234';
            onAdd({
                type: 'card',
                name: 'Corporate Card',
                desc: `Credit Line (...${last4})`,
                icon: 'CreditCard',
                color: 'green'
            });
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-[#211611] rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 w-full max-w-md overflow-hidden relative"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
                <h3 className="font-bold text-gray-900 dark:text-white">Add Institution</h3>
                <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">

                    {/* Step 1: Account Type Selection */}
                    {step === 'type' && (
                        <motion.div
                            key="type"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <p className="text-sm text-gray-500 mb-4">How would you like to link your finances?</p>

                            <button
                                onClick={() => setStep('bank_list')}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-[#de5c1b] transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500">
                                        <Landmark className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#de5c1b] transition-colors">Bank Account</p>
                                        <p className="text-xs text-gray-500">Connect via Plaid securely</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#de5c1b] transition-colors" />
                            </button>

                            <button
                                onClick={() => setStep('card_form')}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-[#de5c1b] transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#de5c1b] transition-colors">Credit/Debit Card</p>
                                        <p className="text-xs text-gray-500">Enter card details directly</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#de5c1b] transition-colors" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Bank Selection */}
                    {step === 'bank_list' && (
                        <motion.div
                            key="bank_list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Connection
                            </div>
                            <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Select your institution</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {POPULAR_BANKS.map(bank => (
                                    <button
                                        key={bank.id}
                                        onClick={() => handleBankSelect(bank)}
                                        className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-white/10 hover:border-[#de5c1b] transition-all"
                                    >
                                        <span className="text-2xl">{bank.logo}</span>
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{bank.name}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                className="w-full mt-4 flex items-center justify-center p-3 text-sm text-gray-500 hover:text-[#de5c1b] border border-dashed border-gray-300 dark:border-white/10 rounded-xl"
                            >
                                <Building className="w-4 h-4 mr-2" />
                                Search for other institutions...
                            </button>
                        </motion.div>
                    )}

                    {/* Step 3: Bank Connecting Spinner */}
                    {step === 'bank_connecting' && (
                        <motion.div
                            key="bank_connecting"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <div className="relative mb-6 text-4xl">
                                {selectedBank?.logo}
                                <div className="absolute -right-2 -bottom-2 bg-white dark:bg-[#211611] rounded-full p-1 border border-gray-100 dark:border-white/10">
                                    <Loader2 className="w-5 h-5 text-[#de5c1b] animate-spin" />
                                </div>
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Connecting securely to {selectedBank?.name}</h4>
                            <p className="text-sm text-gray-500">Please do not close this window...</p>
                        </motion.div>
                    )}

                    {/* Step 4: Bank Success */}
                    {step === 'bank_success' && (
                        <motion.div
                            key="bank_success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8 text-center"
                        >
                            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Connection Successful</h4>
                            <p className="text-sm text-gray-500 mb-8">Your account with {selectedBank?.name} has been securely linked.</p>
                            <button
                                onClick={handleBankSuccess}
                                className="px-8 py-3 bg-[#de5c1b] text-white rounded-xl font-bold hover:bg-[#de5c1b]/90 transition-colors w-full"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {/* Step 3 Alt: Card Form */}
                    {step === 'card_form' && (
                        <motion.div
                            key="card_form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Bank-grade encryption
                            </div>
                            <form onSubmit={handleCardSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name on Card</label>
                                    <input
                                        type="text"
                                        required
                                        value={cardDetails.name}
                                        onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                        placeholder="Kevon Martorell"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={cardDetails.number}
                                        onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                        maxLength={16}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none tracking-widest"
                                        placeholder="0000 0000 0000 0000"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry (MM/YY)</label>
                                        <input
                                            type="text"
                                            required
                                            value={cardDetails.expiry}
                                            onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                            maxLength={5}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                            placeholder="12/26"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                                        <input
                                            type="text"
                                            required
                                            value={cardDetails.cvc}
                                            onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                            maxLength={4}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-[#de5c1b] outline-none"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSavingCard || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc}
                                        className="w-full py-4 bg-[#de5c1b] text-white rounded-xl font-bold uppercase tracking-wider text-sm flex justify-center items-center disabled:opacity-50 transition-colors"
                                    >
                                        {isSavingCard ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Card & Continue'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default FinancialLinkingModal;
