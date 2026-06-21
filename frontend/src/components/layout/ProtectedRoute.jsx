import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // If the user is not logged in, kick them to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (e.g. MainLayout)
  return <Outlet />;
};

export default ProtectedRoute;
