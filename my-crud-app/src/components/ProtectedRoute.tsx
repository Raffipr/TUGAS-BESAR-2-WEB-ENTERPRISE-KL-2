// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../utils/supabase';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(!!session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (auth === null) return <div>Loading...</div>;
  
  return auth ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
