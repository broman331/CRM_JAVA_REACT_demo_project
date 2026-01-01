import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dealsApi } from './deals-api';
import { crmApi } from '../crm/crm-api';
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
import { useState } from 'react';

const dealSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Value must be a positive number',
    }),
    contactId: z.string().min(1, 'Contact is required'),
    stage: z.enum(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON']),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface AddDealDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddDealDialog = ({ open, onOpenChange }: AddDealDialogProps) => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const createDealMutation = useMutation({
        mutationFn: (data: DealFormValues) => dealsApi.createDeal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            toast.success('Deal created successfully');
            reset();
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Failed to create deal');
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const onSubmit: SubmitHandler<DealFormValues> = (data) => {
        setIsSubmitting(true);
        createDealMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Deal</DialogTitle>
                    <DialogDescription>
                        Create a new deal opportunity.
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
                            {contacts?.map((contact: any) => (
                                <option key={contact.id} value={contact.id}>
                                    {contact.firstName} {contact.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.contactId && (
                            <p className="mt-1 text-sm text-red-500">{errors.contactId.message}</p>
                        )}
                    </div>
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
                            {isSubmitting ? 'Create Deal' : 'Create Deal'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
