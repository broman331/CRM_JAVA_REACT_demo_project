import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi, type Activity } from './activities-api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { X, Calendar as CalendarIcon, Clock, Type } from 'lucide-react';
import { toast } from 'sonner';

interface CreateActivityDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateActivityDialog = ({ isOpen, onClose }: CreateActivityDialogProps) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: activitiesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            toast.success('Activity created successfully');
            onClose();
        },
        onError: () => {
            toast.error('Failed to create activity');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const data: Partial<Activity> = {
            subject: formData.get('subject') as string,
            description: formData.get('description') as string,
            type: formData.get('type') as Activity['type'],
            dueDate: new Date(formData.get('dueDate') as string).toISOString(), // Naive conversion for now
            completed: false
        };

        mutation.mutate(data);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>
                <CardHeader>
                    <CardTitle>New Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Subject"
                            name="subject"
                            placeholder="Call with Client X"
                            required
                            autoFocus
                        />

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Type</label>
                            <div className="relative">
                                <select
                                    name="type"
                                    className="flex h-10 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                                >
                                    <option value="CALL">Call</option>
                                    <option value="MEETING">Meeting</option>
                                    <option value="TASK">Task</option>
                                    <option value="EMAIL">Email</option>
                                    <option value="NOTE">Note</option>
                                </select>
                                <Type className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Due Date</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    required
                                    className="flex h-10 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary md:w-full [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                        </div>

                        <Input
                            label="Description"
                            name="description"
                            placeholder="Details about this task..."
                        />

                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button type="submit" isLoading={isLoading}>Create Activity</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
