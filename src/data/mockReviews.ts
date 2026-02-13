
export interface Review {
    id: string;
    clientName: string;
    rating: number; // 1-5
    comment: string;
    date: string;
    avatarColor: string;
}

export const mockReviews: Review[] = [
    {
        id: 'r1',
        clientName: 'Sarah M.',
        rating: 5,
        comment: 'Absolutely amazing service! The deep tissue massage was exactly what I needed.',
        date: '2 days ago',
        avatarColor: 'bg-green-100'
    },
    {
        id: 'r2',
        clientName: 'Mike T.',
        rating: 4,
        comment: 'Great haircut, but the wait was a bit long. Professional staff though.',
        date: '1 week ago',
        avatarColor: 'bg-blue-100'
    },
    {
        id: 'r3',
        clientName: 'Jessica L.',
        rating: 5,
        comment: 'Best facial in town! My skin feels so rejuvenated. Highly recommend.',
        date: '2 weeks ago',
        avatarColor: 'bg-pink-100'
    },
    {
        id: 'r4',
        clientName: 'David R.',
        rating: 5,
        comment: 'Consistent quality every time. I’ve been a regular for 6 months now.',
        date: '3 weeks ago',
        avatarColor: 'bg-purple-100'
    }
];

export const mockPortfolioImages = [
    'https://images.unsplash.com/photo-1560066984-12186d30b7e2?auto=format&fit=crop&q=80&w=500', // Salon interior
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500', // Hair styling
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500', // Spa treatment
    'https://images.unsplash.com/photo-1521590832896-bc9514e2d53c?auto=format&fit=crop&q=80&w=500', // Manicure
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=500', // Makeup
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=500'  // Product display
];
