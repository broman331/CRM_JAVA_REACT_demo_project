import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi, type Activity } from './activities-api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Circle, Calendar, Phone, Mail, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CreateActivityDialog } from './CreateActivityDialog';

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
    switch (type) {
        case 'CALL': return <Phone className="h-4 w-4 text-blue-400" />;
        case 'MEETING': return <Users className="h-4 w-4 text-purple-400" />;
        case 'EMAIL': return <Mail className="h-4 w-4 text-orange-400" />;
        case 'NOTE': return <FileText className="h-4 w-4 text-slate-400" />;
        default: return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
};

export const ActivitiesPage = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const queryClient = useQueryClient();
    const { data: activities, isLoading } = useQuery({
        queryKey: ['activities'],
        queryFn: activitiesApi.getAll
    });

    const completeMutation = useMutation({
        mutationFn: activitiesApi.complete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            toast.success('Activity completed');
        }
    });

    if (isLoading) return <div className="p-4 text-slate-400">Loading activities...</div>;

    const upcoming = activities?.filter(a => !a.completed) || [];
    const completed = activities?.filter(a => a.completed) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Activities</h2>
                    <p className="text-slate-400">Manage your daily tasks and interactions.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>+ New Activity</Button>
            </div>

            <CreateActivityDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary-light" />
                            Upcoming
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcoming.length === 0 && <p className="text-slate-500 text-sm">No upcoming activities.</p>}
                        {upcoming.map(activity => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-md bg-white/5 border border-white/5">
                                <button
                                    onClick={() => completeMutation.mutate(activity.id)}
                                    className="mt-1 hover:text-primary-light transition-colors"
                                >
                                    <Circle className="h-5 w-5 text-slate-400" />
                                </button>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <ActivityIcon type={activity.type} />
                                        <span className="font-medium text-slate-200">{activity.subject}</span>
                                    </div>
                                    {activity.description && <p className="text-sm text-slate-400">{activity.description}</p>}
                                    {activity.dueDate && (
                                        <p className="text-xs text-slate-500">
                                            Due: {format(new Date(activity.dueDate), 'PPP p')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-slate-500" />
                            Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {completed.length === 0 && <p className="text-slate-500 text-sm">No completed activities.</p>}
                        {completed.map(activity => (
                            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-md bg-white/5 opacity-60">
                                <CheckCircle className="h-5 w-5 text-primary-light" />
                                <div>
                                    <p className="font-medium text-slate-300 line-through">{activity.subject}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
