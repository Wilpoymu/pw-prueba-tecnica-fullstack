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
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { useMemo } from 'react';
import { Permission } from '@/lib/rbac/permissions';
import { ProtectedContent } from '@/components/auth/ProtectedContent';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const Dashboard = () => {
  const { data: sessionData } = authClient.useSession();

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

  if (!session) return null;

  const isAdmin = session.user.role === 'ADMIN';

  return (
    <DashboardLayout>
      <div className='space-y-8'>
        {/* Welcome Section */}
        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-3xl' />
          <div className='relative'>
            <h1 className='text-4xl font-bold text-gradient'>
              Bienvenido, {session.user.name}
            </h1>
            <p className='text-muted-foreground mt-2 text-lg'>
              ¿Qué te gustaría hacer hoy?
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid gap-6 md:grid-cols-3'>
          <Card className='relative overflow-hidden border-purple-200/50 dark:border-purple-900/50 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-950/20'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl' />
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 relative'>
              <CardTitle className='text-sm font-medium'>
                Saldo Total
              </CardTitle>
              <div className='p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg'>
                <TrendingUp className='h-4 w-4 text-white' />
              </div>
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                $12,345.00
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                +20.1% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-blue-200/50 dark:border-blue-900/50 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl' />
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 relative'>
              <CardTitle className='text-sm font-medium'>Ingresos</CardTitle>
              <div className='p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg'>
                <ArrowUpRight className='h-4 w-4 text-white' />
              </div>
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                $15,234.00
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                +12.5% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-pink-200/50 dark:border-pink-900/50 bg-gradient-to-br from-white to-pink-50/50 dark:from-gray-900 dark:to-pink-950/20'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-2xl' />
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 relative'>
              <CardTitle className='text-sm font-medium'>Egresos</CardTitle>
              <div className='p-2 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg'>
                <ArrowDownRight className='h-4 w-4 text-white' />
              </div>
            </CardHeader>
            <CardContent className='relative'>
              <div className='text-3xl font-bold text-pink-600 dark:text-pink-400'>
                $2,889.00
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                +4.3% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className='grid gap-6 md:grid-cols-3'>
          <Link href='/movimientos' className='group'>
            <Card className='cursor-pointer h-full border-purple-200/50 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 relative overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
              <CardHeader className='relative'>
                <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform'>
                  <TrendingUp className='h-7 w-7 text-white' />
                </div>
                <CardTitle className='text-xl'>Gestión de Movimientos</CardTitle>
                <CardDescription className='text-base'>
                  Registra y visualiza todos tus ingresos y egresos
                </CardDescription>
              </CardHeader>
              <CardContent className='relative'>
                <ul className='text-sm text-muted-foreground space-y-3'>
                  <li className='flex items-start gap-2'>
                    <span className='text-purple-600 dark:text-purple-400 font-bold'>✓</span>
                    <span>Ver lista completa de movimientos</span>
                  </li>
                  {isAdmin && (
                    <li className='flex items-start gap-2'>
                      <span className='text-purple-600 dark:text-purple-400 font-bold'>✓</span>
                      <span>Agregar nuevos ingresos y egresos</span>
                    </li>
                  )}
                </ul>
                <Button className='w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/50'>
                  Ver Movimientos
                  <ArrowUpRight className='ml-2 h-4 w-4' />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <ProtectedContent permission={Permission.VIEW_USERS}>
            <Link href='/usuarios' className='group'>
              <Card className='cursor-pointer h-full border-blue-200/50 dark:border-blue-900/50 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                <CardHeader className='relative'>
                  <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform'>
                    <Users className='h-7 w-7 text-white' />
                  </div>
                  <CardTitle className='text-xl'>Gestión de Usuarios</CardTitle>
                  <CardDescription className='text-base'>
                    Administra usuarios y sus permisos
                  </CardDescription>
                </CardHeader>
                <CardContent className='relative'>
                  <ul className='text-sm text-muted-foreground space-y-3'>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-600 dark:text-blue-400 font-bold'>✓</span>
                      <span>Ver lista de usuarios</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-600 dark:text-blue-400 font-bold'>✓</span>
                      <span>Editar información y roles</span>
                    </li>
                  </ul>
                  <Button className='w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50'>
                    Ver Usuarios
                    <ArrowUpRight className='ml-2 h-4 w-4' />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </ProtectedContent>

          <ProtectedContent permission={Permission.VIEW_REPORTS}>
            <Link href='/reportes' className='group'>
              <Card className='cursor-pointer h-full border-pink-200/50 dark:border-pink-900/50 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-1 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                <CardHeader className='relative'>
                  <div className='w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform'>
                    <BarChart3 className='h-7 w-7 text-white' />
                  </div>
                  <CardTitle className='text-xl'>Reportes</CardTitle>
                  <CardDescription className='text-base'>
                    Visualiza gráficos y descarga reportes
                  </CardDescription>
                </CardHeader>
                <CardContent className='relative'>
                  <ul className='text-sm text-muted-foreground space-y-3'>
                    <li className='flex items-start gap-2'>
                      <span className='text-pink-600 dark:text-pink-400 font-bold'>✓</span>
                      <span>Gráficos de movimientos</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-pink-600 dark:text-pink-400 font-bold'>✓</span>
                      <span>Exportar reportes en CSV</span>
                    </li>
                  </ul>
                  <Button className='w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg shadow-pink-500/50'>
                    Ver Reportes
                    <ArrowUpRight className='ml-2 h-4 w-4' />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </ProtectedContent>
        </div>

        <ProtectedContent
          permission={Permission.VIEW_USERS}
          fallback={
            <Card className='border-blue-200/50 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl' />
              <CardContent className='pt-6 relative'>
                <p className='text-sm text-blue-900 dark:text-blue-100'>
                  <strong className='text-purple-600 dark:text-purple-400'>Nota:</strong> Como usuario estándar, tienes acceso a
                  la gestión de movimientos. Los administradores pueden acceder
                  a funciones adicionales como gestión de usuarios y reportes.
                </p>
              </CardContent>
            </Card>
          }
        >
          <></>
        </ProtectedContent>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
