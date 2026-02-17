import { useAuth } from '../../contexts/AuthContext';
import Overview from './Overview';
import ClientOverview from '../../components/dashboard/ClientOverview';

const DashboardHome = () => {
    const { user } = useAuth();

    if (user?.tier === 'Free') {
        return <ClientOverview />;
    }

    return <Overview />;
};

export default DashboardHome;
