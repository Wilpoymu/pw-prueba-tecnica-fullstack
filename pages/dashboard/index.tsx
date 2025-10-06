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
  LogOut,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';

const Dashboard = () => {
  const { data: sessionData, isPending } = authClient.useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Usar useMemo para evitar recrear el objeto en cada render
  const session = useMemo(() => {
    if (!sessionData) return null;
    
    return {
      ...sessionData,
      user: {
        ...sessionData.user,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (sessionData.user as any).role as string | undefined,
      },
    };
  }, [sessionData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session && isClient) {
      router.push('/auth/sign-in');
    }
  }, [session, isPending, router, isClient]);

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

  if (!session) return null;

  const isAdmin = session.user.role === 'ADMIN';

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <DollarSign className='h-8 w-8 text-green-600' />
              <span className='text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
                FinanceFlow
              </span>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3'>
                <div className='hidden md:block'>
                  <p className='text-sm font-semibold'>{session.user.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {isAdmin ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
              </div>
              <Button variant='ghost' size='icon' onClick={handleSignOut}>
                <LogOut className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-8'>
          {/* Welcome Section */}
          <div>
            <h1 className='text-3xl font-bold'>
              Bienvenido, {session.user.name}
            </h1>
            <p className='text-muted-foreground mt-2'>
              ¿Qué te gustaría hacer hoy?
            </p>
          </div>

          {/* Quick Stats */}
          <div className='grid gap-4 md:grid-cols-3'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Saldo Total
                </CardTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>$12,345.00</div>
                <p className='text-xs text-muted-foreground'>
                  +20.1% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Ingresos</CardTitle>
                <ArrowUpRight className='h-4 w-4 text-green-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>
                  $15,234.00
                </div>
                <p className='text-xs text-muted-foreground'>
                  +12.5% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Egresos</CardTitle>
                <ArrowDownRight className='h-4 w-4 text-red-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-red-600'>$2,889.00</div>
                <p className='text-xs text-muted-foreground'>
                  +4.3% desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Navigation Cards */}
          <div className='grid gap-6 md:grid-cols-3'>
            {/* Sistema de gestión de ingresos y gastos */}
            <Link href='/movimientos'>
              <Card className='cursor-pointer hover:border-primary transition-colors h-full'>
                <CardHeader>
                  <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4'>
                    <TrendingUp className='h-6 w-6 text-green-600 dark:text-green-400' />
                  </div>
                  <CardTitle>Gestión de Movimientos</CardTitle>
                  <CardDescription>
                    Registra y visualiza todos tus ingresos y egresos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <span className='text-green-600'>✓</span>
                      <span>Ver lista completa de movimientos</span>
                    </li>
                    {isAdmin && (
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600'>✓</span>
                        <span>Agregar nuevos ingresos y egresos</span>
                      </li>
                    )}
                  </ul>
                  <Button className='w-full mt-4'>
                    Ver Movimientos
                    <ArrowUpRight className='ml-2 h-4 w-4' />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Gestión de usuarios (solo admin) */}
            {isAdmin && (
              <Link href='/usuarios'>
                <Card className='cursor-pointer hover:border-primary transition-colors h-full'>
                  <CardHeader>
                    <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4'>
                      <Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                    </div>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>
                      Administra usuarios y sus permisos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className='text-sm text-muted-foreground space-y-2'>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600'>✓</span>
                        <span>Ver lista de usuarios</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600'>✓</span>
                        <span>Editar información y roles</span>
                      </li>
                    </ul>
                    <Button className='w-full mt-4'>
                      Ver Usuarios
                      <ArrowUpRight className='ml-2 h-4 w-4' />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Reportes (solo admin) */}
            {isAdmin && (
              <Link href='/reportes'>
                <Card className='cursor-pointer hover:border-primary transition-colors h-full'>
                  <CardHeader>
                    <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4'>
                      <BarChart3 className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                    </div>
                    <CardTitle>Reportes</CardTitle>
                    <CardDescription>
                      Visualiza gráficos y descarga reportes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className='text-sm text-muted-foreground space-y-2'>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600'>✓</span>
                        <span>Gráficos de movimientos</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600'>✓</span>
                        <span>Exportar reportes en CSV</span>
                      </li>
                    </ul>
                    <Button className='w-full mt-4'>
                      Ver Reportes
                      <ArrowUpRight className='ml-2 h-4 w-4' />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          {/* Info for non-admin users */}
          {!isAdmin && (
            <Card className='border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900'>
              <CardContent className='pt-6'>
                <p className='text-sm text-blue-900 dark:text-blue-100'>
                  <strong>Nota:</strong> Como usuario estándar, tienes acceso a
                  la gestión de movimientos. Los administradores pueden acceder
                  a funciones adicionales como gestión de usuarios y reportes.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
