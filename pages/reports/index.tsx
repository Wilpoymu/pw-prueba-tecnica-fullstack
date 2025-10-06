import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { ProtectedContent } from '@/components/auth/ProtectedContent';
import { Permission } from '@/lib/rbac/permissions';

const ReportsPage = () => {
  return (
    <ProtectedContent permission={Permission.VIEW_REPORTS}>
      <DashboardLayout>
        <div className='space-y-6'>
        <div className='flex items-center gap-4 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent rounded-2xl blur-3xl' />
          <div className='relative w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/50'>
            <BarChart3 className='h-8 w-8 text-white' />
          </div>
          <div className='relative'>
            <h1 className='text-3xl font-bold text-gradient'>Reportes</h1>
            <p className='text-muted-foreground text-lg'>
              Visualiza gráficos y descarga reportes
            </p>
          </div>
        </div>          <Card className='border-pink-200/50 dark:border-pink-900/50 bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-900 dark:to-pink-950/20 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl' />
            <CardHeader className='relative'>
              <CardTitle className='text-2xl text-gradient'>Sistema de reportes y visualización</CardTitle>
            </CardHeader>
            <CardContent className='relative'>
              <p className='text-muted-foreground text-lg mb-6'>
                Esta sección estará disponible próximamente. Aquí podrás:
              </p>
              <ul className='mt-4 space-y-3 text-sm text-muted-foreground'>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-600 dark:text-pink-400 font-bold text-lg'>✓</span>
                  <span>Ver gráficos de ingresos y egresos por mes</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-600 dark:text-pink-400 font-bold text-lg'>✓</span>
                  <span>Consultar el saldo actual y tendencias</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-600 dark:text-pink-400 font-bold text-lg'>✓</span>
                  <span>Exportar reportes en formato CSV</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-600 dark:text-pink-400 font-bold text-lg'>✓</span>
                  <span>Filtrar datos por período de tiempo</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedContent>
  );
};

export default ReportsPage;
