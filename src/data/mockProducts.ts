
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

export const mockProducts: Product[] = [
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
    },
    {
        id: 'p4',
        name: 'Professional Shears 6"',
        category: 'Professional',
        price: 150.00,
        stock: 2,
        reorderPoint: 1,
        sku: 'PR-SHR-006',
        description: 'Japanese steel shears for precision cutting.',
        imageColor: 'bg-gray-200'
    },
    {
        id: 'p5',
        name: 'Branded Tote Bag',
        category: 'Merch',
        price: 15.00,
        stock: 50,
        reorderPoint: 10,
        sku: 'MR-BAG-001',
        description: 'Eco-friendly cotton tote with salon logo.',
        imageColor: 'bg-orange-100'
    }
];
