import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SidebarContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default to open on desktop (we can refine this with media queries if needed, 
    // but for now let's assume open and let the layout handle hiding on mobile via CSS if not toggled)
    // Actually, to match current "hidden md:flex", desktop is open, mobile is closed.
    // Let's rely on a state that represents "User INTENT".
    // But for simplicity, let's start with true and adjust styling.
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
