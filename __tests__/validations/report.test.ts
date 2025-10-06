import { ZodError } from 'zod';
import {
  reportQuerySchema,
  csvExportQuerySchema,
} from '@/lib/validations/report';

describe('Report Validations', () => {
  describe('reportQuerySchema', () => {
    it('should validate query with all valid parameters', () => {
      const query = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-12-31T23:59:59.999Z',
        type: 'INCOME',
        groupBy: 'month',
      };

      const result = reportQuerySchema.parse(query);

      expect(result).toEqual(query);
    });

    it('should accept query without optional parameters', () => {
      const query = {};

      const result = reportQuerySchema.parse(query);

      expect(result.groupBy).toBe('month');
    });

    it('should accept only startDate', () => {
      const query = {
        startDate: '2025-01-01T00:00:00.000Z',
      };

      const result = reportQuerySchema.parse(query);

      expect(result.startDate).toBe(query.startDate);
    });

    it('should accept only endDate', () => {
      const query = {
        endDate: '2025-12-31T23:59:59.999Z',
      };

      const result = reportQuerySchema.parse(query);

      expect(result.endDate).toBe(query.endDate);
    });

    it('should accept valid type values', () => {
      const incomeQuery = { type: 'INCOME' };
      const expenseQuery = { type: 'EXPENSE' };

      expect(reportQuerySchema.parse(incomeQuery).type).toBe('INCOME');
      expect(reportQuerySchema.parse(expenseQuery).type).toBe('EXPENSE');
    });

    it('should reject invalid type', () => {
      const query = {
        type: 'INVALID',
      };

      expect(() => reportQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should accept valid groupBy values', () => {
      const validGroupBys = ['day', 'week', 'month', 'year'];

      validGroupBys.forEach((groupBy) => {
        const result = reportQuerySchema.parse({ groupBy });
        expect(result.groupBy).toBe(groupBy);
      });
    });

    it('should reject invalid groupBy', () => {
      const query = {
        groupBy: 'invalid',
      };

      expect(() => reportQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should reject when startDate is after endDate', () => {
      const query = {
        startDate: '2025-12-31T23:59:59.999Z',
        endDate: '2025-01-01T00:00:00.000Z',
      };

      expect(() => reportQuerySchema.parse(query)).toThrow(ZodError);
      expect(() => reportQuerySchema.parse(query)).toThrow(
        'La fecha de inicio debe ser anterior o igual a la fecha de fin'
      );
    });

    it('should accept when startDate equals endDate', () => {
      const query = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-01T00:00:00.000Z',
      };

      const result = reportQuerySchema.parse(query);

      expect(result.startDate).toBe(query.startDate);
      expect(result.endDate).toBe(query.endDate);
    });

    it('should reject invalid datetime format', () => {
      const query = {
        startDate: 'invalid-date',
      };

      expect(() => reportQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should use default groupBy when not provided', () => {
      const query = {};

      const result = reportQuerySchema.parse(query);

      expect(result.groupBy).toBe('month');
    });
  });

  describe('csvExportQuerySchema', () => {
    it('should validate query with all valid parameters', () => {
      const query = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-12-31T23:59:59.999Z',
        type: 'EXPENSE',
        sortBy: 'amount',
        sortOrder: 'asc',
      };

      const result = csvExportQuerySchema.parse(query);

      expect(result).toEqual(query);
    });

    it('should accept query without optional parameters', () => {
      const query = {};

      const result = csvExportQuerySchema.parse(query);

      expect(result.sortBy).toBe('date');
      expect(result.sortOrder).toBe('desc');
    });

    it('should accept valid sortBy values', () => {
      const validSortBys = ['date', 'amount', 'concept', 'type'];

      validSortBys.forEach((sortBy) => {
        const result = csvExportQuerySchema.parse({ sortBy });
        expect(result.sortBy).toBe(sortBy);
      });
    });

    it('should reject invalid sortBy', () => {
      const query = {
        sortBy: 'invalid',
      };

      expect(() => csvExportQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should accept valid sortOrder values', () => {
      const ascQuery = { sortOrder: 'asc' };
      const descQuery = { sortOrder: 'desc' };

      expect(csvExportQuerySchema.parse(ascQuery).sortOrder).toBe('asc');
      expect(csvExportQuerySchema.parse(descQuery).sortOrder).toBe('desc');
    });

    it('should reject invalid sortOrder', () => {
      const query = {
        sortOrder: 'invalid',
      };

      expect(() => csvExportQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should reject when startDate is after endDate', () => {
      const query = {
        startDate: '2025-12-31T23:59:59.999Z',
        endDate: '2025-01-01T00:00:00.000Z',
      };

      expect(() => csvExportQuerySchema.parse(query)).toThrow(ZodError);
      expect(() => csvExportQuerySchema.parse(query)).toThrow(
        'La fecha de inicio debe ser anterior o igual a la fecha de fin'
      );
    });

    it('should accept type filter', () => {
      const incomeQuery = { type: 'INCOME' };
      const expenseQuery = { type: 'EXPENSE' };

      expect(csvExportQuerySchema.parse(incomeQuery).type).toBe('INCOME');
      expect(csvExportQuerySchema.parse(expenseQuery).type).toBe('EXPENSE');
    });

    it('should use default values', () => {
      const query = {};

      const result = csvExportQuerySchema.parse(query);

      expect(result.sortBy).toBe('date');
      expect(result.sortOrder).toBe('desc');
    });

    it('should accept partial date range', () => {
      const startOnly = {
        startDate: '2025-01-01T00:00:00.000Z',
      };
      const endOnly = {
        endDate: '2025-12-31T23:59:59.999Z',
      };

      expect(csvExportQuerySchema.parse(startOnly).startDate).toBe(
        startOnly.startDate
      );
      expect(csvExportQuerySchema.parse(endOnly).endDate).toBe(endOnly.endDate);
    });
  });
});
