import { useAuth } from '../../contexts/AuthContext';
import Overview from './Overview';
import ClientOverview from '../../components/dashboard/ClientOverview';
import SoloOverview from './SoloOverview';
import AssociateOverview from './AssociateOverview';

const DashboardHome = () => {
    const { user } = useAuth();

    if (user?.role === 'Associate') {
        return <AssociateOverview />;
    }

    if (user?.tier === 'Free') {
        return <ClientOverview />;
    }

    if (user?.tier === 'Solo') {
        return <SoloOverview />;
    }

    return <Overview />;
};

export default DashboardHome;
