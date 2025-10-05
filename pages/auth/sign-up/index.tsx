import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth/client';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SignUp = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isPending && session && isClient) {
      router.push('/dashboard');
    }
  }, [session, isPending, router, isClient]);

  const handleGithubSignUp = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/welcome',
      newUserCallbackURL: '/welcome',
    });
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

  if (session) return null;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <CardTitle className='text-2xl font-bold'>Crear cuenta</CardTitle>
          <CardDescription>Continúa con Github para comenzar</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button
            onClick={handleGithubSignUp}
            className='w-full'
            size='lg'
            variant='default'
          >
            <Github className='mr-2 h-5 w-5' />
            Continuar con Github
          </Button>
        </CardContent>

        <div className='text-center text-sm text-muted-foreground p-4'>
          ¿Ya tienes una cuenta?{' '}
          <Link
            href='/auth/sign-in'
            className='font-medium text-primary hover:underline'
          >
            Inicia sesión
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;