import { supabase } from '../lib/supabase';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type OnboardingData = {
    // Section 1: Business Basics
    businessName: string;
    dba?: string;
    industry: string;
    yearsInBusiness: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    hasMultipleLocations: boolean;
    locationCount?: number;
    operatingHours: {
        [key: string]: { open: string; close: string; closed: boolean };
    };

    // Section 2: Team & Staffing
    employeeCount: string;
    expectedGrowth: string;
    roles: string[];
    leadershipCount: number;
    teamComposition: {
        fullTime: number;
        partTime: number;
        contractors: number;
        seasonal: number;
    };

    // Section 3: Scheduling Needs
    schedulingMethod: string;
    advanceScheduling: string;
    scheduleChangeFrequency: string;
    schedulingChallenges: string[];
    approvalWorkflows: {
        timeOff: boolean;
        shiftSwaps: boolean;
        scheduleChanges: boolean;
        overtime: boolean;
    };
    timeTracking: string;
    appointmentBased: string;

    // Section 4: Client Management
    clientCount: string;
    crmSystem: string;
    importantData: string[];
    clientPortalFeatures: string[];
    aiCrmAssistance: string;
    clientFollowUp: string;

    // Section 5: Services
    serviceCount: string;
    certificationRequired: string;
    serviceTracking: {
        time: boolean;
        quality: boolean;
        assignments: boolean;
        inventory: boolean;
        sops: boolean;
    };
    productSales: string;

    // Section 6: Vault (Certifications)
    documentStorageNeeds: string[];
    complianceTracking: string;
    expirationAlerts: string;

    // Section 7: Operations & Logistics
    inventoryTracking: string;
    supplyOrdering: string;
    equipmentMaintenance: string;
    vendorManagement: string;

    // Section 8: Payroll & Financials
    payrollMethod: string;
    taxFilingHelp: string;
    financialReporting: string[];
    accountingIntegration: string;

    // Section 9: Communication (Placeholder for now)
    communicationTools: string[];
    customerMessaging: string;

    // Section 10: Analytics (Renumbered from 7)
    topMetrics: string[];
    reviewFrequency: string;
    comparisonAndAi: {
        multiLocation: boolean;
        departments: boolean;
        employees: boolean;
        timePeriods: boolean;
        aiInsights: string;
    };

    // Section 8: Branding
    brandImportance: string;
    brandAssets: {
        logo: boolean;
        colors: boolean;
        guidelines: boolean;
        fonts: boolean;
    };
    customDomain: string;
    whitelabel: string;
    communicationBranding: {
        email: string;
        sms: string;
    };

    // Section 9: Tier
    selectedTier: 'solo' | 'business' | 'enterprise' | '';
    budget: string;
    roiTimeline: string;

    // Section 10: Pain Points
    challenges: string[];
    schedTime: string;
    adminTime: string;
    successMetrics: string[];
    mustHaveFeature: string;

    // Section 11: Tech
    currentSystems: string[];
    priorityFeatures: string[];
    integrations: string;
    techSavviness: string;
    devices: string[];
    fieldAccess: string;

    // Section 12: Implementation
    startDate: string;
    supportNeeds: {
        setup: boolean;
        import: boolean;
        managerTraining: boolean;
        staffTraining: boolean;
        ongoing: boolean;
    };
    learningStyle: string[];
    supportLevel: string;
    uptimeCriticality: string;

    // Section 13: Additional
    specificRequirements: string;
    dealBreakers: string;
    pastTools: string;
    industryRegulations: string;
    insuranceRequirements: string;

    // Section 14: Final
    urgency: string;
    decisionFactor: string;
    decisionMakers: string[];
    additionalInfo: string;
    contact: {
        name: string;
        email: string;
        phone: string;
        bestTime: string;
        method: string[];
    };
};

