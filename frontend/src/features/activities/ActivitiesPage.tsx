import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi, type Activity } from './activities-api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Circle, Calendar, Phone, Mail, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ActivityDialog } from './ActivityDialog';
import { ActionsMenu } from '../../components/ui/ActionsMenu';

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const queryClient = useQueryClient();
    const { data: activities, isLoading } = useQuery({
        queryKey: ['activities'],
        queryFn: activitiesApi.getAll
    });

    const completeMutation = useMutation({
        mutationFn: activitiesApi.completeActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            toast.success('Activity completed');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: activitiesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            toast.success('Activity deleted');
        },
        onError: () => toast.error('Failed to delete activity')
    });

    const handleCreate = () => {
        setSelectedActivity(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (activity: Activity) => {
        setSelectedActivity(activity);
        setIsDialogOpen(true);
    };

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
                <Button onClick={handleCreate}>+ New Activity</Button>
            </div>

            <ActivityDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedActivity}
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
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-md bg-white/5 border border-white/5 group relative">
                                <button
                                    onClick={() => completeMutation.mutate(activity.id)}
                                    className="mt-1 hover:text-primary-light transition-colors"
                                >
                                    <Circle className="h-5 w-5 text-slate-400" />
                                </button>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ActivityIcon type={activity.type} />
                                            <span className="font-medium text-slate-200">{activity.subject}</span>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ActionsMenu
                                                itemName="Activity"
                                                onEdit={() => handleEdit(activity)}
                                                onDelete={() => deleteMutation.mutate(activity.id)}
                                            />
                                        </div>
                                    </div>
                                    {activity.description && <p className="text-sm text-slate-400 line-clamp-2">{activity.description}</p>}
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
                            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-md bg-white/5 opacity-60 group relative">
                                <CheckCircle className="h-5 w-5 text-primary-light" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-slate-300 line-through">{activity.subject}</p>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ActionsMenu
                                                itemName="Activity"
                                                onDelete={() => deleteMutation.mutate(activity.id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
