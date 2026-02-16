import { useState, useEffect } from 'react';
import {
    Menu,
    Search,
    SlidersHorizontal,
    Clock,
    Plus,
    Package,
    Scissors,
    Sparkles,
    AlertTriangle,
    Tag,
    X,
    Hammer,
    Stethoscope,
    Shield
} from 'lucide-react';
import { getMockServices, type Service } from '../../data/mockServices';
import { getMockProducts, type Product } from '../../data/mockProducts';
import { useVault } from '../../contexts/VaultContext';

const Services = () => {
    const { industry } = useVault();
    const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');

    const [localServices, setLocalServices] = useState<Service[]>([]);
    const [localProducts, setLocalProducts] = useState<Product[]>([]);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('');
    const [newItemExtra, setNewItemExtra] = useState(''); // Duration or Stock

    // Load data based on industry
    useEffect(() => {
        setLocalServices(getMockServices(industry));
        setLocalProducts(getMockProducts(industry));
    }, [industry]);

    const filteredServices = localServices.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProducts = localProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddItem = () => {
        if (!newItemName || !newItemPrice) return; // Minimal validation

        if (activeTab === 'services') {
            const newService: Service = {
                id: `new-${Date.now()}`,
                name: newItemName,
                category: newItemCategory || 'General',
                price: parseFloat(newItemPrice),
                duration: parseInt(newItemExtra) || 60,
                description: 'Newly added service.',
                imageColor: 'bg-slate-100'
            };
            setLocalServices([newService, ...localServices]);
        } else {
            const newProduct: Product = {
                id: `new-${Date.now()}`,
                name: newItemName,
                category: newItemCategory || 'General',
                price: parseFloat(newItemPrice),
                stock: parseInt(newItemExtra) || 0,
                reorderPoint: 5,
                sku: `NEW-${Date.now().toString().slice(-4)}`,
                description: 'Newly added product.',
                imageColor: 'bg-slate-100'
            };
            setLocalProducts([newProduct, ...localProducts]);
        }

        // Reset and Close
        setNewItemName('');
        setNewItemPrice('');
        setNewItemCategory('');
        setNewItemExtra('');
        setIsAddModalOpen(false);
    };

    // Helper to get industry-specific icons and labels
    const getIndustryConfig = () => {
        switch (industry) {
            case 'Healthcare':
                return {
                    serviceLabel: 'Procedures',
                    productLabel: 'Supplies',
                    mainIcon: Stethoscope,
                    bundleText: 'Patients booking Annual Checkups are 40% more likely to purchase Supplements.'
                };
            case 'Construction':
                return {
                    serviceLabel: 'Labor',
                    productLabel: 'Materials',
                    mainIcon: Hammer,
                    bundleText: 'Projects requiring Site Prep often need additional Lumber & Fasteners.'
                };
            case 'Security':
                return {
                    serviceLabel: 'Patrols',
                    productLabel: 'Equipment',
                    mainIcon: Shield,
                    bundleText: 'Clients installing CCTV Systems usually add a monthly Monitoring Package.'
                };
            default:
                return {
                    serviceLabel: 'Services',
                    productLabel: 'Products',
                    mainIcon: Scissors,
                    bundleText: 'Clients booking Deep Tissue Revitalizer are 35% more likely to buy Muscle Balm.'
                };
        }
    };

    const config = getIndustryConfig();
    const MainIcon = config.mainIcon;

    return (
        <div className="bg-white dark:bg-[#211611] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display pb-20 relative">
            {/* Header Section */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#211611]/80 backdrop-blur-md border-b border-[#de5c1b]/10">
                <div className="flex items-center p-4 justify-between max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <div className="text-[#de5c1b] cursor-pointer">
                            <Menu className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Catalog: {industry}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-lg hover:bg-[#de5c1b]/10 transition-colors text-[#de5c1b]">
                            <Search className="w-6 h-6" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-[#de5c1b]/10 transition-colors text-[#de5c1b]">
                            <SlidersHorizontal className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="px-4 pb-0 max-w-5xl mx-auto w-full">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${activeTab === 'services' ? 'border-[#de5c1b] text-[#de5c1b]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <MainIcon className="w-4 h-4" />
                            <span className="font-bold text-sm">{config.serviceLabel}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${activeTab === 'products' ? 'border-[#de5c1b] text-[#de5c1b]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <Package className="w-4 h-4" />
                            <span className="font-bold text-sm">{config.productLabel}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Smart Bundle Recommendation (Mock AI) */}
            <div className="max-w-5xl mx-auto w-full px-4 pt-6">
                <div className="bg-gradient-to-r from-[#de5c1b]/10 to-transparent rounded-xl p-4 border border-[#de5c1b]/20 flex items-start gap-4 relative overflow-hidden">
                    <div className="bg-[#de5c1b] text-white p-2 rounded-lg shadow-lg shadow-[#de5c1b]/20 z-10">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1 z-10">
                        <h3 className="text-sm font-bold text-[#de5c1b] uppercase tracking-wider mb-1">Smart Bundle Insight</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {config.bundleText}
                        </p>
                        <button className="mt-2 text-xs font-bold text-[#de5c1b] hover:underline flex items-center gap-1">
                            Create Bundle Deal <Plus className="w-3 h-3" />
                        </button>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#de5c1b]/5 to-transparent"></div>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-6">

                {/* Services List */}
                {activeTab === 'services' && (
                    <div className="space-y-4">
                        {filteredServices.map(service => (
                            <div key={service.id} className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#2a1d17] border border-[#de5c1b]/5 shadow-sm hover:border-[#de5c1b]/30 transition-all">
                                <div className="flex flex-col md:flex-row">
                                    <div className={`h-32 md:h-auto md:w-32 ${service.imageColor} flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-2xl`}>
                                        {/* Placeholder Image */}
                                        {service.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 p-5 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{service.name}</h3>
                                                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">{service.category}</span>
                                            </div>
                                            <span className="text-[#de5c1b] font-bold text-lg">${service.price}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                                            {service.description}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-xs font-medium bg-[#de5c1b]/10 text-[#de5c1b] px-2.5 py-1 rounded-full w-fit">
                                                <Clock className="w-3.5 h-3.5" />
                                                {service.duration} min
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Products Grid */}
                {activeTab === 'products' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white dark:bg-[#2a1d17] rounded-xl border border-[#de5c1b]/5 shadow-sm p-4 hover:border-[#de5c1b]/30 transition-all flex flex-col">
                                <div className={`aspect-square ${product.imageColor} rounded-lg mb-4 flex items-center justify-center text-slate-400 font-bold text-xl relative`}>
                                    {product.name.charAt(0)}
                                    {product.stock <= product.reorderPoint && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Low Stock
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{product.name}</h3>
                                        <span className="text-[#de5c1b] font-bold text-sm">${product.price}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#de5c1b]/10">
                                        <span className="text-xs font-medium text-slate-400">Stock: <span className={product.stock <= product.reorderPoint ? 'text-red-500 font-bold' : 'text-slate-700 dark:text-slate-200'}>{product.stock}</span></span>
                                        <button className="text-[#de5c1b] hover:bg-[#de5c1b]/10 p-1.5 rounded-lg transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </main>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="fixed right-6 z-40 w-14 h-14 bg-[#de5c1b] text-white rounded-xl flex items-center justify-center shadow-2xl shadow-[#de5c1b]/40 hover:scale-105 active:scale-95 transition-transform bottom-6"
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="fixed inset-x-4 bottom-4 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none">
                        <div className="bg-white dark:bg-[#211611] w-full md:w-96 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-[#de5c1b]/10">
                            <div className="p-4 border-b border-[#de5c1b]/10 flex justify-between items-center bg-[#de5c1b]/5">
                                <h3 className="font-bold text-lg">Add New {activeTab === 'services' ? config.serviceLabel : config.productLabel}</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#de5c1b]"
                                        placeholder={`e.g., New ${activeTab === 'services' ? 'Service' : 'Product'}`}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            value={newItemPrice}
                                            onChange={(e) => setNewItemPrice(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#de5c1b]"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                            {activeTab === 'services' ? 'Duration (min)' : 'Stock Qty'}
                                        </label>
                                        <input
                                            type="number"
                                            value={newItemExtra}
                                            onChange={(e) => setNewItemExtra(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#de5c1b]"
                                            placeholder={activeTab === 'services' ? "60" : "10"}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                    <input
                                        type="text"
                                        list="category-suggestions"
                                        value={newItemCategory}
                                        onChange={(e) => setNewItemCategory(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#de5c1b]"
                                        placeholder="Type or select..."
                                    />
                                    <DataListOptions activeTab={activeTab} industry={industry} />
                                </div>
                                <button
                                    onClick={handleAddItem}
                                    className="w-full py-3 bg-[#de5c1b] text-white font-bold rounded-xl mt-2 hover:bg-[#de5c1b]/90 transition-colors shadow-lg shadow-[#de5c1b]/20"
                                >
                                    Add {activeTab === 'services' ? 'Item' : 'Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Helper component for industry-aware suggestions
const DataListOptions = ({ activeTab, industry }: { activeTab: string, industry: string }) => {
    let options: string[] = [];

    if (activeTab === 'services') {
        switch (industry) {
            case 'Healthcare': options = ['Consultation', 'Procedure', 'Therapy', 'Lab']; break;
            case 'Construction': options = ['Labor', 'Planning', 'Installation', 'Demolition']; break;
            case 'Security': options = ['Consultation', 'Installation', 'Patrol', 'Monitoring']; break;
            default: options = ['Hair', 'Skin', 'Body', 'Consultation']; break;
        }
    } else {
        switch (industry) {
            case 'Healthcare': options = ['Supplies', 'Retail', 'Medication']; break;
            case 'Construction': options = ['Materials', 'Fasteners', 'Gear', 'Tools']; break;
            case 'Security': options = ['Hardware', 'Supplies', 'Electronics']; break;
            default: options = ['Retail', 'Professional', 'Merch']; break;
        }
    }

    return (
        <datalist id="category-suggestions">
            {options.map(opt => <option key={opt} value={opt} />)}
        </datalist>
    );
};

export default Services;
