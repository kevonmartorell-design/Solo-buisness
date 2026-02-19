
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';

import { useSidebar } from '../contexts/SidebarContext';

const DashboardLayout = () => {
    const { isSidebarOpen } = useSidebar();

    return (
        <div className="bg-[#181311] min-h-screen text-white flex font-display">
            <Sidebar />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
                <TopBar />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
