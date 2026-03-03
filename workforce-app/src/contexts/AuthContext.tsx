import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type Role = 'Owner' | 'Manager' | 'Associate' | 'Client';
export type Tier = 'Free' | 'Solo' | 'Business' | 'Client';

interface User {
    id: string;
    email?: string;
    name: string;
    role: Role;
    tier: Tier;
    onboardingComplete?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => void;
    updateRole: (role: Role) => void;
    updateTier: (tier: Tier) => void;
    hasPermission: (allowedRoles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, email?: string) => {
        try {
            const { data: profile, error } = await (supabase as any)
                .from('profiles')
                .select(`
                    *,
                    organizations (
                        tier,
                        onboarding_complete
                    )
                `)
                .eq('id', userId)
                .single();

            if (error) throw error;

            if (profile) {
                // Map DB role to Context role
                let role: Role = 'Associate';
                if (profile.role === 'super_admin') role = 'Owner';
                else if (profile.role === 'admin') role = 'Manager';
                else if (profile.role === 'client') role = 'Client';

                // Map DB tier to Context tier
                let tier: Tier = 'Free';
                if (profile.organizations?.tier === 'business') tier = 'Business';
                else if (profile.organizations?.tier === 'solo') tier = 'Solo';
                else if (profile.tier === 'client') tier = 'Client';

                setUser({
                    id: userId,
                    email: email,
                    name: profile.full_name || 'User',
                    role,
                    tier,
                    onboardingComplete: profile.organizations ? !!profile.organizations.onboarding_complete : undefined
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Even if profile fetch fails, we might want to set a basic user from session?
            // For now, let's leave user as null or specific partial state if needed.
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await fetchProfile(session.user.id, session.user.email);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const updateRole = (role: Role) => {
        if (user) {
            setUser({ ...user, role });
            // In a real app, you would also update the DB here
        }
    };

    const updateTier = (tier: Tier) => {
        if (user) {
            setUser({ ...user, tier });
            // In a real app, you would also update the DB here
        }
    };

    const hasPermission = (allowedRoles: Role[]) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateRole, updateTier, hasPermission }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
