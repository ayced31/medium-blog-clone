import { useState } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    // TODO: Implement auth check
    setIsLoading(false);
  };

  return {
    isLoading,
    isAuthenticated,
    checkAuthStatus,
  };
};
