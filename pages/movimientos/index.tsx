import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const Movimientos = () => {
  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div className='flex items-center gap-4 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl blur-3xl' />
          <div className='relative w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50'>
            <TrendingUp className='h-8 w-8 text-white' />
          </div>
          <div className='relative'>
            <h1 className='text-3xl font-bold text-gradient'>Gestión de Movimientos</h1>
            <p className='text-muted-foreground text-lg'>
              Administra tus ingresos y egresos
            </p>
          </div>
        </div>

        <Card className='border-purple-200/50 dark:border-purple-900/50 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl' />
          <CardHeader className='relative'>
            <CardTitle className='text-2xl text-gradient'>Sistema de gestión de ingresos y gastos</CardTitle>
          </CardHeader>
          <CardContent className='relative'>
            <p className='text-muted-foreground text-lg mb-6'>
              Esta sección estará disponible próximamente. Aquí podrás:
            </p>
            <ul className='mt-4 space-y-3 text-sm text-muted-foreground'>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold text-lg'>✓</span>
                <span>Ver la lista completa de todos los movimientos</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold text-lg'>✓</span>
                <span>
                  Agregar nuevos ingresos y egresos (solo administradores)
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold text-lg'>✓</span>
                <span>Filtrar movimientos por fecha y tipo</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold text-lg'>✓</span>
                <span>Ver detalles completos de cada movimiento</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Movimientos;
