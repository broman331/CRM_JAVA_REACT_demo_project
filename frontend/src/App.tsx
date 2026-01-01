import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { AdminRoute } from './features/auth/AdminRoute';
import { Toaster } from 'sonner';
import { Skeleton } from './components/ui/Skeleton';

// Lazy Load Pages
const LoginPage = lazy(() => import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./feature-dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ContactsPage = lazy(() => import('./features/crm/ContactsPage').then(m => ({ default: m.ContactsPage })));
const CompaniesPage = lazy(() => import('./features/crm/CompaniesPage').then(m => ({ default: m.CompaniesPage })));
const DealsPage = lazy(() => import('./features/sales/DealsPage').then(m => ({ default: m.DealsPage })));
const ActivitiesPage = lazy(() => import('./features/activities/ActivitiesPage').then(m => ({ default: m.ActivitiesPage })));
const AnalyticsDashboard = lazy(() => import('./features/analytics/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const AdminPage = lazy(() => import('./features/admin/AdminPage').then(m => ({ default: m.AdminPage })));

const queryClient = new QueryClient();

// Loading Fallback
const PageLoader = () => (
  <div className="p-8 space-y-4">
    <Skeleton className="h-12 w-1/3" />
    <Skeleton className="h-[200px] w-full" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
