import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function PublicBooking() {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

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
        const fetchDetails = async () => {
            if (!employeeId) return;

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
    }, [employeeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId || !org) return;

        setSubmitting(true);
        try {
            // First, find or create the client based on email/phone
            // For MVP simplicity without deep client management logic on public route:
            // Let's create a Client record if one doesn't exist to link the request.
            // *Wait*, we can just insert the 'appointment_requests' without a formal client_id if we adjust schema, 
            // OR create a quick client record. Let's create a client record.

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

            // Insert Request
            const { error: requestError } = await supabase
                .from('appointment_requests')
                .insert({
                    organization_id: employee.organization_id,
                    employee_id: employee.id,
                    client_id: clientId,
                    service_id: formData.serviceId,
                    requested_datetime: reqDateTime,
                    notes: `Notes: ${formData.notes}`,
                    status: 'requested'
                } as any);

            if (requestError) throw requestError;

            setSuccess(true);
            toast.success("Request sent successfully!");

        } catch (err: any) {
            console.error("Booking Error:", err);
            toast.error(err.message || "Failed to submit booking request.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#181311] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#de5c1b]"></div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-[#181311] flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Provider Not Found</h2>
                    <p className="text-white/60">The booking link you followed might be invalid.</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#181311] flex flex-col items-center justify-center text-white p-6 font-display">
                <div className="w-full max-w-md bg-[#251f1d] p-8 rounded-2xl border border-white/10 text-center shadow-xl">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Request Sent!</h2>
                    <p className="text-white/70 mb-8">
                        Your appointment request has been sent to {employee.name}.
                        You will receive a notification once it has been approved.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                    >
                        Book Another Service
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#181311] text-white py-12 px-4 sm:px-6 flex justify-center font-display">
            <div className="w-full max-w-2xl">

                {/* Header Profile */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-24 h-24 rounded-full border-4 border-[#de5c1b] overflow-hidden mb-4 bg-[#251f1d]">
                        {employee.avatar_url ? (
                            <img src={employee.avatar_url} alt={employee.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-full h-full p-4 text-white/20" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold mb-1">{employee.name}</h1>
                    <p className="text-[#de5c1b] font-medium tracking-wide uppercase text-sm mb-2">{employee.role.replace('_', ' ')}</p>
                    {org && <p className="text-white/50">{org.business_name}</p>}
                </div>

                {/* Booking Form */}
                <div className="bg-[#251f1d] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Request an Appointment</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Service Selection */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Select Service</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {services.map(service => (
                                    <label
                                        key={service.id}
                                        className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${formData.serviceId === service.id
                                            ? 'bg-[#de5c1b]/20 border-[#de5c1b]'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
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
                                    className="w-full bg-[#181311] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b]"
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
                                    className="w-full bg-[#181311] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b]"
                                />
                            </div>
                        </div>

                        <hr className="border-white/10 my-8" />

                        {/* Client Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold mb-4">Your Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#181311] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] placeholder:text-white/30"
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
                                        className="w-full bg-[#181311] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] placeholder:text-white/30"
                                        placeholder="jane@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Phone (Required for SMS)
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-[#181311] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] placeholder:text-white/30"
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
                                className="w-full bg-[#181311] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#de5c1b] placeholder:text-white/30 min-h-[100px]"
                                placeholder="Any special requests or details..."
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting || !formData.serviceId}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${submitting || !formData.serviceId
                                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                                : 'bg-[#de5c1b] hover:bg-[#b84309] text-white shadow-lg shadow-[#de5c1b]/30 hover:shadow-xl hover:shadow-[#de5c1b]/40'
                                }`}
                        >
                            {submitting ? 'Sending Request...' : 'Send Request'}
                            {!submitting && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <p className="text-xs text-white/40">Powered by AEGIS CERT</p>
                </div>
            </div>
        </div>
    );
}
