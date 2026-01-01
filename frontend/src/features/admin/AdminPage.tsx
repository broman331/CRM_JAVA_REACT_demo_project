import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Plus, Shield, User as UserIcon } from 'lucide-react';
import { userApi, type User } from './user-api';
import { UserDialog } from './UserDialog';
import { ActionsMenu } from '../../components/ui/ActionsMenu';
import { toast } from 'sonner';
import { useAuthStore } from '../auth/authStore';

export const AdminPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const queryClient = useQueryClient();
    const currentUser = useAuthStore((state) => state.user);

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: userApi.getAll
    });

    const deleteMutation = useMutation({
        mutationFn: userApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted');
        },
        onError: () => toast.error('Failed to delete user')
    });

    const handleCreate = () => {
        setSelectedUser(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    if (isLoading) return <div className="p-8 text-slate-400">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white shadow-sm">Admin Settings</h2>
                    <p className="text-slate-400">Manage system settings and users.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    New User
                </Button>
            </div>

            <UserDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedUser}
            />

            <Card className="border-slate-800 bg-surface/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b [&_tr]:border-slate-700">
                                <tr className="border-b transition-colors hover:bg-white/5">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Email</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Role</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {users?.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-700 transition-colors hover:bg-white/5">
                                        <td className="p-4 align-middle font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                                                    <UserIcon className="h-4 w-4" />
                                                </div>
                                                {user.firstName} {user.lastName}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-slate-300">{user.email}</td>
                                        <td className="p-4 align-middle text-slate-300">
                                            {user.roles?.map(role => (
                                                <span key={role} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-light">
                                                    {role === 'ADMIN' && <Shield className="h-3 w-3" />}
                                                    {role}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <ActionsMenu
                                                itemName="User"
                                                onEdit={() => handleEdit(user)}
                                                onDelete={user.id !== currentUser?.id ? () => deleteMutation.mutate(user.id) : undefined}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