const initialData: OnboardingData = {
    businessName: '',
    industry: '',
    yearsInBusiness: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    hasMultipleLocations: false,
    operatingHours: {},
    employeeCount: '',
    expectedGrowth: '',
    roles: [],
    leadershipCount: 0,
    teamComposition: { fullTime: 0, partTime: 0, contractors: 0, seasonal: 0 },
    schedulingMethod: '',
    advanceScheduling: '',
    scheduleChangeFrequency: '',
    schedulingChallenges: [],
    approvalWorkflows: { timeOff: false, shiftSwaps: false, scheduleChanges: false, overtime: false },
    timeTracking: '',
    appointmentBased: '',
    clientCount: '',
    crmSystem: '',
    importantData: [],
    clientPortalFeatures: [],
    aiCrmAssistance: '',
    clientFollowUp: '',
    serviceCount: '',
    certificationRequired: '',
    serviceTracking: { time: false, quality: false, assignments: false, inventory: false, sops: false },
    productSales: '',
    documentStorageNeeds: [],
    complianceTracking: '',
    expirationAlerts: '',
    // Section 7
    inventoryTracking: '',
    supplyOrdering: '',
    equipmentMaintenance: '',
    vendorManagement: '',
    // Section 8
    payrollMethod: '',
    taxFilingHelp: '',
    financialReporting: [],
    accountingIntegration: '',
    // Section 9
    communicationTools: [],
    customerMessaging: '',

    // Section 10 (formerly 7)
    topMetrics: [],
    reviewFrequency: '',
    comparisonAndAi: { multiLocation: false, departments: false, employees: false, timePeriods: false, aiInsights: '' },
    brandImportance: '',
    brandAssets: { logo: false, colors: false, guidelines: false, fonts: false },
    customDomain: '',
    whitelabel: '',
    communicationBranding: { email: '', sms: '' },
    selectedTier: '',
    budget: '',
    roiTimeline: '',
    challenges: [],
    schedTime: '',
    adminTime: '',
    successMetrics: [],
    mustHaveFeature: '',
    currentSystems: [],
    priorityFeatures: [],
    integrations: '',
    techSavviness: '',
    devices: [],
    fieldAccess: '',
    startDate: '',
    supportNeeds: { setup: false, import: false, managerTraining: false, staffTraining: false, ongoing: false },
    learningStyle: [],
    supportLevel: '',
    uptimeCriticality: '',
    specificRequirements: '',
    dealBreakers: '',
    pastTools: '',
    industryRegulations: '',
    insuranceRequirements: '',
    urgency: '',
    decisionFactor: '',
    decisionMakers: [],
    additionalInfo: '',
    contact: { name: '', email: '', phone: '', bestTime: '', method: [] },
};

type OnboardingContextType = {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    totalSteps: number;
    submitOnboarding: () => Promise<any>;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<OnboardingData>(initialData);
    const [step, setStep] = useState(1);
    const totalSteps = 14;

    useEffect(() => {
        const initTier = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.user_metadata?.tier) {
                const tier = session.user.user_metadata.tier.toLowerCase();
                if (['solo', 'business', 'enterprise'].includes(tier)) {
                    updateData({ selectedTier: tier as any });
                }
            }
        };
        initTier();
    }, []);

    const updateData = (updates: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const submitOnboarding = async () => {
        try {
            // Ensure we have a valid session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session?.user) {
                console.error('No authenticated user found', sessionError);
                throw new Error('You must be logged in to complete onboarding. Please refresh and try again.');
            }

            const user = session.user;

            // 1. Create Organization
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .insert({
                    business_name: data.businessName,
                    tier: data.selectedTier || 'free',
                    employee_count: parseInt(data.employeeCount) || 1,
                    onboarding_data: data,
                    onboarding_complete: true,
                } as any)
                .select()
                .single();

            if (orgError) {
                console.error('Error creating organization:', orgError);
                throw new Error(`Failed to create organization: ${orgError.message}`);
            }

            // 2. Update Profile
            if (org) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        organization_id: org.id,
                        role: 'super_admin' as any,
                    } as any)
                    .eq('id', user.id);

                if (profileError) {
                    console.error('Error updating profile:', profileError);
                    // We don't throw here to avoid "failing" the onboarding if the org was created but profile update had a minor issue
                    // However, for a critical path, we might want to ensure this succeeds.
                }
            }

            return org;
        } catch (error: any) {
            console.error('Onboarding submission error:', error);
            throw error;
        }
    };

    return (
        <OnboardingContext.Provider value={{ data, updateData, step, setStep, nextStep, prevStep, totalSteps, submitOnboarding }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};
