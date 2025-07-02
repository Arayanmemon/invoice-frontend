'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the redirect parameter
    const redirect = searchParams.get('redirect');
    
    if (redirect) {
      // Decode and redirect to the intended page
      const decodedRedirect = decodeURIComponent(redirect);
      router.replace(decodedRedirect);
    } else {
      // If no redirect, go to the main page
      router.replace('/');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Redirecting...</h2>
        <p className="text-gray-500">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default function AuthRedirectPage() {
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
      <AuthRedirectContent />
    </Suspense>
  );
}