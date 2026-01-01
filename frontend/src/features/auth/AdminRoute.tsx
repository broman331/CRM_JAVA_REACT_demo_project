import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './authStore';

export const AdminRoute = () => {
    const user = useAuthStore((state) => state.user);

    if (!user || !user.roles.includes('ADMIN')) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
