
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Star, MessageSquare, Check, Loader2 } from 'lucide-react';

const PublicReview = () => {
    const { orgId, bookingId } = useParams();
    const [loading, setLoading] = useState(true);
    const [orgName, setOrgName] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [testimonial, setTestimonial] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchOrg = async () => {
            // In production you might want to verify bookingId validity first to ensure only verified clients review.
            // For now, we trust the link structure or just fetch Org.
            if (!orgId) return;

            try {
                const { data, error } = await supabase
                    .from('organizations')
                    .select('business_name')
                    .eq('id', orgId)
                    .single();

                if (error) throw error;
                setOrgName(data.business_name);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrg();
    }, [orgId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !orgId) return;

        setSubmitting(true);
        try {
            // Find client from booking if available to link it?
            // For now, simple insert.

            const reviewData = {
                organization_id: orgId,
                rating: rating,
                comment: comment,
                testimonial_text: testimonial || null,
                is_public: true, // Auto-publish for MVP or set false for moderation
                // Booking/Client link would go here if we had `client_id` from a secure token or booking lookup
                // booking_id: bookingId // Schema doesn't have booking_id yet in existing types, omitting for now to allow compile
            };

            const { error } = await (supabase as any)
                .from('ratings_reviews')
                .insert(reviewData);

            if (error) throw error;
            setSuccess(true);
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("Could not submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#de5c1b]" /></div>;
    }

    if (success) {
        return (
            <div className="max-w-md mx-auto bg-white dark:bg-[#211611] p-8 rounded-2xl shadow-xl text-center animate-fade-in border border-[#de5c1b]/10 mt-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review Submitted!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Thank you for sharing your feedback on <strong>{orgName}</strong>.
                </p>
                <a href="/" className="text-[#de5c1b] font-bold hover:underline">Return Home</a>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-8">
            <div className="bg-white dark:bg-[#211611] p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-white/5">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Rate your experience</h1>
                    <p className="text-slate-500">How was your service at <span className="text-[#de5c1b] font-bold">{orgName}</span>?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= (hoverRating || rating)
                                        ? 'fill-[#de5c1b] text-[#de5c1b]'
                                        : 'text-slate-200 dark:text-slate-700'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Your Feedback</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                                <textarea
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#de5c1b] outline-none dark:text-white min-h-[120px] resize-none"
                                    placeholder="Tell us about your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Testimonial (Optional)</label>
                            <div className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                                <p className="text-xs text-slate-500 mb-3 italic">"A public testimonial that sits on our profile!"</p>
                                <textarea
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none dark:text-white min-h-[80px] resize-none text-sm"
                                    placeholder="Write a glowing review..."
                                    value={testimonial}
                                    onChange={(e) => setTestimonial(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || rating === 0}
                        className="w-full bg-[#de5c1b] hover:bg-[#de5c1b]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#de5c1b]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PublicReview;
