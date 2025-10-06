import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import {
  sendError,
  requirePermission,
  methodNotAllowed,
  parseQueryParam,
} from '@/lib/api/helpers';
import { csvExportQuerySchema, CsvExportQuery } from '@/lib/validations/report';
import { Permission } from '@/lib/rbac/permissions';
import prisma from '@/lib/prisma';

interface MovementForCsv {
  id: string;
  concept: string;
  amount: any;
  type: string;
  date: Date;
  userName: string;
  userEmail: string;
  createdAt: Date;
}

/**
 * GET /api/reports/csv - Export movements to CSV
 * Returns CSV file with filtered movements
 * Admin only
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    // Require EXPORT_REPORTS permission (admin only)
    const session = await requirePermission(req, res, Permission.EXPORT_REPORTS);
    if (!session) return;

    // Parse and validate query parameters
    const queryParams = {
      startDate: parseQueryParam(req.query.startDate),
      endDate: parseQueryParam(req.query.endDate),
      type: parseQueryParam(req.query.type),
      sortBy: parseQueryParam(req.query.sortBy),
      sortOrder: parseQueryParam(req.query.sortOrder),
    };

    const validatedQuery: CsvExportQuery = csvExportQuerySchema.parse(queryParams);

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deletedAt: null,
    };

    // Filter by date range
    if (validatedQuery.startDate || validatedQuery.endDate) {
      where.date = {};
      if (validatedQuery.startDate) {
        where.date.gte = new Date(validatedQuery.startDate);
      }
      if (validatedQuery.endDate) {
        where.date.lte = new Date(validatedQuery.endDate);
      }
    }

    // Filter by type
    if (validatedQuery.type) {
      where.type = validatedQuery.type;
    }

    // Build order by
    const orderBy: any = {};
    orderBy[validatedQuery.sortBy || 'date'] = validatedQuery.sortOrder || 'desc';

    // Get movements with user information
    const movements: MovementForCsv[] = await prisma.movement.findMany({
      where,
      select: {
        id: true,
        concept: true,
        amount: true,
        type: true,
        date: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy,
    }) as any;

    // Generate CSV content
    const csv = generateCsv(movements);

    // Set headers for file download
    const filename = `movimientos_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Add BOM for Excel UTF-8 support
    res.write('\uFEFF');
    res.write(csv);
    res.end();
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        res,
        'Parámetros de consulta inválidos',
        'VALIDATION_ERROR',
        400,
        error.issues
      );
    }

    console.error('Error generating CSV report:', error);
    return sendError(
      res,
      'Error al generar el reporte CSV',
      'INTERNAL_ERROR',
      500
    );
  }
}

/**
 * Generate CSV content from movements
 */
function generateCsv(movements: MovementForCsv[]): string {
  // CSV headers
  const headers = [
    'ID',
    'Fecha',
    'Concepto',
    'Tipo',
    'Monto',
    'Usuario',
    'Email',
    'Fecha de Creación',
  ];

  // Convert headers to CSV row
  const csvHeaders = headers.map(escapeCSV).join(',');

  // Convert movements to CSV rows
  const csvRows = movements.map((movement) => {
    const row = [
      movement.id,
      formatDate(movement.date),
      movement.concept,
      movement.type === 'INCOME' ? 'Ingreso' : 'Egreso',
      Number(movement.amount).toFixed(2),
      movement.userName,
      movement.userEmail,
      formatDateTime(movement.createdAt),
    ];

    return row.map(escapeCSV).join(',');
  });

  // Combine headers and rows
  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCSV(field: string | number): string {
  if (field === null || field === undefined) {
    return '';
  }

  const stringField = String(field);

  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }

  return stringField;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format datetime as YYYY-MM-DD HH:MM:SS
 */
function formatDateTime(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
