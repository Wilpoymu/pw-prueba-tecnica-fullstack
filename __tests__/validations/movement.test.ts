import { z } from 'zod';
import {
  createMovementSchema,
  updateMovementSchema,
  listMovementsQuerySchema,
  MovementTypeEnum,
} from '@/lib/validations/movement';

describe('Movement Validations', () => {
  describe('createMovementSchema', () => {
    it('debería validar un movimiento válido', () => {
      const validMovement = {
        concept: 'Salario mensual',
        amount: 5000,
        type: 'INCOME' as const,
        date: new Date().toISOString(),
      };

      const result = createMovementSchema.safeParse(validMovement);
      expect(result.success).toBe(true);
    });

    it('debería rechazar un concepto muy corto', () => {
      const invalidMovement = {
        concept: 'Ab', // Menos de 3 caracteres
        amount: 5000,
        type: 'INCOME' as const,
      };

      const result = createMovementSchema.safeParse(invalidMovement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('al menos 3 caracteres');
      }
    });

    it('debería rechazar un monto negativo', () => {
      const invalidMovement = {
        concept: 'Gasto negativo',
        amount: -100,
        type: 'EXPENSE' as const,
      };

      const result = createMovementSchema.safeParse(invalidMovement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mayor a 0');
      }
    });

    it('debería rechazar un tipo de movimiento inválido', () => {
      const invalidMovement = {
        concept: 'Movimiento extraño',
        amount: 100,
        type: 'INVALID_TYPE',
      };

      const result = createMovementSchema.safeParse(invalidMovement);
      expect(result.success).toBe(false);
    });
  });

  describe('updateMovementSchema', () => {
    it('debería permitir actualizaciones parciales', () => {
      const partialUpdate = {
        amount: 6000, // Solo actualizar el monto
      };

      const result = updateMovementSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('debería validar el concepto si se proporciona', () => {
      const updateWithShortConcept = {
        concept: 'AB', // Muy corto
      };

      const result = updateMovementSchema.safeParse(updateWithShortConcept);
      expect(result.success).toBe(false);
    });
  });

  describe('listMovementsQuerySchema', () => {
    it('debería aplicar valores por defecto', () => {
      const result = listMovementsQuerySchema.parse({});
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
      expect(result.sortBy).toBe('date');
      expect(result.sortOrder).toBe('desc');
    });

    it('debería convertir strings a números para page y limit', () => {
      const result = listMovementsQuerySchema.parse({
        page: '2',
        limit: '25',
      });
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(25);
    });

    it('debería limitar el máximo de resultados a 100', () => {
      const result = listMovementsQuerySchema.safeParse({
        limit: '500',
      });
      
      expect(result.success).toBe(false);
    });

    it('debería aceptar filtros opcionales', () => {
      const result = listMovementsQuerySchema.parse({
        type: 'INCOME',
        search: 'salario',
      });
      
      expect(result.type).toBe('INCOME');
      expect(result.search).toBe('salario');
    });
  });

  describe('MovementTypeEnum', () => {
    it('debería aceptar INCOME y EXPENSE', () => {
      expect(MovementTypeEnum.safeParse('INCOME').success).toBe(true);
      expect(MovementTypeEnum.safeParse('EXPENSE').success).toBe(true);
    });

    it('debería rechazar valores inválidos', () => {
      expect(MovementTypeEnum.safeParse('INVALID').success).toBe(false);
      expect(MovementTypeEnum.safeParse('income').success).toBe(false); // Case sensitive
    });
  });
});
