import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, LogOut, Building2, LineChart, Shield } from 'lucide-react';
import { useAuthStore } from '../features/auth/authStore';

const NavItem = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(to);

    return (
        <Link
            to={to}
            className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-surface hover:text-slate-100'
            )}
        >
            <Icon className="h-4 w-4" />
            {children}
        </Link>
    );
};

export const MainLayout = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-background text-slate-100">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-700 bg-surface/50 backdrop-blur-xl">
                <div className="flex h-16 items-center border-b border-slate-700 px-6">
                    <span className="text-xl font-bold tracking-tight text-white">PrimeCRM</span>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                    <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
                    <NavItem to="/companies" icon={Building2}>Companies</NavItem>
                    <NavItem to="/contacts" icon={Users}>Contacts</NavItem>
                    <NavItem to="/deals" icon={FolderKanban}>Deals</NavItem>
                    <NavItem to="/activities" icon={CheckSquare}>Activities</NavItem>
                    <NavItem to="/analytics" icon={LineChart}>Analytics</NavItem>
                    {user?.roles?.includes('ADMIN') && (
                        <NavItem to="/admin" icon={Shield}>Admin</NavItem>
                    )}
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-surface hover:text-red-400 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64 w-full">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-700 bg-background/80 px-6 backdrop-blur-sm">
                    <h1 className="text-lg font-medium text-white">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                            JD
                        </div>
                    </div>
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
