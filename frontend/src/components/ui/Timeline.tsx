import { format } from 'date-fns';
import { Phone, Users, Mail, FileText, CheckCircle, Circle } from 'lucide-react';
import { type Activity } from '../../features/activities/activities-api';
import { cn } from '../../lib/utils';

interface TimelineProps {
    activities: Activity[];
    isLoading?: boolean;
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
    switch (type) {
        case 'CALL':
            return <Phone className="h-4 w-4 text-blue-400" />;
        case 'MEETING':
            return <Users className="h-4 w-4 text-purple-400" />;
        case 'EMAIL':
            return <Mail className="h-4 w-4 text-orange-400" />;
        case 'NOTE':
            return <FileText className="h-4 w-4 text-slate-400" />;
        default:
            return <Circle className="h-4 w-4 text-green-400" />;
    }
};

export const Timeline = ({ activities, isLoading }: TimelineProps) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                            <div className="h-4 w-4 rounded-full bg-slate-700 animate-pulse" />
                            {i !== 3 && <div className="w-px flex-1 bg-slate-700" />}
                        </div>
                        <div className="flex-1 space-y-2 pb-4">
                            <div className="h-4 w-1/4 bg-slate-700 rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-slate-800 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <p>No activity history found.</p>
            </div>
        );
    }

    return (
        <div className="relative space-y-0">
            {activities.map((activity, index) => (
                <div key={activity.id} className="group relative flex gap-4">
                    {/* Vertical Line */}
                    <div className="relative flex flex-col items-center">
                        <div
                            className={cn(
                                "z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-surface",
                                activity.completed ? "border-primary/50" : "border-slate-700"
                            )}
                        >
                            {activity.completed ? (
                                <CheckCircle className="h-4 w-4 text-primary-light" />
                            ) : (
                                <ActivityIcon type={activity.type} />
                            )}
                        </div>
                        {index !== activities.length - 1 && (
                            <div className="absolute top-8 h-full w-px bg-slate-800 group-hover:bg-slate-700 transition-colors" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h4 className={cn(
                                "font-medium text-slate-200",
                                activity.completed && "line-through text-slate-500"
                            )}>
                                {activity.subject}
                            </h4>
                            <time className="text-xs text-slate-500">
                                {format(new Date(activity.createdAt), 'PPP p')}
                            </time>
                        </div>
                        {activity.description && (
                            <p className="text-sm text-slate-400 line-clamp-2">{activity.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {activity.type}
                            </span>
                            {activity.completed && (
                                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary-light border border-primary/20">
                                    COMPLETED
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
