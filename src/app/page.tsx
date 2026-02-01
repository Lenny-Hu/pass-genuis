'use client';

import { PasswordGenerator } from '@/components/password-generator';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start md:justify-center bg-background p-4 md:p-6">
      <PasswordGenerator />
      <LanguageSwitcher />
    </main>
  );
}
