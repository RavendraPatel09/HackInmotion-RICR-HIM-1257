import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { showToast } from '../ui/Toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      showToast('Please log in to access this portal section.', 'warning');
    } else if (allowedRole && user.role !== allowedRole) {
      showToast(`Access restricted. Redirecting to your ${user.role} workspace.`, 'info');
    }
  }, [isAuthenticated, user, allowedRole]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/citizen" replace />;
    }
  }

  return <>{children}</>;
};
