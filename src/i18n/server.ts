import { createI18nServer } from 'next-international/server';
 
export const { getI18n, getScopedI18n, getCurrentLocale, getStaticParams } = createI18nServer({
  zh: () => import('@/locales/zh'),
  en: () => import('@/locales/en'),
});
