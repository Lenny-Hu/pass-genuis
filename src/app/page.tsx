import { PasswordGenerator } from '@/components/password-generator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-6">
      <PasswordGenerator />
    </main>
  );
}
