"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Workbox } from 'workbox-window';

export function SWRegister() {
  const { toast } = useToast();
  const { t } = useI18n();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      const wb = new Workbox(`${basePath}/sw.js`);

      const showUpdatePrompt = () => {
        const { dismiss } = toast({
          title: t('update.available.title'),
          description: t('update.available.description'),
          duration: Infinity,
          action: (
            <Button
              onClick={() => {
                // Instructs the waiting service worker to activate.
                // It will then start controlling the page and the
                // 'controlling' event will be fired.
                wb.messageSkipWaiting();
                dismiss();
              }}
            >
              {t('update.now')}
            </Button>
          ),
        });
      };

      // A new service worker has been installed and is waiting to activate.
      wb.addEventListener('waiting', showUpdatePrompt);
      
      // The new service worker has taken control.
      wb.addEventListener('controlling', () => {
        // Reload the page to see the new content.
        window.location.reload();
      });

      // Register the service worker.
      wb.register();
    }
  }, [toast, t]);

  return null;
}
