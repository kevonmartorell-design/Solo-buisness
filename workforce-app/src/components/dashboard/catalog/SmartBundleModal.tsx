import { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CatalogItem {
    id: string;
    name: string;
    price: number;
    category: string;
    imageColor: string;
}

interface SmartBundleModalProps {
    onClose: () => void;
    onSave: (bundleName: string, price: number, description: string) => void;
    services: CatalogItem[];
    products: CatalogItem[];
    industry: string;
}

export const SmartBundleModal = ({ onClose, onSave, services, products, industry }: SmartBundleModalProps) => {
    const [step, setStep] = useState<'analyzing' | 'result' | 'saving' | 'success'>('analyzing');
    const [generatedBundle, setGeneratedBundle] = useState<{
        items: CatalogItem[],
        originalPrice: number,
        bundlePrice: number,
        name: string,
        description: string
    } | null>(null);

    // AI Generation Simulation
    useEffect(() => {
        if (step !== 'analyzing') return;

        const timer = setTimeout(() => {
            // Very simple "AI" selection: grab the highest priced service and a random product (or highest priced product)
            let selectedService = services.length > 0 ? [...services].sort((a, b) => b.price - a.price)[0] : null;
            let selectedProduct = products.length > 0 ? [...products].sort((a, b) => b.price - a.price)[0] : null;

            // Fallbacks if lists are empty
            if (!selectedService) {
                selectedService = { id: 'mock-s', name: 'Signature Consultation', price: 150, category: 'General', imageColor: 'bg-emerald-100 text-emerald-600' };
            }
            if (!selectedProduct) {
                selectedProduct = { id: 'mock-p', name: 'Premium Care Kit', price: 45, category: 'Retail', imageColor: 'bg-blue-100 text-blue-600' };
            }

            const items = [selectedService, selectedProduct];
            const originalPrice = items.reduce((sum, item) => sum + item.price, 0);
            const discount = 0.15; // 15% off
            const bundlePrice = originalPrice * (1 - discount);

            setGeneratedBundle({
                items,
                originalPrice,
                bundlePrice,
                name: `The Essential ${industry} Bundle`,
                description: `A smart pairing of ${selectedService.name} with our ${selectedProduct.name} for optimal results at 15% off.`
            });

            setStep('result');
        }, 2500);

        return () => clearTimeout(timer);
    }, [step, services, products, industry]);

    const handleSave = () => {
        if (!generatedBundle) return;
        setStep('saving');

        // Simulating the save delay before triggering parent callback
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSave(generatedBundle.name, generatedBundle.bundlePrice, generatedBundle.description);
            }, 1500);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#211611] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#de5c1b]/20 w-full max-w-md overflow-hidden relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-[#de5c1b]/5 to-transparent">
                    <div className="flex items-center gap-2 text-[#de5c1b]">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-bold tracking-tight">AI Bundle Generator</h3>
                    </div>
                    {step !== 'saving' && step !== 'success' && (
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">

                        {/* Step 1: Analyzing spinner */}
                        {step === 'analyzing' && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center justify-center py-10 text-center"
                            >
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 rounded-full border-4 border-[#de5c1b]/20 flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-[#de5c1b] animate-pulse" />
                                    </div>
                                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-[#de5c1b] border-t-transparent animate-spin"></div>
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Analyzing Catalog Data...</h4>
                                <p className="text-sm text-gray-500">Finding the perfect automated pairing.</p>
                            </motion.div>
                        )}

                        {/* Step 2: Result Presentation */}
                        {step === 'result' && generatedBundle && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{generatedBundle.name}</h4>
                                    <p className="text-sm text-gray-500">{generatedBundle.description}</p>
                                </div>

                                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/10 space-y-3">
                                    {generatedBundle.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-white/10 last:border-0 last:pb-0">
                                            {item.imageColor && item.imageColor.startsWith('data:image') ? (
                                                <div className="w-12 h-12 rounded-lg flex-shrink-0 relative overflow-hidden">
                                                    <img src={item.imageColor} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className={`w-12 h-12 rounded-lg ${item.imageColor} flex items-center justify-center font-bold text-slate-400`}>
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#de5c1b]">${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-end justify-between px-2">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Value</p>
                                        <p className="text-sm font-bold text-slate-400 line-through">${generatedBundle.originalPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-[#de5c1b] uppercase tracking-widest mb-1">New Bundle Price</p>
                                        <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">
                                            ${generatedBundle.bundlePrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="w-full py-4 bg-[#de5c1b] text-white rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg shadow-[#de5c1b]/20 hover:bg-[#de5c1b]/90 transition-all active:scale-95"
                                >
                                    Save Deal to Catalog
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Saving / Success */}
                        {(step === 'saving' || step === 'success') && (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                {step === 'saving' ? (
                                    <>
                                        <Loader2 className="w-12 h-12 text-[#de5c1b] animate-spin mb-4" />
                                        <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Adding to Catalog...</h4>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Bundle Saved!</h4>
                                        <p className="text-sm text-gray-500">The bundle is now live for your clients.</p>
                                    </>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
