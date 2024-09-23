'use client';
import { Session } from 'next-auth';
import { createContext, ReactNode, useContext } from 'react';

interface IAuth {
  user: Session['user'] | null;
  session: Session | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<IAuth>({
  user: null,
  session: null,
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};

const AuthProvider: React.FC<{
  session: Session | null;
  children: ReactNode;
}> = ({ session, children }) => (
  <AuthContext.Provider
    value={{
      user: session?.user || null,
      session,
      isAuthenticated: !!session,
    }}
  >
    {children}
  </AuthContext.Provider>
);

export default AuthProvider;
