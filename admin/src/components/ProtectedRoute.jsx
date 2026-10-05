import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Sidebar from './Sidebar';

export const ProtectedRoute = () => {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-brand-50 text-text-primary">
      <Sidebar />
      <main className="flex-1 ml-[240px] overflow-y-auto p-6 md:p-8 bg-brand-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
