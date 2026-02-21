import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, ArrowRight, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface CreateBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    employeeId: string;
    onSuccess: () => void;
}

export default function CreateBookingModal({ isOpen, onClose, employeeId, onSuccess }: CreateBookingModalProps) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [employee, setEmployee] = useState<any>(null);
    const [org, setOrg] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceId: '',
        date: '',
        time: '',
        notes: ''
    });

    useEffect(() => {
        if (!isOpen || !employeeId) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                // 1. Get Employee Profile & Org
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, name, avatar_url, role, organization_id, organizations(business_name)')
                    .eq('id', employeeId)
                    .single();

                if (profileError || !profileData) throw new Error('Employee not found');
                setEmployee(profileData);
                setOrg((profileData as any).organizations);

                // 2. Get Services for that Org
                const { data: servicesData, error: servicesError } = await supabase
                    .from('services')
                    .select('*')
                    .eq('organization_id', (profileData as any).organization_id);

                if (servicesError) throw servicesError;
                setServices(servicesData || []);
            } catch (err) {
                console.error('Fetch error:', err);
                toast.error("Could not load booking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [employeeId, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId || !org) return;

        setSubmitting(true);
        try {
            let clientId = null;

            // Try to find existing client by phone or email
            let clientQuery = supabase.from('clients').select('id').eq('organization_id', employee.organization_id);
            if (formData.email) clientQuery = clientQuery.eq('email', formData.email);
            else if (formData.phone) clientQuery = clientQuery.eq('phone', formData.phone);

            const { data: existingClients } = await clientQuery;

            if (existingClients && existingClients.length > 0) {
                clientId = (existingClients[0] as any).id;
            } else {
                // Create new client
                const { data: newClient, error: clientError } = await supabase
                    .from('clients')
                    .insert({
                        organization_id: (employee as any).organization_id,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                    } as any)
                    .select('id')
                    .single();

                if (clientError) throw clientError;
                clientId = (newClient as any).id;
            }

            // Combine date & time
            const reqDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

            // Insert Request (we'll make it confirmed since the provider is creating it)
            const { error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    organization_id: employee.organization_id,
                    employee_id: employee.id,
                    client_id: clientId,
                    service_id: formData.serviceId,
                    booking_datetime: reqDateTime,
                    notes: `Notes: ${formData.notes}`,
                    status: 'confirmed'
                } as any);

            if (bookingError) throw bookingError;

            toast.success("Booking created successfully!");
            onSuccess();
            onClose();

            // Reset form
            setFormData({
                name: '', email: '', phone: '', serviceId: '', date: '', time: '', notes: ''
            });

        } catch (err: any) {
            console.error("Booking Error:", err);
            toast.error(err.message || "Failed to create booking.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-[#181311] text-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/10 flex flex-col pointer-events-auto shadow-black/50">
                {/* Header */}
                <div className="sticky top-0 bg-[#181311]/90 backdrop-blur-md z-10 p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold">New Booking</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white/50 hover:text-white" />
                    </button>
                </div>

                <div className="p-6 sm:p-8 flex-1">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#de5c1b]"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Service Selection */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Select Service</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {services.map(service => (
                                        <label
                                            key={service.id}
                                            className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${formData.serviceId === service.id
                                                ? 'bg-[#de5c1b]/20 border-[#de5c1b] shadow-inner shadow-[#de5c1b]/10'
                                                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="service"
                                                value={service.id}
                                                className="sr-only"
                                                checked={formData.serviceId === service.id}
                                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                                required
                                            />
                                            <span className="font-bold">{service.name}</span>
                                            <span className="text-sm text-[#de5c1b] mt-1">${service.price} • {service.duration} mins</span>
                                        </label>
                                    ))}
                                </div>
                                {services.length === 0 && <p className="text-sm text-red-400">No services available.</p>}
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-[#251f1d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] focus:ring-1 focus:ring-[#de5c1b] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Time
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full bg-[#251f1d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] focus:ring-1 focus:ring-[#de5c1b] transition-all"
                                    />
                                </div>
                            </div>

                            <hr className="border-white/10 my-8" />

                            {/* Client Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold mb-4">Client Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#251f1d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] placeholder:text-white/30 focus:ring-1 focus:ring-[#de5c1b] transition-all"
                                        placeholder="Jane Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#251f1d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] placeholder:text-white/30 focus:ring-1 focus:ring-[#de5c1b] transition-all"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Phone
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-[#251f1d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] placeholder:text-white/30 focus:ring-1 focus:ring-[#de5c1b] transition-all"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Additional Notes (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-[#251f1d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] placeholder:text-white/30 min-h-[100px] focus:ring-1 focus:ring-[#de5c1b] transition-all"
                                    placeholder="Any special requests or details..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting || !formData.serviceId}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${submitting || !formData.serviceId
                                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                                    : 'bg-[#de5c1b] hover:bg-[#b84309] text-white shadow-lg shadow-[#de5c1b]/30 hover:shadow-xl hover:shadow-[#de5c1b]/40 active:scale-[0.98]'
                                    }`}
                            >
                                {submitting ? 'Creating Booking...' : 'Create Booking'}
                                {!submitting && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
