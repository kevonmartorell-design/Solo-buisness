
export interface Service {
    id: string;
    name: string;
    category: string;
    price: number;
    duration: number; // in minutes
    description: string;
    imageColor: string; // Tailwind class
}

export const mockServices: Service[] = [
    {
        id: 's1',
        name: 'Deep Tissue Revitalizer',
        category: 'Body',
        price: 85,
        duration: 60,
        description: 'A therapeutic treatment targeting chronic muscle tension using slow, deliberate strokes.',
        imageColor: 'bg-orange-100'
    },
    {
        id: 's2',
        name: 'Hydrating Luminescence Facial',
        category: 'Skin',
        price: 120,
        duration: 45,
        description: 'Restore your skin\'s natural glow with our signature hydrating treatment using organic botanicals.',
        imageColor: 'bg-blue-100'
    },
    {
        id: 's3',
        name: 'Signature Blowout & Style',
        category: 'Hair',
        price: 65,
        duration: 30,
        description: 'A custom blowout session including a relaxing head massage and professional heat styling.',
        imageColor: 'bg-purple-100'
    },
    {
        id: 's4',
        name: 'Scalp Detox Treatment',
        category: 'Hair',
        price: 55,
        duration: 45,
        description: 'Exfoliate and purify the scalp to promote healthy hair growth and relieve dryness.',
        imageColor: 'bg-green-100'
    },
    {
        id: 's5',
        name: 'Virtual Skin Consultation',
        category: 'Consultation',
        price: 0,
        duration: 15,
        description: 'Expert analysis of your skin type and concerns with personalized product recommendations.',
        imageColor: 'bg-gray-100'
    }
];
