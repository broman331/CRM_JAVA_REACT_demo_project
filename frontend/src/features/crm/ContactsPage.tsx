import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, MoreHorizontal, Mail, Trash2, ChevronDown, ChevronRight, History } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from './crm-api';
import { activitiesApi } from '../activities/activities-api';
import { useAuthStore } from '../auth/authStore';
import { Skeleton } from '../../components/ui/Skeleton';
import { Timeline } from '../../components/ui/Timeline';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

export const ContactsPage = () => {
    const [search, setSearch] = useState('');
    const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();

    const { data: contacts, isLoading, error } = useQuery({
        queryKey: ['contacts', search],
        queryFn: () => crmApi.getContacts(search ? `firstName:${search}` : undefined),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => crmApi.deleteContact(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success('Contact deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete contact');
        }
    });

    const toggleExpand = (id: string) => {
        setExpandedContactId(expandedContactId === id ? null : id);
    };

    if (error) {
        toast.error('Error loading contacts');
        return <div className="text-red-500 p-8 text-center">Failed to load contacts. Please try again.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white shadow-sm">Contacts</h2>
                    <p className="text-slate-400">Manage your relationships and leads.</p>
                </div>
                <Button onClick={() => toast.info('Add Contact feature coming soon')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Contact
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search contacts..."
                        className="pl-9 bg-surface border-slate-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="secondary" onClick={() => toast.info('Filters coming soon')}>Filter</Button>
            </div>

            <Card className="border-slate-800 bg-surface/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b [&_tr]:border-slate-700">
                                <tr className="border-b transition-colors hover:bg-white/5">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400 w-10"></th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Company</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Role</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Email</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-slate-700">
                                            <td className="p-4" colSpan={6}>
                                                <Skeleton className="h-12 w-full" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    contacts?.map((contact) => (
                                        <>
                                            <tr key={contact.id} className={cn(
                                                "border-b border-slate-700 transition-colors hover:bg-white/5",
                                                expandedContactId === contact.id && "bg-white/5"
                                            )}>
                                                <td className="p-4 align-middle">
                                                    <button
                                                        onClick={() => toggleExpand(contact.id)}
                                                        className="text-slate-500 hover:text-white transition-colors"
                                                    >
                                                        {expandedContactId === contact.id ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="p-4 align-middle font-medium text-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xs uppercase">
                                                            {contact.firstName[0]}{contact.lastName[0]}
                                                        </div>
                                                        {contact.firstName} {contact.lastName}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-slate-300">{contact.company?.name || '-'}</td>
                                                <td className="p-4 align-middle text-slate-300">{contact.jobTitle || '-'}</td>
                                                <td className="p-4 align-middle text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-slate-50" />
                                                        {contact.email}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {user?.roles?.includes('ADMIN') && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (window.confirm('Delete this contact?')) {
                                                                        deleteMutation.mutate(contact.id);
                                                                    }
                                                                }}
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedContactId === contact.id && (
                                                <tr className="bg-slate-900/30">
                                                    <td colSpan={6} className="p-6 border-b border-slate-700">
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-4">
                                                                <History className="h-4 w-4 text-primary-light" />
                                                                Activity History
                                                            </div>
                                                            <ContactTimeline contactId={contact.id} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const ContactTimeline = ({ contactId }: { contactId: string }) => {
    const { data: timeline, isLoading } = useQuery({
        queryKey: ['timeline', 'contact', contactId],
        queryFn: () => activitiesApi.getTimeline('contact', contactId),
    });

    return <Timeline activities={timeline || []} isLoading={isLoading} />;
};

