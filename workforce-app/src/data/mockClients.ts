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

// --- Dynamic Data Generators ---

const getInsightsForIndustry = (industry: string, name: string): string[] => {
    switch (industry) {
        case 'Healthcare':
            return [
                "Overdue for annual checkup.",
                "Prescription renewal likely needed next visit.",
                "Family history suggests higher frequency monitoring."
            ];
        case 'Construction':
            return [
                "Site safety briefing expires in 14 days.",
                "High machinery usage recorded this month.",
                "Project milestone 'Foundation' due next week."
            ];
        case 'Security':
            return [
                "Patrol route deviations detected on 3rd shift.",
                "Incident report filed: 'Unlocked Gate' (Resolved).",
                "Access control credentials expiring soon."
            ];
        case 'Logistics':
            return [
                "Fleet maintenance overdue for Vehicle #402.",
                "Driver fatigue warnings flagged twice.",
                "Fuel efficiency down 5% vs fleet average."
            ];
        case 'Hospitality':
            return [
                "Prefers window seat for dinner service.",
                "Allergic to shellfish (Severe).",
                "Anniversary coming up on Nov 12th."
            ];
        default: // General
            return [
                "Consistent monthly visitor.",
                "Usually buys additional services when suggested.",
                "Engagement score high."
            ];
    }
};

const getServicesForIndustry = (industry: string): { name: string, price: number }[] => {
    switch (industry) {
        case 'Healthcare':
            return [
                { name: 'General Consultation', price: 150 },
                { name: 'Annual Physical', price: 200 },
                { name: 'Specialist Referral', price: 50 }
            ];
        case 'Construction':
            return [
                { name: 'Site Inspection', price: 300 },
                { name: 'Blueprint Review', price: 150 },
                { name: 'Safety Audit', price: 500 }
            ];
        case 'Security':
            return [
                { name: 'Perimeter Check', price: 75 },
                { name: 'Alarm Response', price: 120 },
                { name: 'System Maintenance', price: 200 }
            ];
        case 'Logistics':
            return [
                { name: 'Route Optimization', price: 250 },
                { name: 'Load Balancing', price: 100 },
                { name: 'Emergency Dispatch', price: 400 }
            ];
        default:
            return [
                { name: 'Premium Service', price: 100 },
                { name: 'Consultation', price: 50 },
                { name: 'Maintenance', price: 75 }
            ];
    }
};

export const getMockClients = (industry: string = 'General'): Client[] => {
    const services = getServicesForIndustry(industry);

    // Base templates to modify based on industry
    const baseClients = [
        {
            id: '1',
            name: 'Elena Rodriguez',
            initials: 'ER',
            avatarColor: 'bg-purple-100 text-purple-600',
            contactInfo: { phone: '+1 (555) 123-4567', email: 'elena.r@example.com' },
            stats: { totalSpend: 2840, lastVisit: '2023-11-02', visitCount: 14 },
            status: 'Active',
            loyaltyTier: 'VIP',
            privateNotes: "Key stakeholder. Very detail oriented.",
            preferences: { likes: ['Detailed Reports', 'Early Morning'], dislikes: ['Rush jobs'], preferredTime: 'Morning' }
        },
        {
            id: '2',
            name: 'Alexander Wright',
            initials: 'AW',
            avatarColor: 'bg-blue-100 text-blue-600',
            contactInfo: { phone: '+1 (555) 987-6543', email: 'alex.w@example.com' },
            stats: { totalSpend: 1250, lastVisit: '2023-10-24', visitCount: 8 },
            status: 'Active',
            loyaltyTier: 'Premium',
            privateNotes: "Prefers quick, concise updates.",
            preferences: { likes: ['Digital First', 'SMS Updates'], dislikes: ['Paperwork'], preferredTime: 'Lunch' }
        },
        {
            id: '3',
            name: 'Marcus Chen',
            initials: 'MC',
            avatarColor: 'bg-green-100 text-green-600',
            contactInfo: { phone: '+1 (555) 456-7890', email: 'marcus.c@example.com' },
            stats: { totalSpend: 450, lastVisit: '2023-08-12', visitCount: 2 },
            status: 'At Risk',
            loyaltyTier: 'New',
            riskScore: 75,
            privateNotes: "New account, still onboarding.",
            preferences: { likes: ['Clear Pricing'], dislikes: [], preferredTime: 'Weekend' }
        }
    ] as any[];

    return baseClients.map(client => ({
        ...client,
        aiInsights: getInsightsForIndustry(industry, client.name),
        history: [
            { id: `h${client.id}1`, date: '2023-11-01', serviceName: services[0].name, price: services[0].price, technician: 'Staff' },
            { id: `h${client.id}2`, date: '2023-10-15', serviceName: services[1].name, price: services[1].price, technician: 'Staff' }
        ]
    })) as Client[];
};

// Default export for backward compatibility
export const mockClients = getMockClients('General');
