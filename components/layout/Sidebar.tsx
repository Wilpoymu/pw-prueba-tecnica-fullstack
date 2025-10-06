import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProtectedContent } from '@/components/auth/ProtectedContent';
import { Permission } from '@/lib/rbac/permissions';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Sparkles,
    permission: Permission.VIEW_DASHBOARD,
    description: 'Visión general de la aplicación',
  },
  {
    title: 'Movimientos',
    href: '/movements',
    icon: TrendingUp,
    permission: Permission.VIEW_MOVEMENTS,
    description: 'Gestión de ingresos y gastos',
  },
  {
    title: 'Usuarios',
    href: '/users',
    icon: Users,
    permission: Permission.VIEW_USERS,
    description: 'Administración de usuarios',
  },
  {
    title: 'Reportes',
    href: '/reports',
    icon: BarChart3,
    permission: Permission.VIEW_REPORTS,
    description: 'Visualización y exportación',
  },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavContent = () => (
    <nav className='space-y-2'>
      {navItems.map((item) => {
        const isActive = router.pathname.startsWith(item.href);
        const Icon = item.icon;

        const navLink = (
          <Link
            href={item.href}
            className={cn(
              'group flex items-start gap-3 px-4 py-3.5 rounded-xl transition-all duration-300',
              isActive
                ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-blue-500/10 hover:scale-[1.02]'
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon
              className={cn(
                'h-5 w-5 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110',
                isActive
                  ? 'text-white'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-purple-500'
              )}
            />
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>{item.title}</span>
              <span className={cn(
                'text-xs transition-colors',
                isActive ? 'text-purple-100' : 'text-muted-foreground'
              )}>
                {item.description}
              </span>
            </div>
          </Link>
        );

        if (item.permission) {
          return (
            <ProtectedContent key={item.href} permission={item.permission}>
              {navLink}
            </ProtectedContent>
          );
        }

        return <div key={item.href}>{navLink}</div>;
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className='lg:hidden fixed top-4 left-4 z-50'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='bg-white dark:bg-gray-800'
        >
          {isMobileMenuOpen ? (
            <X className='h-5 w-5' />
          ) : (
            <Menu className='h-5 w-5' />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-purple-200/50 dark:border-purple-900/50 transform transition-transform duration-200 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className='flex flex-col h-full relative'>
          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none' />
          
          {/* Logo */}
          <div className='relative p-6 border-b border-purple-200/50 dark:border-purple-900/50'>
            <Link
              href='/dashboard'
              className='flex items-center gap-3 group'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity' />
                <div className='relative w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center'>
                  <Sparkles className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='flex flex-col'>
                <span className='text-xl font-bold text-gradient'>
                  Flowly
                </span>
                <span className='text-xs text-purple-600 dark:text-purple-400'>
                  Sistema de Gestión
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className='relative flex-1 p-4 overflow-y-auto'>
            <div className='mb-4'>
              <h2 className='px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Menú Principal
              </h2>
            </div>
            <NavContent />
          </div>

          {/* Footer */}
          <div className='relative p-4 border-t border-purple-200/50 dark:border-purple-900/50'>
            <div className='px-4 py-2 text-xs text-muted-foreground'>
              <p className='font-medium text-purple-600 dark:text-purple-400'>
                &copy; 2025 Flowly
              </p>
              <p className='mt-1'>Sistema de Gestión Financiera</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
