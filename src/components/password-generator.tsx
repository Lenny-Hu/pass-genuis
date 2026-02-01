"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Lock, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '@/components/providers';
import { Switch } from '@/components/ui/switch';

type GenerationType = 'general' | '6-digit' | '8-digit';

export function PasswordGenerator() {
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [generationType, setGenerationType] = useState<GenerationType>('general');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMasterPasswordVisible, setIsMasterPasswordVisible] = useState(false);
  const [isSaltVisible, setIsSaltVisible] = useState(false);
  const [addYear, setAddYear] = useState(false);
  const [addUnderscore, setAddUnderscore] = useState(false);
  const [autoCopy, setAutoCopy] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { toast } = useToast();
  
  const formattedGeneratedPassword = useMemo(() => {
    if (!generatedPassword) return '';
    const mid = Math.ceil(generatedPassword.length / 2);
    return `${generatedPassword.slice(0, mid)} ${generatedPassword.slice(mid)}`;
  }, [generatedPassword]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const sha256 = async (str: string) => {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const handleGenerate = async () => {
    if (!password || !salt) {
      toast({
        title: t('error'),
        description: t('error.empty.fields'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedPassword('');

    try {
      const finalSalt = addYear ? salt + currentYear : salt;
      const hash = await sha256(password + finalSalt);
      let result = '';

      switch (generationType) {
        case 'general':
          const first10 = hash.substring(0, 10);
          result = first10.replace(/[a-zA-Z]/, c => c.toUpperCase());
          break;
        case '6-digit':
          const digitsOnly6 = hash.replace(/\D/g, '');
          if (digitsOnly6.length < 6) {
            toast({ title: t('generation.failed'), description: t('generation.failed.6-digit'), variant: 'destructive'});
            setIsLoading(false);
            return;
          }
          result = digitsOnly6.slice(-6);
          break;
        case '8-digit':
          const digitsOnly8 = hash.replace(/\D/g, '');
          if (digitsOnly8.length < 8) {
            toast({ title: t('generation.failed'), description: t('generation.failed.8-digit'), variant: 'destructive'});
            setIsLoading(false);
            return;
          }
          const mid = Math.floor(digitsOnly8.length / 2);
          result = digitsOnly8.substring(mid - 4, mid + 4);
          break;
      }
      
      if (addUnderscore) {
        result = `_${result}_`;
      }

      setGeneratedPassword(result);

      if (autoCopy) {
        navigator.clipboard.writeText(result);
        setIsCopied(true);
        toast({
          title: t('copied'),
          description: t('copied.description'),
        });
      }

      setIsDialogOpen(true);
    } catch (error) {
        console.error("Password generation failed:", error);
        toast({ title: t('error'), description: t('unexpected.error'), variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setIsCopied(true);
      toast({
        title: t('copied'),
        description: t('copied.description'),
      });
    }
  };

  const onDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsCopied(false);
    }
  }
  
  const passwordTypes = {
      'general': t('password.type.general'),
      '6-digit': t('password.type.6-digit'),
      '8-digit': t('password.type.8-digit'),
  }

  return (
    <>
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline text-3xl tracking-tight">{t('app.title')}</CardTitle>
          </div>
          <CardDescription className="pt-1">{t('app.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="password">{t('master.password')}</Label>
              <div className="relative">
                <Input 
                  key={`password-${isMasterPasswordVisible}`}
                  id="password" 
                  type={isMasterPasswordVisible ? 'text' : 'password'} 
                  placeholder={t('master.password.placeholder')} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMasterPasswordVisible(!isMasterPasswordVisible)}
                >
                  {isMasterPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{isMasterPasswordVisible ? t('hide.password') : t('show.password')}</span>
                </Button>
              </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="salt">{t('salt.keyword')}</Label>
              <div className="relative">
                <Input 
                  key={`salt-${isSaltVisible}`}
                  id="salt" 
                  type={isSaltVisible ? 'text' : 'password'}
                  placeholder={t('salt.keyword.placeholder')} 
                  value={salt} 
                  onChange={(e) => setSalt(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsSaltVisible(!isSaltVisible)}
                >
                  {isSaltVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{isSaltVisible ? t('hide.salt') : t('show.salt')}</span>
                </Button>
              </div>
          </div>
          <div className="space-y-3">
              <Label>{t('password.type')}</Label>
              <RadioGroup defaultValue="general" value={generationType} onValueChange={(value: GenerationType) => setGenerationType(value)} className="grid grid-cols-3 gap-3">
                  {(['general', '6-digit', '8-digit'] as const).map(value => (
                      <div key={value}>
                          <RadioGroupItem value={value} id={value} className="peer sr-only" />
                          <Label htmlFor={value} className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize">
                              {passwordTypes[value]}
                          </Label>
                      </div>
                  ))}
              </RadioGroup>
          </div>
          <div className="space-y-4 rounded-md border p-4">
            <div className="flex items-center space-x-3">
              <Switch id="add-year" checked={addYear} onCheckedChange={setAddYear} />
              <Label htmlFor="add-year" className="cursor-pointer">
                {t('add.year')} ({currentYear})
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="add-underscore" checked={addUnderscore} onCheckedChange={setAddUnderscore} />
              <Label htmlFor="add-underscore" className="cursor-pointer">
                {t('add.underscore')}
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="auto-copy" checked={autoCopy} onCheckedChange={setAutoCopy} />
              <Label htmlFor="auto-copy" className="cursor-pointer">
                {t('copy.to.clipboard')}
              </Label>
            </div>
          </div>
          <Button onClick={handleGenerate} className="w-full" size="lg" disabled={isLoading}>
              <KeyRound className="mr-2 h-5 w-5" />
              {isLoading ? t('generating') : t('generate.password')}
          </Button>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('your.generated.password')}</DialogTitle>
            <DialogDescription>
              {t('copy.your.password')}
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full rounded-lg border bg-secondary p-4 mt-2">
            <p className="font-code text-lg tracking-wider break-all text-chart-5">
              {formattedGeneratedPassword}
            </p>
            <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={handleCopy}>
                {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                <span className="sr-only">{t('copy.password')}</span>
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" onClick={() => onDialogClose(false)} className="w-full">
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
