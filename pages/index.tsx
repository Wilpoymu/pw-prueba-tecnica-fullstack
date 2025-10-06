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
  DollarSign,
  FileText,
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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Header */}
      <header className='container mx-auto px-4 py-6 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <DollarSign className='h-8 w-8 text-green-600' />
          <span className='text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
            FinanceFlow
          </span>
        </div>
        <div className='flex gap-4 items-center'>
          <ThemeToggle />
          <Link href='/auth/sign-in'>
            <Button variant='ghost'>Iniciar sesión</Button>
          </Link>
          <Link href='/auth/sign-up'>
            <Button>
              Comenzar
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-20 text-center'>
        <div className='max-w-4xl mx-auto space-y-8'>
          <h1 className='text-5xl md:text-7xl font-bold tracking-tight'>
            Gestiona tus{' '}
            <span className='bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
              Finanzas
            </span>{' '}
            con Facilidad
          </h1>

          <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto'>
            Sistema completo de gestión de ingresos y egresos con reportes
            detallados y control de usuarios
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-8'>
            <Link href='/auth/sign-up'>
              <Button size='lg' className='text-lg px-8 py-6'>
                <Github className='mr-2 h-5 w-5' />
                Comenzar con GitHub
              </Button>
            </Link>
          </div>

          <p className='text-sm text-muted-foreground'>
            🎉 Todos los nuevos usuarios obtienen acceso de Administrador
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className='container mx-auto px-4 py-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-4'>
            Funcionalidades Principales
          </h2>
          <p className='text-muted-foreground text-lg'>
            Todo lo que necesitas para controlar tus finanzas
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          <Card className='border-2 hover:border-primary transition-colors'>
            <CardContent className='pt-6 space-y-4'>
              <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center'>
                <TrendingUp className='h-6 w-6 text-green-600 dark:text-green-400' />
              </div>
              <h3 className='text-xl font-semibold'>Gestión de Movimientos</h3>
              <p className='text-muted-foreground'>
                Registra y visualiza todos tus ingresos y egresos con detalles
                completos: concepto, monto, fecha y usuario responsable.
              </p>
            </CardContent>
          </Card>

          <Card className='border-2 hover:border-primary transition-colors'>
            <CardContent className='pt-6 space-y-4'>
              <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center'>
                <Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
              </div>
              <h3 className='text-xl font-semibold'>Control de Usuarios</h3>
              <p className='text-muted-foreground'>
                Administra usuarios, asigna roles y permisos. Los
                administradores tienen control total del sistema.
              </p>
            </CardContent>
          </Card>

          <Card className='border-2 hover:border-primary transition-colors'>
            <CardContent className='pt-6 space-y-4'>
              <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center'>
                <BarChart3 className='h-6 w-6 text-purple-600 dark:text-purple-400' />
              </div>
              <h3 className='text-xl font-semibold'>Reportes Detallados</h3>
              <p className='text-muted-foreground'>
                Visualiza gráficos de movimientos, consulta tu saldo actual y
                exporta reportes en formato CSV.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roles Section */}
      <section className='container mx-auto px-4 py-20'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Roles y Permisos</h2>
            <p className='text-muted-foreground text-lg'>
              Sistema de permisos flexible para diferentes necesidades
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <Card className='border-2'>
              <CardContent className='pt-6 space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center'>
                    <Shield className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <h3 className='text-xl font-semibold'>Usuario</h3>
                </div>
                <ul className='space-y-2 text-muted-foreground'>
                  <li className='flex items-start gap-2'>
                    <span className='text-green-600 mt-1'>✓</span>
                    <span>Acceso a gestión de movimientos</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-green-600 mt-1'>✓</span>
                    <span>Visualización de ingresos y egresos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className='border-2 border-primary'>
              <CardContent className='pt-6 space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center'>
                    <Shield className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                  </div>
                  <h3 className='text-xl font-semibold'>Administrador</h3>
                </div>
                <ul className='space-y-2 text-muted-foreground'>
                  <li className='flex items-start gap-2'>
                    <span className='text-green-600 mt-1'>✓</span>
                    <span>Todos los permisos de usuario</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-green-600 mt-1'>✓</span>
                    <span>Agregar nuevos movimientos</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-green-600 mt-1'>✓</span>
                    <span>Gestión completa de usuarios</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-green-600 mt-1'>✓</span>
                    <span>Acceso a reportes y gráficos</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-green-600 mt-1'>✓</span>
                    <span>Exportación de datos en CSV</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-4 py-20'>
        <Card className='max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-blue-600 border-0'>
          <CardContent className='pt-12 pb-12 text-center text-white space-y-6'>
            <FileText className='h-16 w-16 mx-auto mb-4' />
            <h2 className='text-3xl md:text-4xl font-bold'>
              ¿Listo para tomar control de tus finanzas?
            </h2>
            <p className='text-lg text-green-100 max-w-2xl mx-auto'>
              Únete ahora y obtén acceso completo como administrador. Empieza a
              gestionar tus ingresos y egresos de forma profesional.
            </p>
            <Link href='/auth/sign-up'>
              <Button
                size='lg'
                variant='secondary'
                className='text-lg px-8 py-6'
              >
                <Github className='mr-2 h-5 w-5' />
                Crear cuenta gratis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className='container mx-auto px-4 py-8 text-center text-muted-foreground border-t'>
        <p>&copy; 2025 FinanceFlow. Sistema de Gestión Financiera.</p>
      </footer>
    </div>
  );
};
export default Home;
