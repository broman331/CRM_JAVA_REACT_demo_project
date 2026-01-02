import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { crmApi, type Company, type Contact } from './crm-api';
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

const contactSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    jobTitle: z.string().optional(),
    companyId: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contactToEdit?: Contact | null;
}

export const ContactDialog = ({ open, onOpenChange, contactToEdit }: ContactDialogProps) => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!contactToEdit;

    const { data: companies } = useQuery({
        queryKey: ['companies'],
        queryFn: () => crmApi.getCompanies(),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            jobTitle: '',
            companyId: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (contactToEdit) {
                reset({
                    firstName: contactToEdit.firstName,
                    lastName: contactToEdit.lastName,
                    email: contactToEdit.email,
                    phone: contactToEdit.phone || '',
                    jobTitle: contactToEdit.jobTitle || '',
                    companyId: contactToEdit.company?.id || '',
                });
            } else {
                reset({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    jobTitle: '',
                    companyId: '',
                });
            }
        }
    }, [open, contactToEdit, reset]);

    const mutation = useMutation({
        mutationFn: (data: ContactFormValues) => {
            const payload = {
                ...data,
                companyId: data.companyId || undefined
            };
            if (isEditMode && contactToEdit) {
                return crmApi.updateContact(contactToEdit.id, payload);
            }
            return crmApi.createContact(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success(`Contact ${isEditMode ? 'updated' : 'created'} successfully`);
            onOpenChange(false);
        },
        onError: () => {
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} contact`);
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const onSubmit = (data: ContactFormValues) => {
        setIsSubmitting(true);
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update contact details.' : 'Create a new contact.'} Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                id="firstName"
                                label="First Name"
                                placeholder="John"
                                error={errors.firstName?.message}
                                {...register('firstName')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="lastName"
                                label="Last Name"
                                placeholder="Doe"
                                error={errors.lastName?.message}
                                {...register('lastName')}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input
                            id="email"
                            label="Email"
                            placeholder="john.doe@example.com"
                            error={errors.email?.message}
                            {...register('email')}
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
                    <div className="space-y-2">
                        <Input
                            id="jobTitle"
                            label="Job Title"
                            placeholder="Software Engineer"
                            error={errors.jobTitle?.message}
                            {...register('jobTitle')}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...register('companyId')}
                        >
                            <option value="">Select a company (optional)</option>
                            {companies?.map((company: Company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
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
