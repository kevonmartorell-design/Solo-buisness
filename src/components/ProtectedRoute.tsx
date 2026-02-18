import { Navigate } from 'react-router-dom';
import { useAuth, type Role, type Tier } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    allowedTiers?: Tier[];
}

const ProtectedRoute = ({ children, allowedRoles, allowedTiers }: ProtectedRouteProps) => {
    const { user, hasPermission } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !hasPermission(allowedRoles)) {
        return <Navigate to="/dashboard" replace />;
    }

    if (allowedTiers && !allowedTiers.includes(user.tier)) {
        return <Navigate to="/dashboard" replace />;
    }

    // New: Check for onboarding completion
    // We allow access if onboardingComplete is undefined (new user without org yet) or true
    // If explicitly false, redirect to onboarding
    if (user.onboardingComplete === false) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
