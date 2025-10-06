import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import {
  sendSuccess,
  sendError,
  requirePermission,
  methodNotAllowed,
  parseQueryParam,
  ApiResponse,
} from '@/lib/api/helpers';
import { reportQuerySchema, ReportQuery } from '@/lib/validations/report';
import { Permission } from '@/lib/rbac/permissions';
import prisma from '@/lib/prisma';

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

/**
 * GET /api/reports/summary - Get financial summary report
 * Returns aggregated data for charts and statistics
 * Admin only
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const session = await requirePermission(req, res, Permission.VIEW_REPORTS);
    if (!session) return;

    const queryParams = {
      startDate: parseQueryParam(req.query.startDate),
      endDate: parseQueryParam(req.query.endDate),
      type: parseQueryParam(req.query.type),
      groupBy: parseQueryParam(req.query.groupBy),
    };

    const validatedQuery: ReportQuery = reportQuerySchema.parse(queryParams);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deletedAt: null,
    };

    if (validatedQuery.startDate || validatedQuery.endDate) {
      where.date = {};
      if (validatedQuery.startDate) {
        where.date.gte = new Date(validatedQuery.startDate);
      }
      if (validatedQuery.endDate) {
        where.date.lte = new Date(validatedQuery.endDate);
      }
    }

    if (validatedQuery.type) {
      where.type = validatedQuery.type;
    }

    const movements = await prisma.movement.findMany({
      where,
      select: {
        id: true,
        amount: true,
        type: true,
        date: true,
        concept: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const totalIncome = movements
      .filter((m) => m.type === 'INCOME')
      .reduce((sum, m) => sum + Number(m.amount), 0);

    const totalExpense = movements
      .filter((m) => m.type === 'EXPENSE')
      .reduce((sum, m) => sum + Number(m.amount), 0);

    const currentBalance = totalIncome - totalExpense;

    const groupedData = groupMovementsByPeriod(
      movements,
      validatedQuery.groupBy || 'month'
    );

    const summaryData: SummaryData = {
      totalIncome,
      totalExpense,
      currentBalance,
      movementsByPeriod: groupedData,
      totalMovements: movements.length,
      dateRange: {
        start: validatedQuery.startDate || null,
        end: validatedQuery.endDate || null,
      },
    };

    return sendSuccess(res, summaryData);
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

    console.error('Error generating summary report:', error);
    return sendError(
      res,
      'Error al generar el reporte',
      'INTERNAL_ERROR',
      500
    );
  }
}

/**
 * Group movements by time period
 */
function groupMovementsByPeriod(
  movements: Array<{
    id: string;
    amount: any;
    type: string;
    date: Date;
    concept: string;
  }>,
  groupBy: 'day' | 'week' | 'month' | 'year'
): GroupedMovement[] {
  const groups = new Map<string, GroupedMovement>();

  movements.forEach((movement) => {
    const period = getPeriodKey(new Date(movement.date), groupBy);
    
    if (!groups.has(period)) {
      groups.set(period, {
        period,
        income: 0,
        expense: 0,
        balance: 0,
        count: 0,
      });
    }

    const group = groups.get(period)!;
    const amount = Number(movement.amount);

    if (movement.type === 'INCOME') {
      group.income += amount;
    } else {
      group.expense += amount;
    }

    group.balance = group.income - group.expense;
    group.count += 1;
  });

  return Array.from(groups.values()).sort((a, b) => 
    a.period.localeCompare(b.period)
  );
}

/**
 * Get period key based on grouping type
 */
function getPeriodKey(date: Date, groupBy: 'day' | 'week' | 'month' | 'year'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (groupBy) {
    case 'day':
      return `${year}-${month}-${day}`;
    
    case 'week':
      const weekNumber = getWeekNumber(date);
      return `${year}-W${String(weekNumber).padStart(2, '0')}`;
    
    case 'month':
      return `${year}-${month}`;
    
    case 'year':
      return `${year}`;
    
    default:
      return `${year}-${month}`;
  }
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
