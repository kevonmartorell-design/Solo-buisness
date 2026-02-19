
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    reorderPoint: number;
    sku: string;
    description: string;
    imageColor: string; // Tailwind class
}

const getProductsForIndustry = (industry: string): Product[] => {
    switch (industry) {
        case 'Healthcare':
            return [
                {
                    id: 'p1',
                    name: 'Sterile Bandages (Box of 50)',
                    category: 'Supplies',
                    price: 12.50,
                    stock: 45,
                    reorderPoint: 10,
                    sku: 'SUP-BND-050',
                    description: 'Hospital-grade adhesive bandages.',
                    imageColor: 'bg-white'
                },
                {
                    id: 'p2',
                    name: 'Vitamin D3 Supplements',
                    category: 'Retail',
                    price: 24.00,
                    stock: 20,
                    reorderPoint: 5,
                    sku: 'RET-VIT-D3',
                    description: 'High-potency immune support supplements.',
                    imageColor: 'bg-yellow-100'
                },
                {
                    id: 'p3',
                    name: 'Antiseptic Solution (1L)',
                    category: 'Supplies',
                    price: 18.00,
                    stock: 8,
                    reorderPoint: 5,
                    sku: 'SUP-ANT-001',
                    description: 'Professional grade skin cleaner.',
                    imageColor: 'bg-blue-100'
                }
            ];
        case 'Construction':
            return [
                {
                    id: 'p1',
                    name: 'Premium Lumber 2x4 (8ft)',
                    category: 'Materials',
                    price: 8.50,
                    stock: 500,
                    reorderPoint: 100,
                    sku: 'MAT-LUM-2X4',
                    description: 'Heat-treated structural framing lumber.',
                    imageColor: 'bg-yellow-200'
                },
                {
                    id: 'p2',
                    name: 'Box of Framing Nails (5lbs)',
                    category: 'Fasteners',
                    price: 35.00,
                    stock: 24,
                    reorderPoint: 10,
                    sku: 'FAS-NAL-005',
                    description: 'Galvanized steel nails for framing guns.',
                    imageColor: 'bg-gray-200'
                },
                {
                    id: 'p3',
                    name: 'Heavy Duty Work Gloves',
                    category: 'Gear',
                    price: 19.99,
                    stock: 15,
                    reorderPoint: 5,
                    sku: 'GEA-GLV-001',
                    description: 'Leather reinforced safety gloves.',
                    imageColor: 'bg-orange-100'
                }
            ];
        case 'Security':
            return [
                {
                    id: 'p1',
                    name: 'HD Outdoor Camera',
                    category: 'Hardware',
                    price: 120.00,
                    stock: 12,
                    reorderPoint: 4,
                    sku: 'HDW-CAM-001',
                    description: 'Weatherproof 1080p security camera with night vision.',
                    imageColor: 'bg-gray-800 text-white'
                },
                {
                    id: 'p2',
                    name: 'Motion Sensor (Pack of 3)',
                    category: 'Hardware',
                    price: 85.00,
                    stock: 8,
                    reorderPoint: 3,
                    sku: 'HDW-SEN-003',
                    description: 'Wireless infrared motion detectors.',
                    imageColor: 'bg-white'
                },
                {
                    id: 'p3',
                    name: 'Warning Signage',
                    category: 'Supplies',
                    price: 15.00,
                    stock: 30,
                    reorderPoint: 10,
                    sku: 'SUP-SGN-001',
                    description: 'Reflective "Protected by Security" yard signs.',
                    imageColor: 'bg-red-100'
                }
            ];
        default: // General / Salon defaults
            return [
                {
                    id: 'p1',
                    name: 'Silk & Shine Serum',
                    category: 'Retail',
                    price: 42.00,
                    stock: 15,
                    reorderPoint: 5,
                    sku: 'HR-SRM-001',
                    description: 'Lightweight argan oil blend for frizz control and shine.',
                    imageColor: 'bg-yellow-100'
                },
                {
                    id: 'p2',
                    name: 'Volumizing Root Lift Spray',
                    category: 'Retail',
                    price: 28.00,
                    stock: 4,
                    reorderPoint: 8,
                    sku: 'HR-VOL-002',
                    description: 'Boosts volume at the roots without sticky residue.',
                    imageColor: 'bg-pink-100'
                },
                {
                    id: 'p3',
                    name: 'Hydrating Night Cream',
                    category: 'Retail',
                    price: 65.00,
                    stock: 12,
                    reorderPoint: 5,
                    sku: 'SK-NHT-001',
                    description: 'Intense overnight hydration with hyaluronic acid.',
                    imageColor: 'bg-blue-100'
                }
            ];
    }
};

export const getMockProducts = (industry: string = 'General'): Product[] => {
    return getProductsForIndustry(industry);
};

// Default export for backward compatibility
export const mockProducts = getMockProducts('General');
