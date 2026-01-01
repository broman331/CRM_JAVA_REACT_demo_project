import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './feature-dashboard/DashboardPage';
import { ContactsPage } from './features/crm/ContactsPage';
import { DealsPage } from './features/sales/DealsPage';
import { ActivitiesPage } from './features/activities/ActivitiesPage';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
