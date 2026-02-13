export interface Resource {
    id: string;
    name: string;
    role: string;
    avatar: string;
    department: 'Field Ops' | 'Management' | 'Sales' | 'Admin';
}

export type EventType = 'Shift' | 'Strategy' | 'Design' | 'Consultation' | 'Installation' | 'Maintenance' | 'TimeOff';

export interface Event {
    id: string;
    title: string;
    type: EventType;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    duration: string;
    date: Date;
    status: 'approved' | 'pending' | 'declined' | 'open' | 'swap-requested';
    resourceId?: string; // Assigned employee
    requester?: string;
    notes?: string;
}
