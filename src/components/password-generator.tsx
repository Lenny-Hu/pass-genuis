"use client";

import { useState } from 'react';
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
import { KeyRound, Lock, Copy, Check } from 'lucide-react';

type GenerationType = 'general' | '6-digit' | '8-digit';

export function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [generationType, setGenerationType] = useState<GenerationType>('general');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const sha256 = async (str: string) => {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const handleGenerate = async () => {
    if (!password || !salt) {
      toast({
        title: 'Error',
        description: 'Password and Salt fields cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedPassword('');

    try {
      const hash = await sha256(password + salt);
      let result = '';

      switch (generationType) {
        case 'general':
          const first10 = hash.substring(0, 10);
          result = first10.charAt(0).toUpperCase() + first10.slice(1);
          break;
        case '6-digit':
          const digitsOnly6 = hash.replace(/\D/g, '');
          if (digitsOnly6.length < 6) {
            toast({ title: 'Generation Failed', description: 'Could not find 6 digits in the hash. Try a different salt.', variant: 'destructive'});
            return;
          }
          result = digitsOnly6.slice(-6);
          break;
        case '8-digit':
          const digitsOnly8 = hash.replace(/\D/g, '');
          if (digitsOnly8.length < 8) {
            toast({ title: 'Generation Failed', description: 'Could not find 8 digits in the hash. Try a different salt.', variant: 'destructive'});
            return;
          }
          const mid = Math.floor(digitsOnly8.length / 2);
          result = digitsOnly8.substring(mid - 4, mid + 4);
          break;
      }
      setGeneratedPassword(result);
      setIsDialogOpen(true);
    } catch (error) {
        console.error("Password generation failed:", error);
        toast({ title: 'Error', description: 'An unexpected error occurred during password generation.', variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setIsCopied(true);
      toast({
        title: 'Copied!',
        description: 'Password copied to clipboard.',
      });
    }
  };

  const onDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsCopied(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline text-3xl tracking-tight">PassGenius</CardTitle>
          </div>
          <CardDescription className="pt-1">A secure password generator using your master key and a salt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="password">Master Password</Label>
              <Input id="password" type="password" placeholder="Enter your secret password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="salt">Salt / Keyword</Label>
              <Input id="salt" type="text" placeholder="e.g., website.com" value={salt} onChange={(e) => setSalt(e.target.value)} />
          </div>
          <div className="space-y-3">
              <Label>Password Type</Label>
              <RadioGroup defaultValue="general" value={generationType} onValueChange={(value: GenerationType) => setGenerationType(value)} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['general', '6-digit', '8-digit'] as const).map(value => (
                      <div key={value}>
                          <RadioGroupItem value={value} id={value} className="peer sr-only" />
                          <Label htmlFor={value} className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize">
                              {value.replace('-',' ')}
                          </Label>
                      </div>
                  ))}
              </RadioGroup>
          </div>
          <Button onClick={handleGenerate} className="w-full" size="lg" disabled={isLoading}>
              <KeyRound className="mr-2 h-5 w-5" />
              {isLoading ? 'Generating...' : 'Generate Password'}
          </Button>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Generated Password</DialogTitle>
            <DialogDescription>
              Copy your new password. It is not saved anywhere.
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full rounded-lg border bg-secondary p-4 mt-2">
            <p className="font-code text-lg tracking-wider break-all text-secondary-foreground">
              {generatedPassword}
            </p>
            <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={handleCopy}>
                {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                <span className="sr-only">Copy password</span>
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" onClick={() => onDialogClose(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
