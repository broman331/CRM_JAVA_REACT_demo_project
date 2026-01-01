import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './authStore';

export const ProtectedRoute = () => {
    const { token } = useAuthStore();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
