import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Megaphone, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    created_at: string;
    profiles: {
        name: string;
        avatar_url: string;
    } | null;
}

const AnnouncementsWidget = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        if (user) {
            fetchAnnouncements();
        }
    }, [user]);

    const fetchAnnouncements = async () => {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', user?.id)
                .single();

            if (!profile?.organization_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('announcements')
                .select(`
                    id,
                    title,
                    content,
                    priority,
                    created_at,
                    profiles:author_id(name, avatar_url)
                `)
                .eq('organization_id', profile.organization_id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            // The supabase type generated maps this properly, but we'll cast safely for our interface
            setAnnouncements(data as any || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
            default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Announcements</h3>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            ) : announcements.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>No new announcements.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className={`p-4 rounded-xl border ${getPriorityColor(announcement.priority)} transition-colors`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-sm">{announcement.title}</h4>
                                <span className="text-xs opacity-80 whitespace-nowrap ml-2">
                                    {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm opacity-90 mb-3 line-clamp-2">
                                {announcement.content}
                            </p>
                            <div className="flex items-center gap-2">
                                {announcement.profiles?.avatar_url ? (
                                    <img src={announcement.profiles.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                                        {announcement.profiles?.name?.charAt(0) || '?'}
                                    </div>
                                )}
                                <span className="text-xs font-medium opacity-80">
                                    {announcement.profiles?.name || 'Management'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnnouncementsWidget;
