import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../crm/crm-api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const AnalyticsDashboard = () => {
    const { data: revenueData, isLoading: revLoading } = useQuery({
        queryKey: ['analytics-revenue'],
        queryFn: analyticsApi.getRevenueOverTime
    });

    const { data: pipelineData, isLoading: pipeLoading } = useQuery({
        queryKey: ['analytics-pipeline'],
        queryFn: analyticsApi.getPipelineDistribution
    });

    const { data: activityData, isLoading: actLoading } = useQuery({
        queryKey: ['analytics-activity'],
        queryFn: analyticsApi.getActivityVolume
    });

    if (revLoading || pipeLoading || actLoading) return <div className="p-8">Loading analytics...</div>;

    // Transform pipeline data object to array for Recharts
    const pipelineChartData = pipelineData ? Object.entries(pipelineData).map(([name, value]) => ({ name, value })) : [];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Sales Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white p-4 rounded-lg shadow h-[400px]">
                    <h2 className="text-lg font-semibold mb-4">Revenue Trend (6 Months)</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pipeline Distribution */}
                <div className="bg-white p-4 rounded-lg shadow h-[400px]">
                    <h2 className="text-lg font-semibold mb-4">Deal Pipeline Distribution</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={pipelineChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ percent, cx, cy }: { percent?: number; cx: number; cy: number }) => (
                                    <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#94a3b8">
                                        {pipelineChartData.length > 0 ? `${((percent || 0) * 100).toFixed(0)}%` : '0%'}
                                    </text>
                                )}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pipelineChartData.map((_, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Activity Volume */}
                <div className="bg-white p-4 rounded-lg shadow h-[400px] md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Activity Volume (Last 30 Days)</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
