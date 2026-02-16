
export interface Service {
    id: string;
    name: string;
    category: string;
    price: number;
    duration: number; // in minutes
    description: string;
    imageColor: string; // Tailwind class
}

const getServicesForIndustry = (industry: string): Service[] => {
    switch (industry) {
        case 'Healthcare':
            return [
                {
                    id: 's1',
                    name: 'Annual Wellness Checkup',
                    category: 'Consultation',
                    price: 150,
                    duration: 30,
                    description: 'Comprehensive physical, vitals check, and health history review.',
                    imageColor: 'bg-blue-100'
                },
                {
                    id: 's2',
                    name: 'Vaccination / Injection',
                    category: 'Procedure',
                    price: 45,
                    duration: 15,
                    description: 'Administration of required immunizations or therapeutic injections.',
                    imageColor: 'bg-green-100'
                },
                {
                    id: 's3',
                    name: 'Physical Therapy Session',
                    category: 'Therapy',
                    price: 120,
                    duration: 60,
                    description: 'Guided rehabilitation exercises and manual therapy.',
                    imageColor: 'bg-orange-100'
                }
            ];
        case 'Construction':
            return [
                {
                    id: 's1',
                    name: 'Site Preparation & Grading',
                    category: 'Labor',
                    price: 1200,
                    duration: 480, // 8 hours
                    description: 'Clearing, excavating, and leveling the construction site.',
                    imageColor: 'bg-yellow-100'
                },
                {
                    id: 's2',
                    name: 'Blueprint Consultation',
                    category: 'Planning',
                    price: 250,
                    duration: 90,
                    description: 'Detailed review of architectural plans and structural requirements.',
                    imageColor: 'bg-blue-100'
                },
                {
                    id: 's3',
                    name: 'Electrical Rough-In',
                    category: 'Installation',
                    price: 850,
                    duration: 240,
                    description: 'Installation of initial wiring, boxes, and conduits before walls are closed.',
                    imageColor: 'bg-orange-100'
                }
            ];
        case 'Security':
            return [
                {
                    id: 's1',
                    name: 'risk Assessment Audit',
                    category: 'Consultation',
                    price: 500,
                    duration: 120,
                    description: 'Full property evaluation identifying security vulnerabilities.',
                    imageColor: 'bg-gray-100'
                },
                {
                    id: 's2',
                    name: 'CCTV System Installation',
                    category: 'Installation',
                    price: 1500,
                    duration: 360,
                    description: 'Setup of cameras, DVR/NVR, and remote viewing configuration.',
                    imageColor: 'bg-blue-100'
                },
                {
                    id: 's3',
                    name: 'Armed Patrol Shift',
                    category: 'Patrol',
                    price: 350,
                    duration: 480,
                    description: 'On-site licensed armed security presence for designated hours.',
                    imageColor: 'bg-slate-200'
                }
            ];
        default: // General / Salon defaults
            return [
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
                }
            ];
    }
};

export const getMockServices = (industry: string = 'General'): Service[] => {
    return getServicesForIndustry(industry);
};

// Default export for backward compatibility
export const mockServices = getMockServices('General');
