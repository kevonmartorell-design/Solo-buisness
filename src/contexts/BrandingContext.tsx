import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SmtpSettings {
    host: string;
    port: string;
    user: string;
    pass: string;
}

interface BrandingContextType {
    companyName: string;
    setCompanyName: (name: string) => void;
    logoUrl: string | null;
    setLogoUrl: (url: string | null) => void;
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    secondaryColor: string;
    setSecondaryColor: (color: string) => void;
    font: string;
    setFont: (font: string) => void;
    customDomain: string;
    setCustomDomain: (domain: string) => void;
    smtpSettings: SmtpSettings;
    setSmtpSettings: (settings: SmtpSettings) => void;
    smsSenderId: string;
    setSmsSenderId: (id: string) => void;
    showPoweredBy: boolean;
    setShowPoweredBy: (show: boolean) => void;
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
    const [companyName, setCompanyName] = useState(() => localStorage.getItem('companyName') || 'Aegis Cert');
    const [logoUrl, setLogoUrl] = useState<string | null>(() => localStorage.getItem('logoUrl'));
    const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('primaryColor') || '#de5c1b');
    const [secondaryColor, setSecondaryColor] = useState(() => localStorage.getItem('secondaryColor') || '#1e293b');
    const [font, setFont] = useState(() => localStorage.getItem('font') || 'Inter');
    const [customDomain, setCustomDomain] = useState(() => localStorage.getItem('customDomain') || '');
    const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>(() => {
        const saved = localStorage.getItem('smtpSettings');
        return saved ? JSON.parse(saved) : { host: '', port: '', user: '', pass: '' };
    });
    const [smsSenderId, setSmsSenderId] = useState(() => localStorage.getItem('smsSenderId') || '');
    const [showPoweredBy, setShowPoweredBy] = useState(() => localStorage.getItem('showPoweredBy') === 'true');

    // Persistence & CSS Variable Update
    useEffect(() => {
        localStorage.setItem('companyName', companyName);
        localStorage.setItem('primaryColor', primaryColor);
        localStorage.setItem('secondaryColor', secondaryColor);
        localStorage.setItem('font', font);
        localStorage.setItem('customDomain', customDomain);
        localStorage.setItem('smtpSettings', JSON.stringify(smtpSettings));
        localStorage.setItem('smsSenderId', smsSenderId);
        localStorage.setItem('showPoweredBy', String(showPoweredBy));

        if (logoUrl) {
            localStorage.setItem('logoUrl', logoUrl);
        } else {
            localStorage.removeItem('logoUrl');
        }

        // Update CSS Variables
        const root = document.documentElement;
        root.style.setProperty('--color-primary', primaryColor);
        root.style.setProperty('--color-secondary', secondaryColor);
        root.style.setProperty('--font-family', font); // Assumes generic font names or loaded fonts

        const rgb = hexToRgb(primaryColor);
        if (rgb) {
            root.style.setProperty('--color-primary-rgb', rgb);
        }

    }, [companyName, logoUrl, primaryColor, secondaryColor, font, customDomain, smtpSettings, smsSenderId, showPoweredBy]);

    const resetBranding = () => {
        setCompanyName('Aegis Cert');
        setLogoUrl(null);
        setPrimaryColor('#de5c1b');
        setSecondaryColor('#1e293b');
        setFont('Inter');
        setCustomDomain('');
        setSmtpSettings({ host: '', port: '', user: '', pass: '' });
        setSmsSenderId('');
        setShowPoweredBy(true);
    };

    return (
        <BrandingContext.Provider value={{
            companyName, setCompanyName,
            logoUrl, setLogoUrl,
            primaryColor, setPrimaryColor,
            secondaryColor, setSecondaryColor,
            font, setFont,
            customDomain, setCustomDomain,
            smtpSettings, setSmtpSettings,
            smsSenderId, setSmsSenderId,
            showPoweredBy, setShowPoweredBy,
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
