import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dealsApi, type Deal } from './deals-api';
import { crmApi, type Contact } from '../crm/crm-api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/Dialog';
import { useEffect, useState } from 'react';

const dealSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Value must be a positive number',
    }),
    contactId: z.string().min(1, 'Contact is required'),
    stage: z.enum(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON']),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface DealDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dealToEdit?: Deal | null;
}

export const DealDialog = ({ open, onOpenChange, dealToEdit }: DealDialogProps) => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!dealToEdit;

    const { data: contacts } = useQuery({
        queryKey: ['contacts'],
        queryFn: () => crmApi.getContacts(),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DealFormValues>({
        resolver: zodResolver(dealSchema),
        defaultValues: {
            title: '',
            value: '',
            contactId: '',
            stage: 'LEAD',
        },
    });

    useEffect(() => {
        if (open) {
            if (dealToEdit) {
                reset({
                    title: dealToEdit.title,
                    value: dealToEdit.value.toString(),
                    contactId: dealToEdit.contact?.id || '',
                    stage: dealToEdit.stage,
                });
            } else {
                reset({
                    title: '',
                    value: '',
                    contactId: '',
                    stage: 'LEAD',
                });
            }
        }
    }, [open, dealToEdit, reset]);

    const mutation = useMutation({
        mutationFn: (data: DealFormValues) => {
            const payload = {
                title: data.title,
                value: Number(data.value),
                contactId: data.contactId,
                stage: data.stage
            };

            if (isEditMode && dealToEdit) {
                // For updates we might need a different payload structure or just ID
                // Ideally API supports partial updates.
                // Assuming updateDeal exists in api
                return dealsApi.updateDeal(dealToEdit.id, payload);
            }
            return dealsApi.createDeal(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            toast.success(`Deal ${isEditMode ? 'updated' : 'created'} successfully`);
            onOpenChange(false);
        },
        onError: () => {
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} deal`);
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const onSubmit: SubmitHandler<DealFormValues> = (data) => {
        setIsSubmitting(true);
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Deal' : 'New Deal'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update deal details.' : 'Create a new deal opportunity.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Input
                            id="title"
                            label="Deal Title"
                            placeholder="Enterprise License"
                            error={errors.title?.message}
                            {...register('title')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            id="value"
                            label="Value ($)"
                            type="number"
                            placeholder="10000"
                            error={errors.value?.message}
                            {...register('value')}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Contact</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...register('contactId')}
                        >
                            <option value="">Select a contact</option>
                            {contacts?.map((contact: Contact) => (
                                <option key={contact.id} value={contact.id}>
                                    {contact.firstName} {contact.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.contactId && (
                            <p className="mt-1 text-sm text-red-500">{errors.contactId.message}</p>
                        )}
                    </div>
                    {!isEditMode && (
                        /* Only show stage selection on creation, or allow editing if needed. 
                           Kanban usually handles stage moves, but editing properties is fine. */
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Stage</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                {...register('stage')}
                            >
                                <option value="LEAD">Lead</option>
                                <option value="QUALIFIED">Qualified</option>
                                <option value="PROPOSAL">Proposal</option>
                                <option value="NEGOTIATION">Negotiation</option>
                                <option value="CLOSED_WON">Closed Won</option>
                            </select>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Deal' : 'Create Deal')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
