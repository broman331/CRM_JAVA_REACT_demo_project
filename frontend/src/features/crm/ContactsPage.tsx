import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, MoreHorizontal, Mail, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { crmApi } from './crm-api';

export const ContactsPage = () => {
    const [search, setSearch] = useState('');

    const { data: contacts, isLoading, error } = useQuery({
        queryKey: ['contacts'],
        queryFn: crmApi.getContacts,
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
    if (error) return <div className="text-red-500 p-8">Error loading contacts</div>;

    const filteredContacts = contacts?.filter(contact =>
        contact.email?.toLowerCase().includes(search.toLowerCase()) ||
        contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white shadow-sm">Contacts</h2>
                    <p className="text-slate-400">Manage your relationships and leads.</p>
                </div>
                <Button>
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
                <Button variant="secondary">Filter</Button>
            </div>

            <Card className="border-slate-800 bg-surface/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b [&_tr]:border-slate-700">
                                <tr className="border-b transition-colors hover:bg-white/5">
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Company</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Role</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Email</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredContacts?.map((contact) => (
                                    <tr key={contact.id} className="border-b border-slate-700 transition-colors hover:bg-white/5">
                                        <td className="p-4 align-middle font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xs">
                                                    {contact.firstName[0]}{contact.lastName[0]}
                                                </div>
                                                {contact.firstName} {contact.lastName}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-slate-300">{contact.company?.name || '-'}</td>
                                        <td className="p-4 align-middle text-slate-300">{contact.jobTitle || '-'}</td>
                                        <td className="p-4 align-middle text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3 text-slate-500" />
                                                {contact.email}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
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
