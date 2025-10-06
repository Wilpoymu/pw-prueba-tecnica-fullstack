'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  PiggyBank,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import { usePermissions } from '@/lib/rbac/usePermissions';
import { Permission } from '@/lib/rbac/permissions';
import { createChart, IChartApi, HistogramSeries } from 'lightweight-charts';
import { DatePicker } from '@/components/ui/date-picker';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

interface GroupedMovement {
  period: string;
  income: number;
  expense: number;
  balance: number;
  count: number;
}

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  movementsByPeriod: GroupedMovement[];
  totalMovements: number;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

// Helper function to get the date of Monday of a given ISO week
function getDateOfISOWeek(week: number, year: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

export default function ReportsPage() {
  const router = useRouter();
  const { can } = usePermissions();
  const canView = can(Permission.VIEW_REPORTS);
  const canExport = can(Permission.EXPORT_REPORTS);

  // Redirect si no tiene permisos
  useEffect(() => {
    if (!canView) {
      router.push('/dashboard');
    }
  }, [canView, router]);

  // Estado
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>(
    'month'
  );
  const [dateRange, setDateRange] = useState<
    '1m' | '3m' | '6m' | '1y' | 'custom'
  >('3m');
  const [startDate, setStartDate] = useState<Date>(
    subMonths(startOfMonth(new Date()), 2)
  );
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

  // Refs para los gráficos
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // Fetch data
  const fetchReportData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        groupBy,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/reports/summary?${params}`);
      const data = await response.json();

      if (data.success) {
        setSummaryData(data.data);
      } else {
        console.error('Error fetching report data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canView) {
      fetchReportData();
    }
  }, [groupBy, startDate, endDate, canView]);

  // Actualizar fechas cuando cambia el rango predefinido
  useEffect(() => {
    const now = new Date();
    switch (dateRange) {
      case '1m':
        setStartDate(subMonths(startOfMonth(now), 0));
        setEndDate(endOfMonth(now));
        break;
      case '3m':
        setStartDate(subMonths(startOfMonth(now), 2));
        setEndDate(endOfMonth(now));
        break;
      case '6m':
        setStartDate(subMonths(startOfMonth(now), 5));
        setEndDate(endOfMonth(now));
        break;
      case '1y':
        setStartDate(subMonths(startOfMonth(now), 11));
        setEndDate(endOfMonth(now));
        break;
    }
  }, [dateRange]);

  // Crear/actualizar gráfico de TradingView
  useEffect(() => {
    if (!summaryData || !chartContainerRef.current) return;

    // Limpiar gráfico anterior si existe
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (error) {
        // El gráfico ya fue eliminado, ignorar el error
      }
      chartRef.current = null;
    }

    // Crear nuevo gráfico
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(139, 92, 246, 0.1)' },
        horzLines: { color: 'rgba(139, 92, 246, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: 'rgba(139, 92, 246, 0.2)',
      },
      rightPriceScale: {
        borderColor: 'rgba(139, 92, 246, 0.2)',
      },
    });

    chartRef.current = chart;

    // Preparar datos para el gráfico de barras (ingresos y egresos)
    const incomeData: any[] = [];
    const expenseData: any[] = [];

    summaryData.movementsByPeriod.forEach((item) => {
      // Convertir el período a formato de fecha válido YYYY-MM-DD
      let timeValue: string;
      if (item.period.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Ya está en formato día: YYYY-MM-DD
        timeValue = item.period;
      } else if (item.period.match(/^\d{4}-\d{2}$/)) {
        // Formato mes: YYYY-MM -> usar primer día del mes
        timeValue = `${item.period}-01`;
      } else if (item.period.match(/^\d{4}-W\d{2}$/)) {
        // Formato semana: YYYY-WXX -> convertir a fecha del lunes de esa semana
        const [year, week] = item.period.split('-W');
        const date = getDateOfISOWeek(parseInt(week), parseInt(year));
        timeValue = date.toISOString().split('T')[0];
      } else if (item.period.match(/^\d{4}$/)) {
        // Formato año: YYYY -> usar 1 de enero
        timeValue = `${item.period}-01-01`;
      } else {
        // Fallback: usar primer día del mes
        timeValue = `${item.period}-01`;
      }

      // Agregar ingresos (verde, valores positivos)
      incomeData.push({
        time: timeValue,
        value: item.income,
        color: 'rgba(34, 197, 94, 0.8)', // green-500
      });

      // Agregar egresos (rojo, valores negativos para mostrar debajo del eje)
      expenseData.push({
        time: timeValue,
        value: -item.expense, // Negativo para mostrar abajo
        color: 'rgba(239, 68, 68, 0.8)', // red-500
      });
    });

    // Agregar serie de histograma para ingresos (barras verdes arriba)
    const incomeSeries = chart.addSeries(HistogramSeries, {
      color: 'rgba(34, 197, 94, 0.8)',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
      base: 0,
    });
    incomeSeries.setData(incomeData);

    // Agregar serie de histograma para egresos (barras rojas abajo)
    const expenseSeries = chart.addSeries(HistogramSeries, {
      color: 'rgba(239, 68, 68, 0.8)',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
      base: 0,
    });
    expenseSeries.setData(expenseData);

    // Ajustar el gráfico al contenido
    chart.timeScale().fitContent();

    // Configurar el ancho de las barras (más delgadas)
    chart.timeScale().applyOptions({
      barSpacing: 12, // Más espacio entre barras
      minBarSpacing: 8, // Espacio mínimo al hacer zoom
    });

    // Manejar resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          // El gráfico ya fue eliminado, ignorar el error
        }
        chartRef.current = null;
      }
    };
  }, [summaryData]);

  // Descargar CSV
  const handleDownloadCSV = async () => {
    if (!canExport) return;

    try {
      setDownloading(true);

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        sortBy: 'date',
        sortOrder: 'desc',
      });

      const response = await fetch(`/api/reports/csv?${params}`);

      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      // Crear un blob y descargar el archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `movimientos_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error al descargar el reporte. Por favor, intenta de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  // Calcular métricas adicionales
  const savingsRate = summaryData
    ? summaryData.totalIncome > 0
      ? ((summaryData.totalIncome - summaryData.totalExpense) /
          summaryData.totalIncome) *
        100
      : 0
    : 0;

  // Si no tiene permisos, no mostrar nada
  if (!canView) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
              Reportes Financieros
            </h1>
            <p className='text-muted-foreground mt-2'>
              Análisis y visualización de tus movimientos
            </p>
            <div className='flex items-center gap-2 mt-3'>
              <Badge
                variant='outline'
                className='bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
              >
                <BarChart3 className='h-3 w-3 mr-1' />
                Vista de administrador
              </Badge>
            </div>
          </div>

          {canExport && (
            <Button
              onClick={handleDownloadCSV}
              disabled={downloading || loading}
              className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/30'
            >
              {downloading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className='mr-2 h-4 w-4' />
                  Descargar CSV
                </>
              )}
            </Button>
          )}
        </div>

        {/* Filtros */}
        <Card className='border-purple-500/20 bg-card/50 backdrop-blur-xl'>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div className='flex flex-col gap-4 md:flex-row md:items-center'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm font-medium'>Rango:</span>
                  <Select
                    value={dateRange}
                    onValueChange={(value: any) => setDateRange(value)}
                  >
                    <SelectTrigger className='w-[150px] border-purple-500/20'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1m'>Último mes</SelectItem>
                      <SelectItem value='3m'>Últimos 3 meses</SelectItem>
                      <SelectItem value='6m'>Últimos 6 meses</SelectItem>
                      <SelectItem value='1y'>Último año</SelectItem>
                      <SelectItem value='custom'>Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === 'custom' && (
                  <div className='flex items-center gap-2'>
                    <DatePicker
                      date={startDate}
                      onDateChange={(date) => date && setStartDate(date)}
                      placeholder='Fecha inicio'
                    />
                    <span className='text-muted-foreground'>-</span>
                    <DatePicker
                      date={endDate}
                      onDateChange={(date) => date && setEndDate(date)}
                      placeholder='Fecha fin'
                    />
                  </div>
                )}

                <div className='flex items-center gap-2'>
                  <Activity className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm font-medium'>Agrupar por:</span>
                  <Select
                    value={groupBy}
                    onValueChange={(value: any) => setGroupBy(value)}
                  >
                    <SelectTrigger className='w-[130px] border-purple-500/20'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='day'>Día</SelectItem>
                      <SelectItem value='week'>Semana</SelectItem>
                      <SelectItem value='month'>Mes</SelectItem>
                      <SelectItem value='year'>Año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className='flex items-center justify-center py-16'>
            <div className='text-center'>
              <Loader2 className='h-12 w-12 animate-spin text-purple-600 mx-auto mb-4' />
              <p className='text-muted-foreground'>
                Cargando datos del reporte...
              </p>
            </div>
          </div>
        ) : summaryData ? (
          <>
            {/* Métricas Cards */}
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
              {/* Saldo Total */}
              <Card className='border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Saldo Total
                  </CardTitle>
                  <DollarSign className='h-4 w-4 text-purple-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    $
                    {summaryData.currentBalance.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Balance acumulado
                  </p>
                </CardContent>
              </Card>

              {/* Ingresos */}
              <Card className='border-purple-500/20 bg-card/50 backdrop-blur-xl'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Ingresos del Período
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-green-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-green-600'>
                    $
                    {summaryData.totalIncome.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {summaryData.totalMovements} movimientos totales
                  </p>
                </CardContent>
              </Card>

              {/* Egresos */}
              <Card className='border-purple-500/20 bg-card/50 backdrop-blur-xl'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Egresos del Período
                  </CardTitle>
                  <TrendingDown className='h-4 w-4 text-red-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-red-600'>
                    $
                    {summaryData.totalExpense.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    En el rango seleccionado
                  </p>
                </CardContent>
              </Card>

              {/* Tasa de Ahorro */}
              <Card className='border-purple-500/20 bg-card/50 backdrop-blur-xl'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Tasa de Ahorro
                  </CardTitle>
                  <PiggyBank className='h-4 w-4 text-blue-600' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-blue-600'>
                    {savingsRate.toFixed(1)}%
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    De tus ingresos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico Principal */}
            <Card className='border-purple-500/20 bg-card/50 backdrop-blur-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5 text-purple-600' />
                  Balance Acumulado
                </CardTitle>
                <CardDescription>
                  Evolución de tu saldo total a lo largo del tiempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={chartContainerRef} className='w-full' />
              </CardContent>
            </Card>

            {/* Tabla de Resumen por Período */}
            <Card className='border-purple-500/20 bg-card/50 backdrop-blur-xl'>
              <CardHeader>
                <CardTitle>Resumen por Período</CardTitle>
                <CardDescription>
                  Desglose detallado de ingresos y egresos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {summaryData.movementsByPeriod.map((period, index) => (
                    <div
                      key={period.period}
                      className='flex items-center justify-between p-4 rounded-lg border border-purple-500/10 hover:bg-purple-500/5 transition-colors'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='w-2 h-12 rounded-full bg-gradient-to-b from-purple-600 to-blue-600' />
                        <div>
                          <p className='font-medium'>{period.period}</p>
                          <p className='text-sm text-muted-foreground'>
                            {period.count} movimientos
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-6'>
                        <div className='text-right'>
                          <p className='text-sm text-muted-foreground'>
                            Ingresos
                          </p>
                          <p className='font-semibold text-green-600'>
                            $
                            {period.income.toLocaleString('es-MX', {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm text-muted-foreground'>
                            Egresos
                          </p>
                          <p className='font-semibold text-red-600'>
                            $
                            {period.expense.toLocaleString('es-MX', {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className='text-right min-w-[120px]'>
                          <p className='text-sm text-muted-foreground'>
                            Balance
                          </p>
                          <div className='flex items-center justify-end gap-1'>
                            {period.balance >= 0 ? (
                              <ArrowUpRight className='h-4 w-4 text-green-600' />
                            ) : (
                              <ArrowDownRight className='h-4 w-4 text-red-600' />
                            )}
                            <p
                              className={`font-bold ${period.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                              $
                              {Math.abs(period.balance).toLocaleString(
                                'es-MX',
                                { minimumFractionDigits: 2 }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <BarChart3 className='h-16 w-16 text-purple-600 mb-4' />
            <h3 className='text-lg font-semibold mb-2'>
              No hay datos disponibles
            </h3>
            <p className='text-muted-foreground'>
              No se encontraron movimientos en el rango de fechas seleccionado
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
