import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type Role, type Tier } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    allowedTiers?: Tier[];
}

const ProtectedRoute = ({ children, allowedRoles, allowedTiers }: ProtectedRouteProps) => {
    const { user, hasPermission } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !hasPermission(allowedRoles)) {
        return <Navigate to="/dashboard" replace />;
    }

    if (allowedTiers && !allowedTiers.includes(user.tier)) {
        return <Navigate to="/upgrade-required" state={{ from: location }} replace />;
    }

    // Check for onboarding completion based on tier
    // Free (Client) users do not need an organization or onboarding
    // Solo and Business users MUST complete onboarding to access the dashboard
    // BYPASS: To skip onboarding and bring users directly to dashboard
    // if (user.tier !== 'Free' && user.onboardingComplete !== true) {
    //     return <Navigate to="/onboarding" replace />;
    // }

    return <>{children}</>;
};

export default ProtectedRoute;
