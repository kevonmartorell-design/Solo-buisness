import React, { createContext, useContext, useState, useEffect } from 'react';
import type { VaultItem, VaultCategory } from '../types/vault';

interface VaultContextType {
    documents: VaultItem[];
    addDocument: (doc: Omit<VaultItem, 'id' | 'lastUpdated'>) => void;
    deleteDocument: (id: string) => void;
    updateDocument: (id: string, updates: Partial<VaultItem>) => void;
    getExpiringDocuments: () => VaultItem[];
    // Customization
    industry: string;
    updateIndustry: (ind: string) => void;
    customCategories: VaultCategory[];
    addCategory: (cat: Omit<VaultCategory, 'id'>) => void;
    deleteCategory: (id: string) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

// Initial Seed Data (so the vault isn't empty on first load)
const INITIAL_DOCS: VaultItem[] = [
    {
        id: 'd1',
        name: 'Medical First Responder',
        type: 'License',
        status: 'Expiring',
        expiryDate: '2026-03-01',
        category: 'Licenses',
        fileSize: '2.4 MB',
        lastUpdated: '2024-03-01'
    },
    {
        id: 'd2',
        name: "State Driver's License",
        type: 'ID',
        status: 'Verified',
        expiryDate: '2028-08-15',
        category: 'IDs',
        fileSize: '1.1 MB',
        lastUpdated: '2023-08-15'
    }
];

const DEFAULT_CATEGORIES: VaultCategory[] = [
    { id: 'f1', name: 'IDs', color: 'blue', icon: 'Shield' },
    { id: 'f2', name: 'Licenses', color: 'orange', icon: 'FileText' },
    { id: 'f3', name: 'Training', color: 'emerald', icon: 'CheckCircle' },
    { id: 'f4', name: 'Legal', color: 'purple', icon: 'Folder' },
];

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [documents, setDocuments] = useState<VaultItem[]>(() => {
        const saved = localStorage.getItem('vault_documents');
        return saved ? JSON.parse(saved) : INITIAL_DOCS;
    });

    const [industry, setIndustry] = useState(() => localStorage.getItem('vault_industry') || 'General');
    const [customCategories, setCustomCategories] = useState<VaultCategory[]>(() => {
        const saved = localStorage.getItem('vault_categories');
        return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    });

    useEffect(() => {
        localStorage.setItem('vault_documents', JSON.stringify(documents));
    }, [documents]);

    useEffect(() => {
        localStorage.setItem('vault_industry', industry);
    }, [industry]);

    useEffect(() => {
        localStorage.setItem('vault_categories', JSON.stringify(customCategories));
    }, [customCategories]);

    const addDocument = (doc: Omit<VaultItem, 'id' | 'lastUpdated'>) => {
        const newDoc: VaultItem = {
            ...doc,
            id: crypto.randomUUID(),
            lastUpdated: new Date().toISOString().split('T')[0],
            status: 'Pending' // Default status for new uploads
        };

        // Auto-calculate status based on expiry
        if (newDoc.expiryDate) {
            const today = new Date();
            const expiry = new Date(newDoc.expiryDate);
            const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (daysUntil < 0) newDoc.status = 'Expired';
            else if (daysUntil <= 30) newDoc.status = 'Expiring';
            else newDoc.status = 'Verified';
        }

        setDocuments(prev => [newDoc, ...prev]);
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    const updateDocument = (id: string, updates: Partial<VaultItem>) => {
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    };

    const getExpiringDocuments = () => {
        const today = new Date();
        return documents.filter(doc => {
            if (!doc.expiryDate) return false;
            const expiry = new Date(doc.expiryDate);
            const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return days <= 30 && days >= 0;
        });
    };

    const updateIndustry = (ind: string) => setIndustry(ind);

    const addCategory = (cat: Omit<VaultCategory, 'id'>) => {
        const newCat = { ...cat, id: crypto.randomUUID() };
        setCustomCategories(prev => [...prev, newCat]);
    };

    const deleteCategory = (id: string) => {
        setCustomCategories(prev => prev.filter(c => c.id !== id));
    };

    return (
        <VaultContext.Provider value={{
            documents, addDocument, deleteDocument, updateDocument, getExpiringDocuments,
            industry, updateIndustry, customCategories, addCategory, deleteCategory
        }}>
            {children}
        </VaultContext.Provider>
    );
};

export const useVault = () => {
    const context = useContext(VaultContext);
    if (!context) throw new Error('useVault must be used within a VaultProvider');
    return context;
};
