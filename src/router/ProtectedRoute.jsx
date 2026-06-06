import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useSelector(selectAuth);

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (requiredRole && user?.role !== requiredRole.toUpperCase()) {
        // If user tries to access admin route, redirect to user dashboard
        if (requiredRole === 'admin' && user?.role !== 'ADMIN') {
            return <Navigate to="/dashboard" replace />;
        }
        // If admin tries to access user route, redirect to admin dashboard
        if (requiredRole === 'user' && user?.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
