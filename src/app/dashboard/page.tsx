'use client';

import Dashboard from '@/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute requireAuth={true}>
      <Dashboard onLogout={logout} />
    </ProtectedRoute>
  );
}