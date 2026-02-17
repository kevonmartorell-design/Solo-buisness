import React, { createContext, useContext, useState, useEffect } from 'react';
import type { VaultItem, VaultCategory } from '../types/vault';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface VaultContextType {
    documents: VaultItem[];
    addDocument: (doc: Omit<VaultItem, 'id' | 'lastUpdated'>) => Promise<void>;
    deleteDocument: (id: string) => Promise<void>;
    updateDocument: (id: string, updates: Partial<VaultItem>) => Promise<void>;
    getExpiringDocuments: () => VaultItem[];
    // Customization
    industry: string;
    updateIndustry: (ind: string) => void;
    customCategories: VaultCategory[];
    addCategory: (cat: Omit<VaultCategory, 'id'>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    loading: boolean;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<VaultItem[]>([]);
    const [customCategories, setCustomCategories] = useState<VaultCategory[]>([]);
    const [industry, setIndustry] = useState(() => localStorage.getItem('vault_industry') || 'General');
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setDocuments([]);
                setCustomCategories([]);
                setLoading(false);
                return;
            }

            try {
                // Get Org ID
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                if (!profile?.organization_id) {
                    setLoading(false);
                    return;
                }
                const orgId = profile.organization_id;

                // Fetch Documents
                const { data: docsData, error: docsError } = await supabase
                    .from('vault_documents')
                    .select('*')
                    .eq('organization_id', orgId)
                    .order('created_at', { ascending: false });

                if (docsError) throw docsError;

                if (docsData) {
                    setDocuments(docsData.map((d: any) => ({
                        id: d.id,
                        name: d.name,
                        type: d.type || 'License',
                        status: d.status || 'Verified',
                        expiryDate: d.expiry_date || '',
                        category: d.category || 'General',
                        fileSize: d.file_size || '0 MB',
                        lastUpdated: new Date(d.updated_at).toISOString().split('T')[0],
                        fileData: d.file_data,
                        fileName: d.file_name
                    })));
                }

                // Fetch Categories
                const { data: catsData, error: catsError } = await supabase
                    .from('vault_categories')
                    .select('*')
                    .eq('organization_id', orgId);

                if (catsError) throw catsError;

                if (catsData) {
                    setCustomCategories(catsData.map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        color: c.color || 'blue',
                        icon: c.icon || 'Folder'
                    })));
                }

            } catch (error) {
                console.error('Error fetching vault data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Save Industry to LocalStorage (Theme preference)
    useEffect(() => {
        localStorage.setItem('vault_industry', industry);
    }, [industry]);

    const addDocument = async (doc: Omit<VaultItem, 'id' | 'lastUpdated'>) => {
        if (!user) return;
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) return;

            // Auto-calculate status
            let status: VaultItem['status'] = 'Pending';
            if (doc.expiryDate) {
                const today = new Date();
                const expiry = new Date(doc.expiryDate);
                const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                if (daysUntil < 0) status = 'Expired';
                else if (daysUntil <= 30) status = 'Expiring';
                else status = 'Verified';
            }

            const newDoc = {
                organization_id: profile.organization_id,
                name: doc.name,
                type: doc.type,
                category: doc.category,
                expiry_date: doc.expiryDate || null,
                status: status,
                file_size: doc.fileSize,
                file_name: doc.fileName,
                file_data: doc.fileData // Storing base64 text
            };

            const { data, error } = await supabase
                .from('vault_documents')
                .insert([newDoc])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const mappedDoc: VaultItem = {
                    id: data.id,
                    name: data.name,
                    type: data.type,
                    status: data.status,
                    expiryDate: data.expiry_date,
                    category: data.category,
                    fileSize: data.file_size,
                    lastUpdated: new Date(data.updated_at).toISOString().split('T')[0],
                    fileData: data.file_data,
                    fileName: data.file_name
                };
                setDocuments(prev => [mappedDoc, ...prev]);
            }
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            const { error } = await supabase
                .from('vault_documents')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setDocuments(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const updateDocument = async (id: string, updates: Partial<VaultItem>) => {
        // Implementation for update if needed later
        console.log('Update not fully implemented yet for:', id, updates);
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

    const addCategory = async (cat: Omit<VaultCategory, 'id'>) => {
        if (!user) return;
        try {
            // Fetch Org ID again... should probably store this in context or helper
            const { data: profile } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) return;

            const { data, error } = await supabase
                .from('vault_categories')
                .insert([{
                    organization_id: profile.organization_id,
                    name: cat.name,
                    color: cat.color,
                    icon: cat.icon
                }])
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setCustomCategories(prev => [...prev, {
                    id: data.id,
                    name: data.name,
                    color: data.color,
                    icon: data.icon
                }]);
            }

        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const { error } = await supabase
                .from('vault_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCustomCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <VaultContext.Provider value={{
            documents, addDocument, deleteDocument, updateDocument, getExpiringDocuments,
            industry, updateIndustry, customCategories, addCategory, deleteCategory, loading
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
