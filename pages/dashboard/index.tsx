import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Activity,
  Calendar,
  PiggyBank,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { useMemo, useState, useEffect } from 'react';
import { Permission } from '@/lib/rbac/permissions';
import { ProtectedContent } from '@/components/auth/ProtectedContent';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const { data: sessionData } = authClient.useSession();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch movements data
  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        const allMovements: Movement[] = [];
        let page = 1;
        let hasMore = true;

        // Fetch all pages
        while (hasMore) {
          const response = await fetch(`/api/movements?page=${page}&limit=100&sortBy=date&sortOrder=desc`);
          const data = await response.json();

          if (data.success && data.data.length > 0) {
            allMovements.push(...data.data);
            // Check if there are more pages
            hasMore = data.pagination && page < data.pagination.totalPages;
            page++;
          } else {
            hasMore = false;
          }
        }

        setMovements(allMovements);
      } catch (error) {
        console.error('Error fetching movements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchMovements();
    }
  }, [session]);

  if (!session) return null;

  const isAdmin = session.user.role === 'ADMIN';

  // Calcular métricas reales desde los movimientos
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Movimientos del mes actual
  const currentMonthMovements = movements.filter(m => {
    const date = new Date(m.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Movimientos del mes pasado
  const lastMonthMovements = movements.filter(m => {
    const date = new Date(m.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  // Calcular totales del mes actual
  const ingresosDelMes = currentMonthMovements
    .filter(m => m.type === 'INCOME')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const egresosDelMes = currentMonthMovements
    .filter(m => m.type === 'EXPENSE')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  // Calcular totales del mes pasado
  const ingresosDelMesPasado = lastMonthMovements
    .filter(m => m.type === 'INCOME')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const egresosDelMesPasado = lastMonthMovements
    .filter(m => m.type === 'EXPENSE')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  // Saldo total (todos los ingresos - todos los egresos)
  const totalIngresos = movements
    .filter(m => m.type === 'INCOME')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const totalEgresos = movements
    .filter(m => m.type === 'EXPENSE')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const saldoTotal = totalIngresos - totalEgresos;
  
  // Balance neto de cada mes
  const balanceMesActual = ingresosDelMes - egresosDelMes;
  const balanceMesPasado = ingresosDelMesPasado - egresosDelMesPasado;

  // Calcular cambios porcentuales
  // Para el saldo total: comparar el balance del mes actual vs mes pasado
  const cambioSaldo = balanceMesPasado !== 0 
    ? ((balanceMesActual - balanceMesPasado) / Math.abs(balanceMesPasado)) * 100 
    : (balanceMesActual > 0 ? 100 : 0);

  const cambioIngresos = ingresosDelMesPasado !== 0
    ? ((ingresosDelMes - ingresosDelMesPasado) / ingresosDelMesPasado) * 100
    : (ingresosDelMes > 0 ? 100 : 0);

  const cambioEgresos = egresosDelMesPasado !== 0
    ? ((egresosDelMes - egresosDelMesPasado) / egresosDelMesPasado) * 100
    : (egresosDelMes > 0 ? 100 : 0);

  // Tasa de ahorro
  const tasaAhorro = ingresosDelMes !== 0 
    ? ((ingresosDelMes - egresosDelMes) / ingresosDelMes) * 100 
    : 0;

  // Calcular estado financiero
  const getEstadoFinanciero = () => {
    const ratio = ingresosDelMes / egresosDelMes;
    if (ratio >= 5) return { label: 'Excelente', color: 'bg-gradient-to-r from-green-500 to-emerald-600', icon: CheckCircle2, textColor: 'text-green-700 dark:text-green-300' };
    if (ratio >= 3) return { label: 'Saludable', color: 'bg-gradient-to-r from-blue-500 to-cyan-600', icon: TrendingUp, textColor: 'text-blue-700 dark:text-blue-300' };
    if (ratio >= 2) return { label: 'Estable', color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: Activity, textColor: 'text-purple-700 dark:text-purple-300' };
    if (ratio >= 1.5) return { label: 'Precaución', color: 'bg-gradient-to-r from-yellow-500 to-orange-600', icon: AlertCircle, textColor: 'text-yellow-700 dark:text-yellow-300' };
    return { label: 'Atención', color: 'bg-gradient-to-r from-red-500 to-pink-600', icon: AlertCircle, textColor: 'text-red-700 dark:text-red-300' };
  };

  const estadoFinanciero = getEstadoFinanciero();
  const EstadoIcon = estadoFinanciero.icon;

  return (
    <DashboardLayout>
      {loading ? (
        <div className='flex items-center justify-center py-16'>
          <div className='text-center'>
            <Loader2 className='h-12 w-12 animate-spin text-purple-600 mx-auto mb-4' />
            <p className='text-muted-foreground'>Cargando datos del dashboard...</p>
          </div>
        </div>
      ) : (
        <div className='space-y-8'>
        {/* Welcome Section */}
        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-3xl' />
          <div className='relative flex items-start justify-between flex-wrap gap-4'>
            <div>
              <h1 className='text-4xl font-bold text-gradient'>
                Bienvenido, {session.user.name}
              </h1>
              <p className='text-muted-foreground mt-2 text-lg'>
                ¿Qué te gustaría hacer hoy?
              </p>
              {session.user.role !== 'ADMIN' && (
                <div className='flex items-center gap-2 mt-3'>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                    <Users className="h-3 w-3 mr-1" />
                    Mostrando solo tus movimientos
                  </Badge>
                </div>
              )}
              {session.user.role === 'ADMIN' && (
                <div className='flex items-center gap-2 mt-3'>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20">
                    <Users className="h-3 w-3 mr-1" />
                    Vista de administrador - Todos los movimientos
                  </Badge>
                </div>
              )}
            </div>
            <div className='glass px-6 py-4 rounded-2xl border border-purple-500/20 space-y-2'>
              <div className='flex items-center gap-2'>
                <EstadoIcon className={`h-5 w-5 ${estadoFinanciero.textColor}`} />
                <span className='text-sm font-medium text-muted-foreground'>Estado Financiero</span>
              </div>
              <div className='flex items-center gap-3'>
                <Badge className={`${estadoFinanciero.color} text-white border-0 px-4 py-1.5 text-base font-semibold shadow-lg`}>
                  {estadoFinanciero.label}
                </Badge>
                <Separator orientation='vertical' className='h-6' />
                <div className='text-sm'>
                  <div className='flex items-center gap-1.5'>
                    <PiggyBank className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                    <span className='font-semibold text-purple-600 dark:text-purple-400'>
                      {tasaAhorro.toFixed(1)}%
                    </span>
                    <span className='text-muted-foreground text-xs'>ahorro</span>
                  </div>
                </div>
              </div>
            </div>
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
                ${saldoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <Badge variant='outline' className='text-xs border-purple-500/30 text-purple-600 dark:text-purple-400'>
                  {isFinite(cambioSaldo) ? `${cambioSaldo > 0 ? '+' : ''}${cambioSaldo.toFixed(1)}%` : 'N/A'}
                </Badge>
                <p className='text-xs text-muted-foreground'>
                  vs mes pasado
                </p>
              </div>
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
                ${ingresosDelMes.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <Badge variant='outline' className='text-xs border-blue-500/30 text-blue-600 dark:text-blue-400'>
                  {isFinite(cambioIngresos) ? `${cambioIngresos > 0 ? '+' : ''}${cambioIngresos.toFixed(1)}%` : 'N/A'}
                </Badge>
                <p className='text-xs text-muted-foreground'>
                  vs mes pasado
                </p>
              </div>
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
                ${egresosDelMes.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <Badge variant='outline' className='text-xs border-pink-500/30 text-pink-600 dark:text-pink-400'>
                  {isFinite(cambioEgresos) ? `${cambioEgresos > 0 ? '+' : ''}${cambioEgresos.toFixed(1)}%` : 'N/A'}
                </Badge>
                <p className='text-xs text-muted-foreground'>
                  vs mes pasado
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Insights */}
        <Card className='glass border-purple-500/20'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Activity className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                <CardTitle>Resumen del Mes</CardTitle>
              </div>
              <Badge variant='outline' className='text-xs'>
                <Calendar className='h-3 w-3 mr-1' />
                {currentDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg'>
                    <Wallet className='h-4 w-4 text-white' />
                  </div>
                  <span className='text-sm font-medium text-muted-foreground'>Balance Neto</span>
                </div>
                <p className='text-2xl font-bold text-gradient'>
                  ${(ingresosDelMes - egresosDelMes).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Diferencia entre ingresos y egresos
                </p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg'>
                    <TrendingUp className='h-4 w-4 text-white' />
                  </div>
                  <span className='text-sm font-medium text-muted-foreground'>Ratio Ingreso/Egreso</span>
                </div>
                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  {(ingresosDelMes / egresosDelMes).toFixed(2)}x
                </p>
                <p className='text-xs text-muted-foreground'>
                  {ingresosDelMes / egresosDelMes >= 3 ? 'Muy saludable' : ingresosDelMes / egresosDelMes >= 2 ? 'Saludable' : 'Puede mejorar'}
                </p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg'>
                    <PiggyBank className='h-4 w-4 text-white' />
                  </div>
                  <span className='text-sm font-medium text-muted-foreground'>Capacidad de Ahorro</span>
                </div>
                <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                  {tasaAhorro.toFixed(1)}%
                </p>
                <p className='text-xs text-muted-foreground'>
                  {tasaAhorro >= 50 ? '¡Excelente!' : tasaAhorro >= 30 ? 'Muy bien' : tasaAhorro >= 20 ? 'Bien' : 'Puede mejorar'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation Cards */}
        <div className='grid gap-6 md:grid-cols-3'>
          <Link href='/movements' className='group'>
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
            <Link href='/users' className='group'>
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
            <Link href='/reports' className='group'>
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
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
