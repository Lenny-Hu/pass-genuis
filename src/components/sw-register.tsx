"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';

export function SWRegister() {
  const { toast } = useToast();
  const t = useI18n();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('Service Worker registration failed: ', registrationError);
            toast({
              title: t('offline.error.title'),
              description: t('offline.error.description'),
              variant: 'destructive',
            });
          });
      });
    }
  }, [toast, t]);

  return null;
}
