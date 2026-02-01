'use client';

import { useChangeLocale, useCurrentLocale, useI18n } from '@/i18n/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();
  const t = useI18n();

  return (
    <Select value={locale} onValueChange={(newLocale) => changeLocale(newLocale as 'en' | 'zh')}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={t('language')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('language.en')}</SelectItem>
        <SelectItem value="zh">{t('language.zh')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
