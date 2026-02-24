import { useAuth } from '../../contexts/AuthContext';
import ClockInOutWidget from '../../components/dashboard/worker/ClockInOutWidget';
import ShiftHistoryWidget from '../../components/dashboard/worker/ShiftHistoryWidget';
import WorkerFinancialsWidget from '../../components/dashboard/worker/WorkerFinancialsWidget';
import AnnouncementsWidget from '../../components/dashboard/worker/AnnouncementsWidget';
import WorkerRatingsWidget from '../../components/dashboard/worker/WorkerRatingsWidget';

const AssociateOverview = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Associate'}
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                    Here's what's happening today.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Priority Actions & Data */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ClockInOutWidget />
                        <WorkerFinancialsWidget />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ShiftHistoryWidget />
                        <WorkerRatingsWidget />
                    </div>
                </div>

                {/* Right Column - Secondary Info */}
                <div className="flex flex-col gap-6">
                    <AnnouncementsWidget />
                </div>
            </div>
        </div>
    );
};

export default AssociateOverview;
