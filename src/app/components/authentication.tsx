'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSession, getCsrfToken } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import HeroSection from './HeroSection';
import { Toaster } from 'react-hot-toast';

type AuthProps = {
  children: ReactNode;
};

const Authentication = ({ children }: AuthProps) => {
  const {  status } = useSession();
  const pathname = usePathname();
 

  const [formLoaded, setFormLoaded] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Automatically submit login form with CSRF
  useEffect(() => {
    if (formLoaded && csrfToken && formRef.current) {
      formRef.current.submit();
    }
  }, [formLoaded, csrfToken]);

  // Prepare CSRF token when unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      (async () => {
        const token = await getCsrfToken();
        setCsrfToken(token || '');
        setFormLoaded(true);
      })();
    }
  }, [status]);

  // Show loading
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Show authenticated content
  if (status === 'authenticated') {
    return (
      <div className="flex flex-col min-h-screen">
        {pathname === '/' ? <HeroSection /> : null}
        {children}
        <Toaster />
      </div>
    );
  }

  // Show login form or hero
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {formLoaded && csrfToken ? (
        <form
          ref={formRef}
          method="post"
          action="/api/auth/signin/auth0"
          className="hidden"
        >
          <input name="csrfToken" type="hidden" value={csrfToken} />
        </form>
      ) : (
        <HeroSection />
      )}
      <Toaster />
    </div>
  );
};

export default Authentication;