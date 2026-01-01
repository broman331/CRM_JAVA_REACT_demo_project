import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { DollarSign, Users, Briefcase, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './dashboard-api';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend: string;
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
            <Icon className="h-4 w-4 text-primary-light" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-slate-500 mt-1">{trend}</p>
        </CardContent>
    </Card>
);

export const DashboardPage = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: dashboardApi.getStats
    });

    if (isLoading) {
        return <div className="p-4 text-slate-400">Loading dashboard...</div>;
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    icon={DollarSign}
                    trend="Pipeline Value"
                />
                <StatCard
                    title="Active Deals"
                    value={stats?.activeDeals || 0}
                    icon={Briefcase}
                    trend="In Pipeline"
                />
                <StatCard
                    title="New Contacts"
                    value={stats?.newContacts || 0}
                    icon={Users}
                    trend="Total Contacts"
                />
                <StatCard
                    title="Upcoming Tasks"
                    value={stats?.upcomingTasks || 0}
                    icon={Calendar}
                    trend="Tasks Due"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-slate-400">Activity chart placeholder</div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xs">
                                        OM
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                        <p className="text-xs text-slate-500">olivia.martin@email.com</p>
                                    </div>
                                    <div className="ml-auto font-medium">+$1,999.00</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
