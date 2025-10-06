import { calculatePagination, parseQueryParam } from '@/lib/api/helpers';

describe('API Helpers', () => {
  describe('calculatePagination', () => {
    it('debería calcular correctamente la primera página', () => {
      const result = calculatePagination(1, 10, 100);
      
      expect(result).toEqual({
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
      });
    });

    it('debería calcular correctamente una página intermedia', () => {
      const result = calculatePagination(5, 10, 100);
      
      expect(result).toEqual({
        page: 5,
        limit: 10,
        total: 100,
        totalPages: 10,
      });
    });

    it('debería calcular correctamente la última página', () => {
      const result = calculatePagination(10, 10, 100);
      
      expect(result).toEqual({
        page: 10,
        limit: 10,
        total: 100,
        totalPages: 10,
      });
    });

    it('debería manejar casos con páginas incompletas', () => {
      const result = calculatePagination(3, 25, 63); 
      
      expect(result).toEqual({
        page: 3,
        limit: 25,
        total: 63,
        totalPages: 3,
      });
    });

    it('debería manejar correctamente cuando no hay items', () => {
      const result = calculatePagination(1, 10, 0);
      
      expect(result).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it('debería calcular correctamente con un solo item', () => {
      const result = calculatePagination(1, 10, 1);
      
      expect(result).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('parseQueryParam', () => {
    it('debería retornar undefined para valores undefined', () => {
      expect(parseQueryParam(undefined)).toBeUndefined();
    });

    it('debería retornar el primer elemento de un array', () => {
      expect(parseQueryParam(['value1', 'value2'])).toBe('value1');
    });

    it('debería retornar el string tal cual', () => {
      expect(parseQueryParam('single-value')).toBe('single-value');
    });

    it('debería manejar arrays vacíos', () => {
      expect(parseQueryParam([])).toBeUndefined();
    });

    it('debería manejar números como strings', () => {
      expect(parseQueryParam('123')).toBe('123');
      expect(parseQueryParam(['456', '789'])).toBe('456');
    });

    it('debería manejar strings vacíos', () => {
      expect(parseQueryParam('')).toBe('');
      expect(parseQueryParam(['', 'other'])).toBe('');
    });
  });
});
