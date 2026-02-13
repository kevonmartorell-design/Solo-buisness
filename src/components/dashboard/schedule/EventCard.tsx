import { ArrowLeftRight, Clock, User } from 'lucide-react';
import type { Event, Resource } from '../../../types/schedule';

interface EventCardProps {
    event: Event;
    resource?: Resource;
    onSwapRequest: (id: string) => void;
}

const EventCard = ({ event, resource, onSwapRequest }: EventCardProps) => {
    const isTimeOff = event.type === 'TimeOff';

    // Status Styles
    const getStatusStyles = () => {
        if (event.status === 'swap-requested') return 'border-blue-300 bg-blue-50 dark:bg-blue-900/10';
        if (event.status === 'pending') return 'border-amber-300 bg-amber-50 dark:bg-amber-900/10';
        if (isTimeOff) return 'border-slate-300 bg-slate-100 dark:bg-slate-800';
        return 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1917]';
    };

    return (
        <div className="flex gap-4 group">
            <div className="w-16 pt-2 text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{event.startTime}</p>
                <p className="text-xs text-slate-500">{event.duration}</p>
            </div>
            <div className={`flex-1 p-4 rounded-xl border ${getStatusStyles()} shadow-sm relative transition-colors`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className={`font-bold ${isTimeOff ? 'text-slate-500 italic' : 'text-slate-900 dark:text-white'}`}>
                            {event.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            {isTimeOff ? <Clock className="w-3 h-3" /> : null}
                            {event.type}
                        </p>
                    </div>
                    {resource && (
                        <img src={resource.avatar} title={resource.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#211611]" />
                    )}
                    {isTimeOff && !resource && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500">
                            <User className="w-4 h-4" />
                        </div>
                    )}
                </div>

                {/* Actions */}
                {!isTimeOff && event.status === 'approved' && (
                    <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onSwapRequest(event.id)}
                            className="text-xs font-bold text-slate-400 hover:text-[#de5c1b] flex items-center gap-1"
                        >
                            <ArrowLeftRight className="w-3 h-3" /> Request Swap
                        </button>
                    </div>
                )}
                {event.status === 'swap-requested' && (
                    <div className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded inline-block">
                        Swap Requested
                    </div>
                )}
                {event.status === 'pending' && isTimeOff && (
                    <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/20 px-2 py-1 rounded inline-block">
                        Pending Approval
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
