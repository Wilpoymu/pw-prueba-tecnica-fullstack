import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TrendingUp,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Welcome = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session && isClient) {
      router.push('/auth/sign-in');
    }
  }, [session, isPending, router, isClient]);

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

  if (!session) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='container mx-auto px-4 py-20'>
        <div className='max-w-4xl mx-auto space-y-12'>
          {/* Welcome Header */}
          <div className='text-center space-y-4'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4'>
              <CheckCircle2 className='h-10 w-10 text-green-600 dark:text-green-400' />
            </div>
            <h1 className='text-4xl md:text-5xl font-bold'>
              ¡Bienvenido, {session.user.name}! 🎉
            </h1>
            <p className='text-xl text-muted-foreground'>
              Tu cuenta ha sido creada exitosamente con permisos de{' '}
              <span className='font-semibold text-purple-600'>
                Administrador
              </span>
            </p>
          </div>

          {/* User Info Card */}
          <Card className='border-2'>
            <CardHeader>
              <CardTitle>Información de tu cuenta</CardTitle>
              <CardDescription>
                Estos son los datos de tu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div>
                  <p className='font-semibold text-lg'>{session.user.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {session.user.email}
                  </p>
                  <p className='text-xs text-purple-600 font-medium mt-1'>
                    ROL: ADMINISTRADOR
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What you can do */}
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-center'>
              ¿Qué puedes hacer como Administrador?
            </h2>

            <div className='grid md:grid-cols-3 gap-6'>
              <Card className='border-2 hover:border-primary transition-colors'>
                <CardContent className='pt-6 space-y-4'>
                  <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center'>
                    <TrendingUp className='h-6 w-6 text-green-600 dark:text-green-400' />
                  </div>
                  <h3 className='font-semibold'>Gestionar Movimientos</h3>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Ver todos los ingresos y egresos</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Agregar nuevos movimientos</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Editar movimientos existentes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className='border-2 hover:border-primary transition-colors'>
                <CardContent className='pt-6 space-y-4'>
                  <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center'>
                    <Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                  </div>
                  <h3 className='font-semibold'>Administrar Usuarios</h3>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Ver lista de usuarios</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Editar información de usuarios</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Gestionar roles y permisos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className='border-2 hover:border-primary transition-colors'>
                <CardContent className='pt-6 space-y-4'>
                  <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center'>
                    <BarChart3 className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                  </div>
                  <h3 className='font-semibold'>Ver Reportes</h3>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Gráficos de movimientos</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Consultar saldo actual</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Exportar reportes en CSV</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className='border-2 border-primary bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950'>
            <CardContent className='pt-8 pb-8 text-center space-y-4'>
              <h3 className='text-2xl font-bold'>¿Listo para comenzar?</h3>
              <p className='text-muted-foreground'>
                Accede al dashboard y empieza a gestionar tus finanzas
              </p>
              <Link href='/dashboard'>
                <Button size='lg' className='text-lg px-8'>
                  Ir al Dashboard
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Welcome;