'use client';
import { type Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

export const useSession = () => {
  const [session, setSession] = useState<Session>();

  const fetchSession = useCallback(async () => {
    const serverSession = await getSession();
    if (serverSession) setSession(serverSession);
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return session;
};
