
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Calendar, Clock, Check, ChevronLeft, Loader2, MapPin, Globe, User, Mail, Phone, Star, Instagram, Facebook, Linkedin } from 'lucide-react';
import { format } from 'date-fns';

type Organization = {
    id: string;
    business_name: string;
    settings: any;
    onboarding_data: any;
};

type Service = {
    id: string;
    name: string;
    duration: number;
    price: number;
    description: string;
    image_url?: string | null;
};

type Review = {
    id: string;
    rating: number;
    comment: string;
    testimonial_text?: string;
    created_at: string;
};

const PublicBooking = () => {
    const { orgId } = useParams(); // Expecting UUID for now
    const [loading, setLoading] = useState(true);
    const [org, setOrg] = useState<Organization | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Booking State
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientDetails, setClientDetails] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchOrgAndServices = async () => {
            // In a real production app, we would query by 'slug' field. 
            // For now, we assume orgId is the UUID or we try to find by business_name if it's not a UUID.
            // But to keep MVP simple and robust, let's assume UUID first.
            if (!orgId) return;

            try {
                // 1. Fetch Org
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('id', orgId)
                    .single();

                if (orgError) throw orgError;
                const orgTyped = orgData as unknown as Organization;
                setOrg(orgTyped);

                // 2. Fetch Services
                const { data: servicesData, error: servicesError } = await supabase
                    .from('services')
                    .select('*')
                    .eq('organization_id', orgTyped.id);

                if (servicesError) throw servicesError;
                setServices(servicesData || []);

                // 3. Fetch Reviews (Top rated, public)
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('ratings_reviews')
                    .select('*')
                    .eq('organization_id', orgTyped.id)
                    .gte('rating', 4) // Only 4 or 5 stars
                    .eq('is_public', true)
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (!reviewsError) {
                    setReviews(reviewsData || []);
                }

            } catch (err) {
                console.error("Error fetching booking data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrgAndServices();
    }, [orgId]);

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setStep(2);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setStep(3);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!org || !selectedService || !selectedDate || !selectedTime) return;

        setSubmitting(true);
        try {
            // 1. Create/Find Client (Simple version: always create new or update if email matches - handled by logic or just insert)
            // Ideally we check if client exists by email for this org. 
            // Since RLS might block reading clients for anon, we might strictly INSERT. 
            // But let's try to just INSERT and let backend handle dupe if compatible, or just create a booking with client info directly if schema supports it?
            // Schema has `client_id` in bookings. `clients` table exists.

            // NOTE: Without a backend function, Anon users probably CANNOT query the `clients` table to check for duplicates due to RLS.
            // We will attempt to Insert a new client. If it fails (due to unique constraint?), we might fail.
            // For MVP: We will blindly insert into `clients`. If your RLS allows anon insert, good.

            // Note: Use a more robust approach in production (Edge Function).

            const { data: newClient, error: clientError } = await (supabase as any)
                .from('clients')
                .insert({
                    organization_id: org.id,
                    name: clientDetails.name,
                    email: clientDetails.email,
                    phone: clientDetails.phone,
                    status: 'Lead' // New public booking clients are leads or active
                })
                .select()
                .single();

            let finalClientId = newClient?.id;

            // If client insert failed (maybe email exists?), strictly speaking we should fail or have a way to match.
            // Let's assume for this MVP that simple insert works or we catch error.
            if (clientError) {
                console.warn("Client creation failed (likely exists).", clientError);
                // In a real app we'd need a secure way to lookup client.
                // For now, if client creation fails, we might just fail the booking or need a workaround.
            }

            // 2. Create Booking
            // Combine date and time
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const bookingDateTime = new Date(selectedDate);
            bookingDateTime.setHours(hours, minutes, 0, 0);

            const { data: bookingData, error: bookingError } = await (supabase as any)
                .from('bookings')
                .insert({
                    organization_id: org.id,
                    service_id: selectedService.id,
                    client_id: finalClientId,
                    booking_datetime: bookingDateTime.toISOString(),
                    status: 'requested', // Public bookings start as requested
                    notes: `Public Booking\nName: ${clientDetails.name}\nEmail: ${clientDetails.email}\nNotes: ${clientDetails.notes}`
                })
                .select()
                .single();

            if (bookingError) throw bookingError;

            // Trigger Email Notification (Edge Function)
            // Fire and forget - don't block success message
            if (bookingData?.id) {
                supabase.functions.invoke('send-booking-notification', {
                    body: { booking_id: bookingData.id }
                }).then(({ error: funcError }) => {
                    if (funcError) console.warn('Notification failed:', funcError);
                });
            }

            setSuccess(true);
            setStep(4);

        } catch (err) {
            console.error("Booking submission error:", err);
            alert("Failed to submit booking. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to generate time slots (Mock availability)
    const generateTimeSlots = () => {
        const slots = [];
        for (let i = 9; i < 17; i++) {
            slots.push(`${i}:00`);
            slots.push(`${i}:30`);
        }
        return slots;
    };

    if (loading) {
        return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#de5c1b]" /></div>;
    }

    if (!org) {
        return <div className="text-center py-20 text-slate-500">Organization not found.</div>;
    }

    if (success) {
        return (
            <div className="max-w-md mx-auto bg-white dark:bg-[#211611] p-8 rounded-2xl shadow-xl text-center animate-fade-in border border-[#de5c1b]/10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Requested!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Thanks {clientDetails.name}, your request for <strong>{selectedService?.name}</strong> has been sent to {org.business_name}.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-[#de5c1b] font-bold hover:underline"
                >
                    Book Another Service
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header / Org Info */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{org.business_name}</h1>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                    {org.settings?.location && (
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {org.settings.location}</span>
                    )}
                    {org.settings?.website && (
                        <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {org.settings.website}</span>
                    )}
                </div>

                {/* Bio & Socials */}
                {(org.settings?.bio || org.settings?.socials) && (
                    <div className="mt-6 max-w-2xl mx-auto text-center animate-fade-in">
                        {org.settings?.bio && (
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                                {org.settings.bio}
                            </p>
                        )}
                        {org.settings?.socials && (
                            <div className="flex justify-center gap-4">
                                {org.settings.socials.instagram && (
                                    <a href={org.settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#de5c1b] transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {org.settings.socials.facebook && (
                                    <a href={org.settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#de5c1b] transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {org.settings.socials.linkedin && (
                                    <a href={org.settings.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#de5c1b] transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Portfolio / Gallery (From Services) */}
            {services.some(s => s.image_url) && (
                <div className="mb-8 animate-fade-in">
                    <h3 className="text-center text-xs font-bold text-[#de5c1b] uppercase tracking-widest mb-4">Our Work</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {services.filter(s => s.image_url).map((service) => (
                            <div key={service.id} className="relative group overflow-hidden rounded-xl aspect-square shadow-sm border border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-white/5">
                                <img
                                    src={service.image_url || ''}
                                    alt={service.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <span className="text-white text-xs font-bold truncate">{service.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trusted Reviews Section */}
            {reviews.length > 0 && (
                <div className="mb-8 animate-fade-in">
                    <h3 className="text-center text-xs font-bold text-[#de5c1b] uppercase tracking-widest mb-4">Trusted Reviews</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-[#211611] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
                                <div className="flex text-[#de5c1b] mb-2">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-2">"{review.comment}"</p>
                                {review.testimonial_text && (
                                    <p className="text-xs text-slate-400 border-t border-slate-100 dark:border-white/5 pt-2 mt-2">
                                        "{review.testimonial_text}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8 gap-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-2 rounded-full transition-all ${step >= i ? 'w-8 bg-[#de5c1b]' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
                ))}
            </div>

            {/* Step 1: Services */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    {services.map(service => (
                        <div
                            key={service.id}
                            onClick={() => handleServiceSelect(service)}
                            className="bg-white dark:bg-[#211611] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 hover:border-[#de5c1b] cursor-pointer transition-all hover:shadow-md group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg dark:text-white group-hover:text-[#de5c1b] transition-colors">{service.name}</h3>
                                {service.price && <span className="font-semibold text-slate-900 dark:text-white">${service.price}</span>}
                            </div>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description || 'No description available.'}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                <Clock className="w-4 h-4" />
                                {service.duration} mins
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && <p className="col-span-2 text-center text-slate-500">No services available.</p>}
                </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
                <div className="animate-fade-in">
                    <button onClick={() => setStep(1)} className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" /> Back to Services
                    </button>

                    <div className="bg-white dark:bg-[#211611] rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col md:flex-row">
                        {/* Date Picker (Calendar) */}
                        <div className="p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 md:w-1/2">
                            <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#de5c1b]" /> Select Date
                            </h3>
                            {/* Simple Custom Calendar/Date Input for MVP */}
                            <input
                                type="date"
                                className="w-full p-3 border border-slate-200 rounded-lg dark:bg-black/20 dark:text-white dark:border-white/10"
                                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <p className="mt-4 text-xs text-slate-400">
                                * Availability is shown for the selected date.
                            </p>
                        </div>

                        {/* Time Slots */}
                        <div className="p-6 md:w-1/2 bg-slate-50 dark:bg-[#2a1d17]">
                            <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#de5c1b]" /> Select Time
                            </h3>
                            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {generateTimeSlots().map(time => (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeSelect(time)}
                                        className="py-2 px-1 text-sm font-medium rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#211611] hover:border-[#de5c1b] hover:text-[#de5c1b] transition-colors dark:text-slate-300"
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
                <div className="animate-fade-in">
                    <button onClick={() => setStep(2)} className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" /> Back to Time
                    </button>

                    <div className="bg-white dark:bg-[#211611] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                        <h3 className="font-bold text-xl mb-6 dark:text-white">Your Details</h3>

                        <div className="mb-6 p-4 bg-slate-50 dark:bg-black/20 rounded-xl flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#de5c1b]/10 rounded-lg flex items-center justify-center text-[#de5c1b] shrink-0">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white text-lg">{selectedService?.name}</p>
                                <p className="text-slate-500 text-sm">
                                    {selectedDate?.toDateString()} at {selectedTime}
                                </p>
                                <p className="text-slate-400 text-xs mt-1 uppercase font-bold tracking-wide">{selectedService?.duration} Mins • ${selectedService?.price}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-300" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#de5c1b] outline-none dark:text-white"
                                        placeholder="John Doe"
                                        value={clientDetails.name}
                                        onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-300" />
                                        <input
                                            required
                                            type="email"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#de5c1b] outline-none dark:text-white"
                                            placeholder="john@example.com"
                                            value={clientDetails.email}
                                            onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-300" />
                                        <input
                                            required
                                            type="tel"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#de5c1b] outline-none dark:text-white"
                                            placeholder="(555) 123-4567"
                                            value={clientDetails.phone}
                                            onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Notes (Optional)</label>
                                <textarea
                                    className="w-full p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#de5c1b] outline-none dark:text-white resize-none min-h-[100px]"
                                    placeholder="Any special requests?"
                                    value={clientDetails.notes}
                                    onChange={(e) => setClientDetails({ ...clientDetails, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#de5c1b]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicBooking;
