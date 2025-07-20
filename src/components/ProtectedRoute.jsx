import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

/**
 * @param {JSX.Element} children - Component to render
 * @param {string[]} allowedRoles - Array of roles allowed to access this route
 * @param {string} redirectTo - Where to redirect unauthorized users (default: '/signin')
 */
export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = '/signin',
}) {
  const { isLoggedIn, isLoading, profile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoggedIn || !profile) {
    return <Navigate to={redirectTo} replace />;
  }

  // If specific roles are required and the user role is not included
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
