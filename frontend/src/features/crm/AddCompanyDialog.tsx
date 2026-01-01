import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { crmApi } from './crm-api';
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

const companySchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    industry: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    phone: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface AddCompanyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddCompanyDialog = ({ open, onOpenChange }: AddCompanyDialogProps) => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            industry: '',
            website: '',
            phone: '',
        },
    });

    const createCompanyMutation = useMutation({
        mutationFn: (data: CompanyFormValues) => crmApi.createCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            toast.success('Company created successfully');
            reset();
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Failed to create company');
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const onSubmit = (data: CompanyFormValues) => {
        setIsSubmitting(true);
        // Clean up empty strings for optional fields if necessary, 
        // though backend likely handles it or Zod transforms could be used.
        // For now, passing as is.
        createCompanyMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Company</DialogTitle>
                    <DialogDescription>
                        Create a new company record. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Input
                            id="name"
                            label="Company Name"
                            placeholder="Acme Inc."
                            error={errors.name?.message}
                            {...register('name')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            id="industry"
                            label="Industry"
                            placeholder="Technology, Retail, etc."
                            error={errors.industry?.message}
                            {...register('industry')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            id="website"
                            label="Website"
                            placeholder="https://example.com"
                            error={errors.website?.message}
                            {...register('website')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            id="phone"
                            label="Phone"
                            placeholder="+1 (555) 000-0000"
                            error={errors.phone?.message}
                            {...register('phone')}
                        />
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
                            {isSubmitting ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
