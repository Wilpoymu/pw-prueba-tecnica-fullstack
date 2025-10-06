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
  Sparkles,
  Zap,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float'
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float'
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className='absolute top-4 right-4 z-10'>
        <ThemeToggle />
      </div>
      <div className='container mx-auto px-4 py-20 relative z-10'>
        <div className='max-w-4xl mx-auto space-y-12'>
          {/* Welcome Header */}
          <div className='text-center space-y-6'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4 animate-glow shadow-2xl shadow-purple-500/50'>
              <CheckCircle2 className='h-12 w-12 text-white' />
            </div>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 mb-4'>
              <Sparkles className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              <span className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                ¡Cuenta creada exitosamente!
              </span>
            </div>
            <h1 className='text-5xl md:text-7xl font-bold'>
              ¡Bienvenido,
              <br />
              <span className='text-gradient'>{session.user.name}!</span>
            </h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Tu cuenta ha sido creada con permisos de{' '}
              <span className='font-semibold text-purple-600 dark:text-purple-400'>
                Administrador
              </span>
              . Ahora tienes acceso completo a todas las funcionalidades.
            </p>
          </div>

          {/* User Info Card */}
          <Card className='glass border-purple-500/20 hover:border-purple-500/40 transition-all duration-300'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                Información de tu cuenta
              </CardTitle>
              <CardDescription>
                Estos son los datos de tu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-4'>
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className='w-16 h-16 rounded-full border-2 border-purple-500/30'
                  />
                )}
                <div>
                  <p className='font-semibold text-xl'>{session.user.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {session.user.email}
                  </p>
                  <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 mt-2'>
                    <Sparkles className='h-3 w-3 text-white' />
                    <span className='text-xs text-white font-semibold'>
                      ADMINISTRADOR
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What you can do */}
          <div className='space-y-8'>
            <div className='text-center space-y-2'>
              <h2 className='text-3xl font-bold'>
                ¿Qué puedes hacer como Administrador?
              </h2>
              <p className='text-muted-foreground'>
                Acceso completo a todas las funcionalidades de la plataforma
              </p>
            </div>

            <div className='grid md:grid-cols-3 gap-6'>
              <Card className='glass border-purple-500/20 hover:border-purple-500/40 hover:-translate-y-2 transition-all duration-300 group'>
                <CardContent className='pt-6 space-y-4'>
                  <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-shadow'>
                    <TrendingUp className='h-7 w-7 text-white' />
                  </div>
                  <h3 className='font-semibold text-lg'>
                    Gestionar Movimientos
                  </h3>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0' />
                      <span>Ver todos los ingresos y egresos</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0' />
                      <span>Agregar nuevos movimientos</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0' />
                      <span>Editar y eliminar movimientos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className='glass border-blue-500/20 hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-300 group'>
                <CardContent className='pt-6 space-y-4'>
                  <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/70 transition-shadow'>
                    <Users className='h-7 w-7 text-white' />
                  </div>
                  <h3 className='font-semibold text-lg'>
                    Administrar Usuarios
                  </h3>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
                      <span>Ver lista de usuarios</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
                      <span>Editar información de usuarios</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
                      <span>Gestionar roles y permisos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className='glass border-cyan-500/20 hover:border-cyan-500/40 hover:-translate-y-2 transition-all duration-300 group'>
                <CardContent className='pt-6 space-y-4'>
                  <div className='w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70 transition-shadow'>
                    <BarChart3 className='h-7 w-7 text-white' />
                  </div>
                  <h3 className='font-semibold text-lg'>Ver Reportes</h3>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0' />
                      <span>Gráficos de movimientos</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0' />
                      <span>Consultar saldo actual</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0' />
                      <span>Exportar reportes en CSV</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className='glass border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10'>
            <CardContent className='pt-10 pb-10 text-center space-y-6'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-2 animate-glow shadow-2xl shadow-purple-500/50'>
                <Zap className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-3xl font-bold'>¿Listo para comenzar?</h3>
              <p className='text-lg text-muted-foreground max-w-xl mx-auto'>
                Accede al dashboard y empieza a gestionar tus finanzas de manera
                profesional
              </p>
              <Link href='/dashboard'>
                <Button
                  size='lg'
                  className='text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300'
                >
                  Ir al Dashboard
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>
              <div className='flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1.5'>
                  <CheckCircle2 className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  <span>Acceso completo</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <CheckCircle2 className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                  <span>Sin límites</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <CheckCircle2 className='h-4 w-4 text-cyan-600 dark:text-cyan-400' />
                  <span>Gestión total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
