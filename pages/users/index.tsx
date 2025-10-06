import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';
import { ProtectedContent } from '@/components/auth/ProtectedContent';
import { Permission } from '@/lib/rbac/permissions';

const UsersPage = () => {
  return (
    <ProtectedContent permission={Permission.VIEW_USERS}>
      <DashboardLayout>
        <div className='space-y-6'>
        <div className='flex items-center gap-4 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-2xl blur-3xl' />
          <div className='relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50'>
            <Users className='h-8 w-8 text-white' />
          </div>
          <div className='relative'>
            <h1 className='text-3xl font-bold text-gradient'>Gestión de Usuarios</h1>
            <p className='text-muted-foreground text-lg'>
              Administra usuarios y sus permisos
            </p>
          </div>
        </div>          <Card className='border-blue-200/50 dark:border-blue-900/50 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl' />
            <CardHeader className='relative'>
              <CardTitle className='text-2xl text-gradient'>Administración de usuarios</CardTitle>
            </CardHeader>
            <CardContent className='relative'>
              <p className='text-muted-foreground text-lg mb-6'>
                Esta sección estará disponible próximamente. Aquí podrás:
              </p>
              <ul className='mt-4 space-y-3 text-sm text-muted-foreground'>
                <li className='flex items-start gap-3'>
                  <span className='text-blue-600 dark:text-blue-400 font-bold text-lg'>✓</span>
                  <span>Ver la lista completa de todos los usuarios</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-blue-600 dark:text-blue-400 font-bold text-lg'>✓</span>
                  <span>Editar información y roles de usuarios</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-blue-600 dark:text-blue-400 font-bold text-lg'>✓</span>
                  <span>Cambiar roles entre Usuario y Administrador</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-blue-600 dark:text-blue-400 font-bold text-lg'>✓</span>
                  <span>Ver estadísticas de actividad de usuarios</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedContent>
  );
};

export default UsersPage;
