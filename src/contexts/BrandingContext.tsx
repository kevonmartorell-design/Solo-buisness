import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface BrandingContextType {
    companyName: string;
    setCompanyName: (name: string) => void;
    logoUrl: string | null;
    setLogoUrl: (url: string | null) => void;
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

// Helper to convert hex to RGB for Tailwind opacity support
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
};

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
    // Load from local storage or default
    const [companyName, setCompanyName] = useState(() => localStorage.getItem('companyName') || 'Sovereign');
    const [logoUrl, setLogoUrl] = useState<string | null>(() => localStorage.getItem('logoUrl'));
    const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('primaryColor') || '#de5c1b');

    // Persistence & CSS Variable Update
    useEffect(() => {
        localStorage.setItem('companyName', companyName);
        localStorage.setItem('primaryColor', primaryColor);
        if (logoUrl) {
            localStorage.setItem('logoUrl', logoUrl);
        } else {
            localStorage.removeItem('logoUrl');
        }

        // Update CSS Variables
        const root = document.documentElement;
        root.style.setProperty('--color-primary', primaryColor);

        const rgb = hexToRgb(primaryColor);
        if (rgb) {
            root.style.setProperty('--color-primary-rgb', rgb);
        }

    }, [companyName, logoUrl, primaryColor]);

    const resetBranding = () => {
        setCompanyName('Sovereign');
        setLogoUrl(null);
        setPrimaryColor('#de5c1b');
    };

    return (
        <BrandingContext.Provider value={{
            companyName, setCompanyName,
            logoUrl, setLogoUrl,
            primaryColor, setPrimaryColor,
            resetBranding
        }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};
