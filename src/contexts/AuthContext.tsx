import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'Owner' | 'Manager' | 'Associate';
export type Tier = 'Free' | 'Solo' | 'Business';

interface User {
    id: string;
    name: string;
    role: Role;
    tier: Tier;
}

interface AuthContextType {
    user: User | null;
    login: (role?: Role, tier?: Tier) => void;
    logout: () => void;
    updateRole: (role: Role) => void;
    updateTier: (tier: Tier) => void;
    hasPermission: (allowedRoles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Default to a Business Owner for demo purposes
    const [user, setUser] = useState<User | null>({
        id: 'u1',
        name: 'Demo User',
        role: 'Owner',
        tier: 'Business'
    });

    const login = (role: Role = 'Owner', tier: Tier = 'Business') => {
        setUser({
            id: 'u1',
            name: 'Demo User',
            role,
            tier
        });
    };

    const logout = () => {
        setUser(null);
    };

    const updateRole = (role: Role) => {
        if (user) {
            setUser({ ...user, role });
        }
    };

    const updateTier = (tier: Tier) => {
        if (user) {
            setUser({ ...user, tier });
        }
    };

    const hasPermission = (allowedRoles: Role[]) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateRole, updateTier, hasPermission }}>
            {children}
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
