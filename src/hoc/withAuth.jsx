import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// withAuth — Higher-Order Component (Task Q2)
//
// A HOC is a function that takes a component and returns a new enhanced component.
// Pattern: withAuth(Dashboard) wraps Dashboard with auth-checking logic
// without modifying Dashboard itself (open/closed principle).
//
// Usage: export default withAuth(MyComponent);
const withAuth = (WrappedComponent) => {
  const AuthGuard = (props) => {
    const { user, loading } = useAuth();

    if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

    // Not authenticated → redirect to login
    if (!user) return <Navigate to="/login" replace />;

    // Authenticated → render original component with all its props
    return <WrappedComponent {...props} />;
  };

  // Readable name in React DevTools: "withAuth(Dashboard)"
  AuthGuard.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthGuard;
};

export default withAuth;
