import { useAuth } from '../../contexts/AuthContext';
import Overview from './Overview';
import ClientOverview from '../../components/dashboard/ClientOverview';
import SoloOverview from './SoloOverview';

const DashboardHome = () => {
    const { user } = useAuth();

    if (user?.tier === 'Free') {
        return <ClientOverview />;
    }

    if (user?.tier === 'Solo') {
        return <SoloOverview />;
    }

    return <Overview />;
};

export default DashboardHome;
