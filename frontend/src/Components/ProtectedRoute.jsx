// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import LoadingSpinner from "./LoadingSpinner";
import Unauthorized from "./Unauthorized";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Unauthorized />
  }

  if (!allowedRoles.includes(user.userType)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;