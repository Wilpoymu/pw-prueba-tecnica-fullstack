import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth/client';
import { Github, Sparkles, ArrowRight, Shield, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Cargando...</p>
        </div>
      </div>
    );
  }

  if (session) return null;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 p-4 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float' />
      <div className='absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float' style={{ animationDelay: '1s' }} />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl' />
      
      <div className='absolute top-4 right-4 z-10'>
        <ThemeToggle />
      </div>

      <div className='w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10'>
        {/* Left side - Sign Up Card */}
        <Card className='w-full border-purple-200/50 dark:border-purple-900/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl relative overflow-hidden shadow-2xl lg:order-1'>
          <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none' />
          
          <CardHeader className='space-y-1 text-center relative pb-8'>
            {/* Mobile logo */}
            <div className='lg:hidden flex justify-center mb-4'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur-md opacity-50' />
                <div className='relative w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center'>
                  <Sparkles className='h-7 w-7 text-white' />
                </div>
              </div>
            </div>
            
            <CardTitle className='text-3xl font-bold text-gradient'>
              Únete a FinanceFlow
            </CardTitle>
            <CardDescription className='text-base'>
              Crea tu cuenta y comienza a gestionar tus finanzas
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6 relative'>
            <div className='space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-200/50 dark:border-purple-800/50'>
              <div className='flex items-center gap-2'>
                <Sparkles className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                <p className='text-sm font-semibold text-purple-900 dark:text-purple-100'>
                  🎉 Beneficios de registro
                </p>
              </div>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li className='flex items-center gap-2'>
                  <span className='text-purple-600 dark:text-purple-400 font-bold'>✓</span>
                  <span>Acceso completo de Administrador</span>
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-purple-600 dark:text-purple-400 font-bold'>✓</span>
                  <span>Gestión ilimitada de movimientos</span>
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-purple-600 dark:text-purple-400 font-bold'>✓</span>
                  <span>Reportes y gráficos en tiempo real</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleGithubSignUp}
              className='w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-[1.02]'
              size='lg'
            >
              <Github className='mr-2 h-5 w-5' />
              Crear cuenta con Github
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-purple-200 dark:border-purple-900' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-white dark:bg-gray-900 px-2 text-muted-foreground'>
                  Autenticación segura con OAuth
                </span>
              </div>
            </div>

            <div className='text-center space-y-2'>
              <p className='text-sm text-muted-foreground'>
                ¿Ya tienes una cuenta?
              </p>
              <Link
                href='/auth/sign-in'
                className='inline-flex items-center gap-1 font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors group'
              >
                Iniciar sesión
                <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Right side - Features */}
        <div className='hidden lg:block space-y-6 lg:order-2'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-50 animate-glow' />
              <div className='relative w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center'>
                <Sparkles className='h-8 w-8 text-white' />
              </div>
            </div>
            <div>
              <h1 className='text-4xl font-bold text-gradient'>FinanceFlow</h1>
              <p className='text-purple-600 dark:text-purple-400 font-medium'>
                Sistema de Gestión Financiera
              </p>
            </div>
          </div>

          <div className='space-y-6'>
            <h2 className='text-3xl font-bold text-foreground'>
              Todo lo que necesitas para tus{' '}
              <span className='text-gradient'>finanzas</span>
            </h2>
            <p className='text-lg text-muted-foreground'>
              Regístrate ahora y obtén acceso inmediato a todas las funciones
              como administrador.
            </p>

            <div className='space-y-4'>
              <div className='flex items-start gap-3 group cursor-default'>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'>
                  <Shield className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                </div>
                <div>
                  <h3 className='font-semibold text-foreground text-lg'>
                    Gestión de Movimientos
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Registra y visualiza todos tus ingresos y egresos con
                    detalles completos
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 group cursor-default'>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'>
                  <Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <h3 className='font-semibold text-foreground text-lg'>
                    Control de Usuarios
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Administra usuarios y asigna roles con sistema de permisos
                    granular
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 group cursor-default'>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform'>
                  <BarChart3 className='h-6 w-6 text-pink-600 dark:text-pink-400' />
                </div>
                <div>
                  <h3 className='font-semibold text-foreground text-lg'>
                    Reportes Detallados
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Visualiza gráficos y exporta reportes en formato CSV
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
