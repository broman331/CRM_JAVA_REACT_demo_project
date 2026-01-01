import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi, type Activity } from './activities-api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { X, Type } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Activity | null;
}

export const ActivityDialog = ({ isOpen, onClose, initialData }: ActivityDialogProps) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when opening/closing or changing initialData would be handled by key prop or manual effect if needed.
    // simpler to just letting the form be uncontrolled with defaultValues or manual value controlled.
    // For simplicity, we'll use uncontrolled form with key to reset.

    const mutation = useMutation({
        mutationFn: (data: Partial<Activity>) => {
            if (initialData?.id) {
                return activitiesApi.update(initialData.id, data);
            }
            return activitiesApi.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            toast.success(initialData ? 'Activity updated' : 'Activity created');
            onClose();
        },
        onError: () => {
            toast.error(initialData ? 'Failed to update activity' : 'Failed to create activity');
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
            dueDate: new Date(formData.get('dueDate') as string).toISOString(),
            completed: initialData?.completed ?? false
        };

        mutation.mutate(data);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    const defaultDate = initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString().slice(0, 16)
        : '';

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
                    <CardTitle>{initialData ? 'Edit Activity' : 'New Activity'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Subject"
                            name="subject"
                            defaultValue={initialData?.subject}
                            placeholder="Call with Client X"
                            required
                            autoFocus
                        />

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Type</label>
                            <div className="relative">
                                <select
                                    name="type"
                                    defaultValue={initialData?.type || 'CALL'}
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
                                    defaultValue={defaultDate}
                                    required
                                    className="flex h-10 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary md:w-full [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                        </div>

                        <Input
                            label="Description"
                            name="description"
                            defaultValue={initialData?.description}
                            placeholder="Details about this task..."
                        />

                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button type="submit" isLoading={isLoading}>
                                {initialData ? 'Save Changes' : 'Create Activity'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
