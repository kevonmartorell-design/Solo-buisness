import { Calendar, MessageSquare, Phone } from 'lucide-react';

export interface ServiceHistory {
    id: string;
    date: string;
    serviceName: string;
    price: number;
    technician: string;
    notes?: string;
}

export interface Client {
    id: string;
    name: string;
    initials: string;
    avatarColor: string; // Tailwind class for background
    contactInfo: {
        phone: string;
        email: string;
    };
    stats: {
        totalSpend: number;
        lastVisit: string;
        visitCount: number;
    };
    status: 'Active' | 'At Risk' | 'Inactive';
    loyaltyTier: 'VIP' | 'Premium' | 'Standard' | 'New';
    riskScore?: number; // 0-100, higher is riskier
    aiInsights: string[];
    privateNotes: string;
    history: ServiceHistory[];
    preferences: {
        likes: string[];
        dislikes: string[];
        preferredTime: string;
    };
}

export const mockClients: Client[] = [
    {
        id: '1',
        name: 'Elena Rodriguez',
        initials: 'ER',
        avatarColor: 'bg-purple-100 text-purple-600',
        contactInfo: {
            phone: '+1 (555) 123-4567',
            email: 'elena.r@example.com'
        },
        stats: {
            totalSpend: 2840,
            lastVisit: '2023-11-02',
            visitCount: 14
        },
        status: 'Active',
        loyaltyTier: 'VIP',
        aiInsights: [
            "Consistent monthly visitor for hair styling.",
            "Usually buys products when suggested after service.",
            "Suggest the new 'Lavender & Silk' serum - matches her preference profile."
        ],
        privateNotes: "Elena values privacy and prefers the corner chair. Always use the lavender-scented oils as she is allergic to citrus-based products. Mentioned her daughter's wedding coming up in December.",
        history: [
            { id: 'h1', date: '2023-11-02', serviceName: 'Premium Hair Styling & Color', price: 180, technician: 'Sarah' },
            { id: 'h2', date: '2023-09-15', serviceName: 'Scalp Treatment & Massage', price: 95, technician: 'Mike' },
            { id: 'h3', date: '2023-08-10', serviceName: 'Full Balayage', price: 250, technician: 'Sarah' }
        ],
        preferences: {
            likes: ['Lavender', 'Quiet environment', 'Tea'],
            dislikes: ['Citrus scents', 'Sales pressure'],
            preferredTime: 'Morning'
        }
    },
    {
        id: '2',
        name: 'Alexander Wright',
        initials: 'AW',
        avatarColor: 'bg-blue-100 text-blue-600',
        contactInfo: {
            phone: '+1 (555) 987-6543',
            email: 'alex.w@example.com'
        },
        stats: {
            totalSpend: 1250,
            lastVisit: '2023-10-24',
            visitCount: 8
        },
        status: 'Active',
        loyaltyTier: 'Premium',
        aiInsights: [
            "Prefers quick, efficient services during lunch hours.",
            "Potential upsell: Express Scalp Treatment."
        ],
        privateNotes: "Works nearby, always in a rush. Appreciates when we start exactly on time.",
        history: [
            { id: 'h4', date: '2023-10-24', serviceName: 'Men\'s Cut & Style', price: 45, technician: 'Mike' },
            { id: 'h5', date: '2023-09-20', serviceName: 'Beard Trim', price: 25, technician: 'Mike' }
        ],
        preferences: {
            likes: ['Efficiency', 'Online booking'],
            dislikes: ['Waiting', 'Small talk'],
            preferredTime: 'Lunch (12-2 PM)'
        }
    },
    {
        id: '3',
        name: 'Marcus Chen',
        initials: 'MC',
        avatarColor: 'bg-green-100 text-green-600',
        contactInfo: {
            phone: '+1 (555) 456-7890',
            email: 'marcus.c@example.com'
        },
        stats: {
            totalSpend: 450,
            lastVisit: '2023-08-12',
            visitCount: 2
        },
        status: 'At Risk',
        loyaltyTier: 'New',
        riskScore: 75,
        aiInsights: [
            "Haven't seen Marcus in 3 months.",
            "Churn Risk: High.",
            "Action: Send 'We miss you' offer for 15% off next visit."
        ],
        privateNotes: "New client, moved to the area recently. Seemed hesitant about pricing.",
        history: [
            { id: 'h6', date: '2023-08-12', serviceName: 'Consultation', price: 0, technician: 'Sarah' },
            { id: 'h7', date: '2023-08-15', serviceName: 'Starter Facial', price: 150, technician: 'Emily' }
        ],
        preferences: {
            likes: ['Detailed explanations'],
            dislikes: [],
            preferredTime: 'Weekend'
        }
    },
    {
        id: '4',
        name: 'Sarah Jenkins',
        initials: 'SJ',
        avatarColor: 'bg-yellow-100 text-yellow-600',
        contactInfo: {
            phone: '+1 (555) 111-2222',
            email: 'sarah.j@example.com'
        },
        stats: {
            totalSpend: 5600,
            lastVisit: '2023-11-10',
            visitCount: 24
        },
        status: 'Active',
        loyaltyTier: 'VIP',
        aiInsights: [
            "Top 5% spender.",
            "Loves the holiday specials.",
            "Birthday coming up next week - prepare gift."
        ],
        privateNotes: "Very loyal. Brings coffee for the staff sometimes. Ask about her dog 'Buster'.",
        history: [
            { id: 'h8', date: '2023-11-10', serviceName: 'Full Package Spa Day', price: 450, technician: 'Multiple' },
            { id: 'h9', date: '2023-10-15', serviceName: 'Manicure & Pedicure', price: 85, technician: 'Lisa' }
        ],
        preferences: {
            likes: ['Pampering', 'Chatting'],
            dislikes: ['Cold rooms'],
            preferredTime: 'Afternoon'
        }
    }
];
