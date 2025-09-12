'use client';

import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <Button 
      onClick={async () => {
        await signOut({
          callbackUrl: '/',
          redirect: true
        });
      }}
      variant="outline"
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <LogOut className="w-4 h-4" />
      خروج
    </Button>
  );
}
