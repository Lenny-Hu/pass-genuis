'use client';

import { I18nProviderClient } from '@/i18n/client';
import { Toaster } from '@/components/ui/toaster';
import { SWRegister } from '@/components/sw-register';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProviderClient locale="zh">
      {children}
      <Toaster />
      <SWRegister />
    </I18nProviderClient>
  );
}
