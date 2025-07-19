import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function UnAuthenticatedRoute({ children, redirectTo = '/' }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
