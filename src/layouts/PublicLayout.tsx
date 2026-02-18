
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#151210] font-display flex flex-col">
            {/* Minimal Header */}
            <header className="bg-white dark:bg-[#211611] border-b border-slate-200 dark:border-white/10 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    {/* Placeholder Logo - In real app, this would be the Org's logo if available */}
                    <div className="bg-[#de5c1b] w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        W
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">WorkForce</span>
                </div>
                {/* Optional: Login Link for existing users */}
                <a href="/login" className="text-sm font-bold text-[#de5c1b] hover:text-[#de5c1b]/80 transition-colors">
                    Vendor Login
                </a>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-[#211611] border-t border-slate-200 dark:border-white/10 py-8 text-center">
                <p className="text-xs text-slate-500 font-medium">
                    Powered by <span className="text-[#de5c1b] font-bold">WorkForce</span>
                </p>
            </footer>
        </div>
    );
};

export default PublicLayout;
