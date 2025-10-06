import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Github,
  ArrowRight,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Sparkles,
  Zap,
  Lock,
  Download,
} from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Home = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float' />
      <div className='absolute top-1/4 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float' style={{ animationDelay: '2s' }} />
      <div className='absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float' style={{ animationDelay: '4s' }} />
      
      {/* Header */}
      <header className='relative z-10 container mx-auto px-4 py-6 flex justify-between items-center backdrop-blur-sm'>
        <Link href='/' className='flex items-center gap-3 group'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity' />
            <div className='relative w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center'>
              <Sparkles className='h-6 w-6 text-white' />
            </div>
          </div>
          <span className='text-2xl font-bold text-gradient'>
            Flowly
          </span>
        </Link>
        <div className='flex gap-3 items-center'>
          <ThemeToggle />
          <Link href='/auth/sign-in'>
            <Button variant='ghost' className='hover:bg-purple-500/10'>
              Iniciar sesión
            </Button>
          </Link>
          <Link href='/auth/sign-up'>
            <Button className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/50'>
              Comenzar
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative z-10 container mx-auto px-4 py-20 md:py-32 text-center'>
        <div className='max-w-5xl mx-auto space-y-8'>
          {/* Badge */}
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm'>
            <Sparkles className='h-4 w-4 text-purple-600 dark:text-purple-400' />
            <span className='text-sm font-medium text-purple-600 dark:text-purple-400'>
              Acceso de administrador para todos los nuevos usuarios
            </span>
          </div>

          <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight'>
            Gestiona tus finanzas con{' '}
            <span className='text-gradient animate-gradient-x'>
              inteligencia
            </span>
          </h1>

          <p className='text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            Sistema completo de gestión de ingresos y egresos con reportes
            detallados, control de usuarios y una interfaz moderna
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-8'>
            <Link href='/auth/sign-up'>
              <Button size='lg' className='text-lg px-8 py-6 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105'>
                <Github className='mr-2 h-5 w-5' />
                Comenzar gratis con GitHub
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>

          <p className='text-sm text-muted-foreground flex items-center justify-center gap-2'>
            <Lock className='h-4 w-4' />
            Autenticación segura con OAuth • Sin tarjeta de crédito
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className='relative z-10 container mx-auto px-4 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-gradient'>
            Funcionalidades Principales
          </h2>
          <p className='text-muted-foreground text-xl max-w-2xl mx-auto'>
            Todo lo que necesitas para controlar tus finanzas de manera profesional
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          <Card className='group border-purple-200/50 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2 relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            <CardContent className='pt-8 space-y-4 relative'>
              <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform'>
                <TrendingUp className='h-7 w-7 text-white' />
              </div>
              <h3 className='text-2xl font-bold'>Gestión de Movimientos</h3>
              <p className='text-muted-foreground leading-relaxed'>
                Registra y visualiza todos tus ingresos y egresos con detalles
                completos: concepto, monto, fecha y usuario responsable.
              </p>
            </CardContent>
          </Card>

          <Card className='group border-blue-200/50 dark:border-blue-900/50 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2 relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            <CardContent className='pt-8 space-y-4 relative'>
              <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform'>
                <Users className='h-7 w-7 text-white' />
              </div>
              <h3 className='text-2xl font-bold'>Control de Usuarios</h3>
              <p className='text-muted-foreground leading-relaxed'>
                Administra usuarios, asigna roles y permisos. Los
                administradores tienen control total del sistema.
              </p>
            </CardContent>
          </Card>

          <Card className='group border-pink-200/50 dark:border-pink-900/50 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-2 relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            <CardContent className='pt-8 space-y-4 relative'>
              <div className='w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform'>
                <BarChart3 className='h-7 w-7 text-white' />
              </div>
              <h3 className='text-2xl font-bold'>Reportes Detallados</h3>
              <p className='text-muted-foreground leading-relaxed'>
                Visualiza gráficos de movimientos, consulta tu saldo actual y
                exporta reportes en formato CSV.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roles Section */}
      <section className='relative z-10 container mx-auto px-4 py-20'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-gradient'>
              Roles y Permisos
            </h2>
            <p className='text-muted-foreground text-xl max-w-2xl mx-auto'>
              Sistema de permisos flexible para diferentes necesidades
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <Card className='border-blue-200/50 dark:border-blue-900/50 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl' />
              <CardContent className='pt-8 space-y-6 relative'>
                <div className='flex items-center gap-4'>
                  <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50'>
                    <Shield className='h-7 w-7 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold'>Usuario</h3>
                </div>
                <ul className='space-y-3 text-muted-foreground'>
                  <li className='flex items-start gap-3'>
                    <span className='text-blue-600 dark:text-blue-400 font-bold text-lg mt-0.5'>✓</span>
                    <span className='text-base'>Acceso a gestión de movimientos</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='text-blue-600 dark:text-blue-400 font-bold text-lg mt-0.5'>✓</span>
                    <span className='text-base'>Visualización de ingresos y egresos</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='text-blue-600 dark:text-blue-400 font-bold text-lg mt-0.5'>✓</span>
                    <span className='text-base'>Interfaz intuitiva y moderna</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className='border-purple-200/50 dark:border-purple-900/50 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 relative overflow-hidden ring-2 ring-purple-500/50'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl' />
              <div className='absolute top-4 right-4'>
                <span className='px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg'>
                  RECOMENDADO
                </span>
              </div>
              <CardContent className='pt-8 space-y-6 relative'>
                <div className='flex items-center gap-4'>
                  <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50'>
                    <Zap className='h-7 w-7 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold'>Administrador</h3>
                </div>
                <ul className='space-y-3 text-muted-foreground'>
                  <li className='flex items-start gap-3'>
                    <span className='text-purple-600 dark:text-purple-400 font-bold text-lg mt-0.5'>✓</span>
                    <span className='text-base'>Todos los permisos de usuario</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='text-purple-600 dark:text-purple-400 font-bold text-lg mt-0.5'>✓</span>
                    <span className='text-base'>Agregar y editar movimientos</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='text-purple-600 dark:text-purple-400 font-bold text-lg mt-0.5'>✓</span>
                    <span className='text-base'>Gestión completa de usuarios</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='text-purple-600 dark:text-purple-400 font-bold text-lg mt-0.5'>✓</span>
                    <span className='text-base'>Acceso a reportes y gráficos</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='text-purple-600 dark:text-purple-400 font-bold text-lg mt-0.5'>✓</span>
                    <span className='text-base'>Exportación de datos en CSV</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative z-10 container mx-auto px-4 py-20'>
        <Card className='max-w-5xl mx-auto bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 border-0 relative overflow-hidden shadow-2xl'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl' />
          
          <CardContent className='relative pt-16 pb-16 text-center text-white space-y-8'>
            <div className='w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6'>
              <Download className='h-10 w-10 text-white' />
            </div>
            
            <h2 className='text-4xl md:text-5xl font-bold max-w-3xl mx-auto'>
              ¿Listo para transformar la gestión de tus finanzas?
            </h2>
            
            <p className='text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed'>
              Únete ahora y obtén acceso completo como administrador. Comienza a
              gestionar tus ingresos y egresos de forma profesional en minutos.
            </p>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
              <Link href='/auth/sign-up'>
                <Button
                  size='lg'
                  variant='secondary'
                  className='text-lg px-8 py-6 h-14 bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105'
                >
                  <Github className='mr-2 h-5 w-5' />
                  Crear cuenta gratis
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>
            </div>

            <div className='flex items-center justify-center gap-8 pt-8 text-purple-100'>
              <div className='flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                <span className='text-sm'>100% Seguro</span>
              </div>
              <div className='flex items-center gap-2'>
                <Zap className='h-5 w-5' />
                <span className='text-sm'>Configuración instantánea</span>
              </div>
              <div className='hidden sm:flex items-center gap-2'>
                <Lock className='h-5 w-5' />
                <span className='text-sm'>Sin tarjeta requerida</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className='relative z-10 container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-purple-200/50 dark:border-purple-900/50'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center'>
              <Sparkles className='h-4 w-4 text-white' />
            </div>
            <span className='font-semibold text-gradient'>Flowly</span>
          </div>
          <p>&copy; 2025 Flowly. Sistema de Gestión Financiera.</p>
          <div className='flex gap-4 text-sm'>
            <Link href='#' className='hover:text-purple-600 dark:hover:text-purple-400 transition-colors'>
              Privacidad
            </Link>
            <Link href='#' className='hover:text-purple-600 dark:hover:text-purple-400 transition-colors'>
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Home;
