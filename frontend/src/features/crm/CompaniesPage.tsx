import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, MoreHorizontal, Globe, Phone, Building2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { crmApi, type Company } from './crm-api';

export const CompaniesPage = () => {
    const [search, setSearch] = useState('');

    const { data: companies, isLoading, error } = useQuery<Company[]>({
        queryKey: ['companies', search],
        queryFn: () => crmApi.getCompanies(search),
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
    if (error) return <div className="text-red-500 p-8">Error loading companies</div>;

    const filteredCompanies = companies?.filter(company =>
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.industry?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white shadow-sm">Companies</h2>
                    <p className="text-slate-400">Manage your business accounts and partners.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Company
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search companies..."
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
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Industry</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Website</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400">Phone</th>
                                    <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredCompanies?.map((company) => (
                                    <tr key={company.id} className="border-b border-slate-700 transition-colors hover:bg-white/5">
                                        <td className="p-4 align-middle font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                    <Building2 className="h-4 w-4" />
                                                </div>
                                                {company.name}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-slate-300">{company.industry || '-'}</td>
                                        <td className="p-4 align-middle text-slate-300">
                                            {company.website ? (
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-3 w-3 text-slate-500" />
                                                    <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                                                        {company.website.replace(/^https?:\/\//, '')}
                                                    </a>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4 align-middle text-slate-300">
                                            {company.phone ? (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 text-slate-500" />
                                                    {company.phone}
                                                </div>
                                            ) : '-'}
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
