'use client';

import { useState, useEffect } from 'react';
import { PasswordGenerator } from '@/components/password-generator';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render nothing on the server and on the initial client-side render.
    // This avoids any hydration errors.
    return null;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-6">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <PasswordGenerator />
    </main>
  );
}
