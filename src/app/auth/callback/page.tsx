'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const processCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed) {
        return;
      }
      
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');
        const errorMessage = searchParams.get('message');

        if (error) {
          throw new Error(errorMessage || 'OAuth authentication failed');
        }

        if (!accessToken || !refreshToken) {
          throw new Error('Missing authentication tokens');
        }

        await handleOAuthCallback(accessToken, refreshToken);
        
        // Mark as processed to prevent duplicate notifications
        setHasProcessed(true);
        
        // Show success message only once
        toast.success('Successfully authenticated!');
        
        // Add a small delay to ensure the toast is visible before navigation
        setTimeout(() => {
          router.replace('/dashboard');
        }, 1000);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error(error instanceof Error ? error.message : 'Authentication failed');
        router.push('/?error=oauth_failed');
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, router, hasProcessed]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Processing Authentication</h2>
          <p className="text-gray-500">Please wait while we complete your login...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}