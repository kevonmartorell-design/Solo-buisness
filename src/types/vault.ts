export interface VaultItem {
    id: string;
    name: string;
    type: 'License' | 'ID' | 'Certificate' | 'Training' | 'Contract';
    status: 'Verified' | 'Pending' | 'Expiring' | 'Expired';
    expiryDate: string; // YYYY-MM-DD
    category: string;
    fileData?: string; // Base64 string
    fileName?: string;
    fileSize?: string;
    lastUpdated: string;
}

export interface VaultCategory {
    id: string;
    name: string;
    color: string;
    icon: string; // 'Shield' | 'FileText' | 'CheckCircle' | 'Folder' | etc.
}
