import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Star, Loader2, Award } from 'lucide-react';

const WorkerRatingsWidget = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [ratingStats, setRatingStats] = useState({
        average: 4.8,
        total: 24,
        recentFeedback: [
            { id: 1, comment: "Very professional and fast!", rating: 5, date: "2 days ago" },
            { id: 2, comment: "Great service as always.", rating: 5, date: "1 week ago" },
        ]
    });

    useEffect(() => {
        // In a real app, this would fetch from a reviews or ratings table
        // For now, we simulate a loading state and use mock data
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [user]);

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                    <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">{ratingStats.average.toFixed(1)}</span>
                            <div className="mt-1 flex justify-center">
                                {renderStars(ratingStats.average)}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                                {ratingStats.total} total reviews
                            </span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recent Feedback</h4>
                            <div className="space-y-3">
                                {ratingStats.recentFeedback.map((feedback) => (
                                    <div key={feedback.id} className="text-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            {renderStars(feedback.rating)}
                                            <span className="text-xs text-gray-400">{feedback.date}</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 italic line-clamp-2">"{feedback.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerRatingsWidget;
