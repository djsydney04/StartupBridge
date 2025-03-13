import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // User is not authenticated but trying to access a protected route
        // Redirect to the landing page instead of directly to signin
        router.push('/');
      } else if (!requireAuth && user) {
        // User is authenticated but trying to access an auth page
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, requireAuth, router]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Show children only if authentication requirements are met
  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
} 