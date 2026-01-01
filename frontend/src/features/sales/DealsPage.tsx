
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsApi, type Deal } from './deals-api';
import { useAuthStore } from '../auth/authStore';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from 'sonner';
import { AddDealDialog } from './AddDealDialog';
import { ActionsMenu } from '../../components/ui/ActionsMenu';

const COLUMNS = [
    { id: 'LEAD', title: 'Lead' },
    { id: 'QUALIFIED', title: 'Qualified' },
    { id: 'PROPOSAL', title: 'Proposal' },
    { id: 'NEGOTIATION', title: 'Negotiation' },
    { id: 'CLOSED_WON', title: 'Won' },
];

export const DealsPage = () => {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const [minValue, setMinValue] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const searchParams = [];
    if (minValue) searchParams.push(`value > ${minValue} `);
    if (stageFilter) searchParams.push(`stage:${stageFilter} `);
    const searchString = searchParams.join(',');

    // Fetch Deals
    const { data: deals, isLoading, error } = useQuery<Deal[]>({
        queryKey: ['deals', searchString],
        queryFn: () => dealsApi.getDeals(searchString || undefined),
    });

    const updateStageMutation = useMutation({
        mutationFn: ({ id, stage }: { id: string; stage: string }) => dealsApi.updateStage(id, stage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            toast.success('Deal stage updated');
        },
        onError: () => {
            toast.error('Failed to update stage');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => dealsApi.deleteDeal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            toast.success('Deal deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete deal');
        }
    });

    if (error) {
        toast.error('Error loading deals');
        return <div className="text-red-500 p-8 text-center">Failed to load deals. Please try again.</div>;
    }

    const getColumnDeals = (stageId: string) => {
        return deals?.filter(d => d.stage === stageId) || [];
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('dealId', id);
    };

    const handleDrop = async (e: React.DragEvent, stageId: string) => {
        const dealId = e.dataTransfer.getData('dealId');
        if (dealId) {
            updateStageMutation.mutate({ id: dealId, stage: stageId });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
            <AddDealDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white shadow-sm">Deals Pipeline</h2>
                    <p className="text-slate-400">Track and manage your opportunities.</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Deal
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-surface/30 p-4 rounded-lg border border-slate-700">
                <Input
                    placeholder="Min Value (e.g. 1000)"
                    className="w-48 bg-surface border-slate-600 focus:border-primary-light transition-colors"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                />
                <select
                    className="h-10 rounded-md border border-slate-600 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-light transition-all"
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                >
                    <option value="">All Stages</option>
                    {COLUMNS.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 flex gap-6 overflow-x-auto pb-6">
                {COLUMNS.map((col) => {
                    const columnDeals = getColumnDeals(col.id);
                    return (
                        <div
                            key={col.id}
                            className="w-80 flex-shrink-0 flex flex-col gap-4"
                            onDrop={(e) => handleDrop(e, col.id)}
                            onDragOver={handleDragOver}
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className="font-semibold text-slate-200">{col.title}</h3>
                                {isLoading ? (
                                    <Skeleton className="h-4 w-8 rounded-full" />
                                ) : (
                                    <span className="text-xs font-medium text-slate-500 bg-surface px-2 py-1 rounded-full">
                                        {columnDeals.length}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 rounded-xl bg-surface/30 p-2 space-y-3 overflow-y-auto">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-32 w-full" />
                                    ))
                                ) : (
                                    columnDeals.map((deal) => (
                                        <div
                                            key={deal.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, deal.id)}
                                            className="group relative flex flex-col gap-2 rounded-lg border border-slate-700 bg-surface p-4 shadow-sm transition-all hover:border-primary-light hover:shadow-md cursor-grab active:cursor-grabbing hover:bg-white/5"
                                        >
                                            <div className="flex items-start justify-between">
                                                <span className="text-xs font-medium text-primary-light bg-primary/10 px-2 py-0.5 rounded">
                                                    {deal.companyName || 'Lead'}
                                                </span>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ActionsMenu
                                                        itemName="Deal"
                                                        onEdit={() => toast.info('Edit coming soon')}
                                                        onDelete={user?.roles?.includes('ADMIN') ? () => deleteMutation.mutate(deal.id) : undefined}
                                                    />
                                                </div>
                                            </div>
                                            <h4 className="font-medium leading-tight text-white">{deal.title}</h4>
                                            <div className="text-sm font-semibold text-slate-300">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(deal.value))}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {!isLoading && columnDeals.length === 0 && (
                                    <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg p-8 text-center">
                                        <p className="text-sm text-slate-600">Drag deals here or filter to see results</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

