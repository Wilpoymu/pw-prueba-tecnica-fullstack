import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LogOut, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { data: sessionData, isPending } = authClient.useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isPending && !sessionData && isClient) {
      router.push('/auth/sign-in');
    }
  }, [sessionData, isPending, router, isClient]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  if (!isClient) {
    return null;
  }

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!sessionData) return null;

  const session = {
    ...sessionData,
    user: {
      ...sessionData.user,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: (sessionData.user as any).role as string | undefined,
    },
  };

  const isAdmin = session.user.role === 'ADMIN';

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className='lg:ml-72 flex flex-col min-h-screen'>
        {/* Header */}
        <header className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-purple-200/50 dark:border-purple-900/50 sticky top-0 z-30'>
          <div className='px-4 lg:px-8 py-4'>
            <div className='flex items-center justify-between'>
              {/* Spacer for mobile menu button */}
              <div className='w-10 lg:w-0' />

              {/* User Info */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-200/50 dark:border-purple-800/50'>
                  <div className='hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden ring-2 ring-purple-400/50'>
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <User className='h-5 w-5 text-white' />
                    )}
                  </div>
                  <div className='hidden md:block'>
                    <p className='text-sm font-semibold'>{session.user.name}</p>
                    <p className='text-xs text-purple-600 dark:text-purple-400'>
                      {isAdmin ? 'Administrador' : 'Usuario'}
                    </p>
                  </div>
                </div>
                <ThemeToggle />
                <Button 
                  variant='ghost' 
                  size='icon' 
                  onClick={handleSignOut}
                  className='hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400'
                >
                  <LogOut className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 px-4 lg:px-8 py-8'>{children}</main>
      </div>
    </div>
  );
};
