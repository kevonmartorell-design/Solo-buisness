

import { useSidebar } from '../../contexts/SidebarContext';

const TopBar = () => {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#181311]/80 sticky top-0 z-40 backdrop-blur-md">
            <div className="flex items-center gap-4 md:hidden">
                <button onClick={toggleSidebar} className="size-10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
            </div>

            <div className="flex-1 flex justify-end md:justify-between items-center">
                <h1 className="text-lg font-bold tracking-tight uppercase text-white font-display hidden md:block">Dashboard</h1>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                        <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-bold text-primary">SYSTEMS NOMINAL</span>
                    </div>

                    <button className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
