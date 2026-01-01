import { Button } from '../../components/ui/Button';
import { Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsApi, type Deal } from './deals-api';

const COLUMNS = [
    { id: 'LEAD', title: 'Lead' },
    { id: 'QUALIFIED', title: 'Qualified' },
    { id: 'PROPOSAL', title: 'Proposal' },
    { id: 'NEGOTIATION', title: 'Negotiation' },
    { id: 'CLOSED_WON', title: 'Won' },
];

export const DealsPage = () => {
    const queryClient = useQueryClient();

    // Fetch Deals
    const { data: deals, isLoading, error } = useQuery<Deal[]>({
        queryKey: ['deals'],
        queryFn: dealsApi.getDeals,
    });

    const updateStageMutation = useMutation({
        mutationFn: ({ id, stage }: { id: string; stage: string }) => dealsApi.updateStage(id, stage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
        },
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
    if (error) return <div className="text-red-500 p-8">Error loading deals</div>;

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white shadow-sm">Deals Pipeline</h2>
                    <p className="text-slate-400">Track and manage your opportunities.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Deal
                </Button>
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
                                <span className="text-xs font-medium text-slate-500 bg-surface px-2 py-1 rounded-full">
                                    {columnDeals.length}
                                </span>
                            </div>

                            <div className="flex-1 rounded-xl bg-surface/30 p-2 space-y-3 overflow-y-auto">
                                {columnDeals.map((deal) => (
                                    <div
                                        key={deal.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, deal.id)}
                                        className="group relative flex flex-col gap-2 rounded-lg border border-slate-700 bg-surface p-4 shadow-sm transition-all hover:border-primary hover:shadow-md cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="flex items-start justify-between">
                                            <span className="text-xs font-medium text-primary-light bg-primary/10 px-2 py-0.5 rounded">
                                                {deal.companyName || 'Unknown Config'}
                                            </span>
                                            <button className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <h4 className="font-medium leading-tight text-white">{deal.title}</h4>
                                        <div className="text-sm font-semibold text-slate-300">{deal.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
