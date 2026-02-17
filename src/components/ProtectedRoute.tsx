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
        // specific redirect logic could go here, for now default to dashboard
        // which will be smart enough to show them their safe home
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
