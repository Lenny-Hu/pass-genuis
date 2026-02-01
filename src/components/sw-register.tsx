"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function SWRegister() {
  const { toast } = useToast();

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
              title: 'Could not enable offline mode',
              description: 'Service Worker registration failed.',
              variant: 'destructive',
            });
          });
      });
    }
  }, [toast]);

  return null;
}
