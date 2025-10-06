import { z } from 'zod';

/**
 * Schema para validar parámetros de consulta de reportes
 * Permite filtrar por rango de fechas y tipo de movimiento
 */
export const reportQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  groupBy: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
  }
);

/**
 * Schema para validar parámetros de exportación CSV
 */
export const csvExportQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  sortBy: z.enum(['date', 'amount', 'concept', 'type']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
  }
);

export type ReportQuery = z.infer<typeof reportQuerySchema>;
export type CsvExportQuery = z.infer<typeof csvExportQuerySchema>;
