import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, type User } from './user-api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { X, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface UserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: User | null;
}

export const UserDialog = ({ isOpen, onClose, initialData }: UserDialogProps) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (data: Partial<User> & { password?: string }) => {
            if (initialData?.id) {
                // Remove password if empty for update, but here we likely won't update password in this simple dialog
                // or backend handles it. For now, we update basic info + roles.
                return userApi.update(initialData.id, data);
            }
            return userApi.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(initialData ? 'User updated' : 'User created');
            onClose();
        },
        onError: () => {
            toast.error(initialData ? 'Failed to update user' : 'Failed to create user');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const roles = formData.get('role') === 'ADMIN' ? ['ADMIN'] : ['SALES_REP'];

        const data: Partial<User> & { password?: string } = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            roles: roles as User['roles']
        };

        if (!initialData) {
            data.password = formData.get('password') as string;
        }

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
                    <CardTitle>{initialData ? 'Edit User' : 'New User'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="firstName"
                                defaultValue={initialData?.firstName}
                                required
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                defaultValue={initialData?.lastName}
                                required
                            />
                        </div>

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            defaultValue={initialData?.email}
                            required
                        />

                        {!initialData && (
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                            />
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Role</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    defaultValue={initialData?.roles?.includes('ADMIN') ? 'ADMIN' : 'SALES_REP'}
                                    className="flex h-10 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                                >
                                    <option value="SALES_REP">Sales Representative</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                                <Shield className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button type="submit" isLoading={isLoading}>
                                {initialData ? 'Save Changes' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
