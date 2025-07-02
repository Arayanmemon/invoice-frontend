'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // User should be authenticated but isn't - redirect to login
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but route is for non-authenticated users
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we verify your session.</p>
        </div>
      </div>
    );
  }

  // Don't render children if authentication requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}