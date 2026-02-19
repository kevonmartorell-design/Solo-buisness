import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    resetBranding: () => void;
    saveBranding: () => Promise<boolean>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

// Helper to convert hex to RGB for Tailwind opacity support
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
};

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    // Default values
    const [companyName, setCompanyName] = useState('Aegis Cert');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [primaryColor, setPrimaryColor] = useState('#de5c1b');
    const [secondaryColor, setSecondaryColor] = useState('#1e293b');
    const [font, setFont] = useState('Inter');
    const [customDomain, setCustomDomain] = useState('');
    const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>({ host: '', port: '', user: '', pass: '' });
    const [smsSenderId, setSmsSenderId] = useState('');
    const [showPoweredBy, setShowPoweredBy] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    // CSS Variable Update Effect
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', primaryColor);
        root.style.setProperty('--color-secondary', secondaryColor);
        root.style.setProperty('--font-family', font);

        const rgb = hexToRgb(primaryColor);
        if (rgb) {
            root.style.setProperty('--color-primary-rgb', rgb);
        }

        // Theme handling
        const applyTheme = (themeValue: 'light' | 'dark' | 'system') => {
            const isDark = themeValue === 'dark' || (themeValue === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme(theme);
    }, [primaryColor, secondaryColor, font, theme]);

    // Load from Supabase on Mount/User Change
    useEffect(() => {
        const loadBranding = async () => {
            if (!user) return;

            try {
                // Get Org ID
                const { data: profile } = await (supabase as any)
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                if (!profile?.organization_id) return;

                // Get Organization Settings
                const { data: org } = await (supabase as any)
                    .from('organizations')
                    .select('business_name, settings')
                    .eq('id', profile.organization_id)
                    .single();

                if (org) {
                    if (org.business_name) setCompanyName(org.business_name);

                    const settings = org.settings as any;
                    if (settings) {
                        if (settings.logoUrl) setLogoUrl(settings.logoUrl);
                        if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
                        if (settings.secondaryColor) setSecondaryColor(settings.secondaryColor);
                        if (settings.font) setFont(settings.font);
                        if (settings.customDomain) setCustomDomain(settings.customDomain);
                        if (settings.smtpSettings) setSmtpSettings(settings.smtpSettings);
                        if (settings.smsSenderId) setSmsSenderId(settings.smsSenderId);
                        if (settings.showPoweredBy !== undefined) setShowPoweredBy(settings.showPoweredBy);
                        if (settings.theme) setTheme(settings.theme);
                    }
                }
            } catch (error) {
                console.error('Error loading branding:', error);
            }
        };

        loadBranding();
    }, [user]);

    const saveBranding = async () => {
        if (!user) return false;
        try {
            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) return false;

            const settings = {
                logoUrl,
                primaryColor,
                secondaryColor,
                font,
                customDomain,
                smtpSettings,
                smsSenderId,
                showPoweredBy,
                theme
            };

            const { error } = await (supabase as any)
                .from('organizations')
                .update({
                    business_name: companyName,
                    settings: settings
                })
                .eq('id', profile.organization_id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error saving branding:', error);
            return false;
        }
    };

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
            theme, setTheme,
            resetBranding,
            saveBranding
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
