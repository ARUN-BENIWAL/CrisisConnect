import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#18392b]/20 border-t-[#18392b] rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Verifying security credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Strict isolation: users are directed solely to their designated portal
    if (user.role === 'RESPONDER') {
      return <Navigate to="/responder" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
