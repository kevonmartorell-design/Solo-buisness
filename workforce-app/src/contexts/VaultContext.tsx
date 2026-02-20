import React, { createContext, useContext, useState, useEffect } from 'react';
import type { VaultItem, VaultCategory } from '../types/vault';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface VaultContextType {
    documents: VaultItem[];
    addDocument: (doc: Omit<VaultItem, 'id' | 'lastUpdated'>, file?: File) => Promise<void>;
    deleteDocument: (id: string) => Promise<void>;
    updateDocument: (id: string, updates: Partial<VaultItem>) => Promise<void>;
    getExpiringDocuments: () => VaultItem[];
    // Customization
    getDocumentUrl: (id: string) => Promise<string | null>;
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
    const [industry, setIndustry] = useState('General');
    const [loading, setLoading] = useState(true);

    // ... (existing code)

    const getDocumentUrl = async (id: string): Promise<string | null> => {
        try {
            const { data: doc } = await (supabase as any)
                .from('vault_documents')
                .select('file_path')
                .eq('id', id)
                .single();

            if (!doc?.file_path) return null;

            const { data, error } = await supabase.storage
                .from('vault_documents')
                .createSignedUrl(doc.file_path, 60 * 60); // 1 hour expiry

            if (error) throw error;
            return data.signedUrl;
        } catch (error) {
            console.error('Error getting document URL:', error);
            return null;
        }
    };

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setDocuments([]);
                setCustomCategories([]);
                setIndustry('General');
                setLoading(false);
                return;
            }

            try {
                // Get Org ID
                const { data: profile } = await (supabase as any)
                    .from('profiles')
                    .select('organization_id')
                    .eq('id', user.id)
                    .single();

                if (!profile?.organization_id) {
                    setLoading(false);
                    return;
                }
                const orgId = profile.organization_id;

                // Get Organization Data (Industry)
                const { data: org } = await (supabase as any)
                    .from('organizations')
                    .select('onboarding_data')
                    .eq('id', orgId)
                    .single();

                if (org?.onboarding_data) {
                    const onboardingData = org.onboarding_data as any; // Still cast JSON to any for safety or define structure
                    if (onboardingData.industry) {
                        setIndustry(onboardingData.industry);
                    }
                }

                // Fetch Documents
                const { data: docsData, error: docsError } = await (supabase as any)
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
                        status: (d.status as VaultItem['status']) || 'Verified',
                        expiryDate: d.expiry_date || '',
                        category: d.category || 'General',
                        fileSize: d.file_size || '0 MB',
                        lastUpdated: new Date(d.updated_at).toISOString().split('T')[0],
                        fileData: d.file_data || undefined,
                        fileName: d.file_name || undefined
                    })));
                }

                // Fetch Categories
                const { data: catsData, error: catsError } = await (supabase as any)
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

    const addDocument = async (doc: Omit<VaultItem, 'id' | 'lastUpdated'>, file?: File) => {
        if (!user) return;
        try {
            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) return;
            const orgId = profile.organization_id;

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

            let filePath = null;
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                filePath = `${orgId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('vault_documents')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;
            }

            const newDoc = {
                organization_id: orgId,
                name: doc.name,
                type: doc.type,
                category: doc.category,
                expiry_date: doc.expiryDate || null,
                status: status,
                file_size: doc.fileSize,
                file_name: doc.fileName,
                file_path: filePath,
            };

            const { data, error } = await (supabase as any)
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
                    status: data.status as VaultItem['status'],
                    expiryDate: data.expiry_date || '',
                    category: data.category || 'General',
                    fileSize: data.file_size || '0 MB',
                    lastUpdated: new Date(data.updated_at).toISOString().split('T')[0],
                    fileData: undefined, // No longer keeping base64 in state for all docs (performance)
                    fileName: data.file_name || undefined
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
            // Get file path first
            const { data: doc } = await (supabase as any)
                .from('vault_documents')
                .select('file_path')
                .eq('id', id)
                .single();

            if (doc?.file_path) {
                await supabase.storage
                    .from('vault_documents')
                    .remove([doc.file_path]);
            }

            // Delete record
            const { error } = await (supabase as any)
                .from('vault_documents')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setDocuments(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const updateDocument = async (_id: string, _updates: Partial<VaultItem>) => {
        // Implementation for update if needed later

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

    const updateIndustry = async (ind: string) => {
        setIndustry(ind);

        if (!user) return;

        try {
            // Get Org ID
            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) return;

            // Fetch current onboarding data first to merge
            const { data: org } = await (supabase as any)
                .from('organizations')
                .select('onboarding_data')
                .eq('id', profile.organization_id)
                .single();

            const currentData = (org?.onboarding_data as any) || {};
            const updatedData = { ...currentData, industry: ind };

            await (supabase as any)
                .from('organizations')
                .update({ onboarding_data: updatedData })
                .eq('id', profile.organization_id);

        } catch (error) {
            console.error('Error updating industry:', error);
        }
    };

    const addCategory = async (cat: Omit<VaultCategory, 'id'>) => {
        if (!user) return;
        try {
            // Fetch Org ID again... should probably store this in context or helper
            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) return;

            const { data, error } = await (supabase as any)
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
                    color: data.color || 'blue',
                    icon: data.icon || 'Folder'
                }]);
            }

        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const { error } = await (supabase as any)
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
            documents, addDocument, deleteDocument, updateDocument, getExpiringDocuments, getDocumentUrl,
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
