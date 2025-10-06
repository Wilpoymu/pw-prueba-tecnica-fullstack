import { listUsersQuerySchema, updateUserSchema } from '@/lib/validations/user';
import { ZodError } from 'zod';

describe('User Validation Schemas', () => {
  describe('listUsersQuerySchema', () => {
    it('should validate valid query parameters', () => {
      const validQuery = {
        page: 1,
        limit: 10,
        search: 'john',
        role: 'ADMIN',
        sortBy: 'name',
        sortOrder: 'asc',
      };

      const result = listUsersQuerySchema.parse(validQuery);

      expect(result).toEqual(validQuery);
    });

    it('should use default values when optional fields are missing', () => {
      const minimalQuery = {};

      const result = listUsersQuerySchema.parse(minimalQuery);

      expect(result).toEqual({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    });

    it('should accept valid role filter', () => {
      const query = { role: 'USER' };

      const result = listUsersQuerySchema.parse(query);

      expect(result.role).toBe('USER');
    });

    it('should reject invalid role', () => {
      const query = { role: 'INVALID_ROLE' };

      expect(() => listUsersQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should reject limit greater than 100', () => {
      const query = { limit: 150 };

      expect(() => listUsersQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should reject negative page number', () => {
      const query = { page: -1 };

      expect(() => listUsersQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should accept valid sortBy fields', () => {
      const validSortBy = ['name', 'email', 'createdAt', 'updatedAt'];

      validSortBy.forEach((field) => {
        const query = { sortBy: field };
        const result = listUsersQuerySchema.parse(query);
        expect(result.sortBy).toBe(field);
      });
    });

    it('should reject invalid sortBy field', () => {
      const query = { sortBy: 'invalidField' };

      expect(() => listUsersQuerySchema.parse(query)).toThrow(ZodError);
    });

    it('should accept valid sortOrder', () => {
      const ascQuery = { sortOrder: 'asc' };
      const descQuery = { sortOrder: 'desc' };

      expect(listUsersQuerySchema.parse(ascQuery).sortOrder).toBe('asc');
      expect(listUsersQuerySchema.parse(descQuery).sortOrder).toBe('desc');
    });

    it('should accept search string', () => {
      const query = { search: 'john doe' };

      const result = listUsersQuerySchema.parse(query);

      expect(result.search).toBe('john doe');
    });
  });

  describe('updateUserSchema', () => {
    it('should validate valid update data', () => {
      const validData = {
        name: 'John Doe',
        phone: '1234567890',
        role: 'ADMIN',
      };

      const result = updateUserSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    it('should accept updating only name', () => {
      const data = {
        name: 'Jane Doe',
      };

      const result = updateUserSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('should accept updating only phone', () => {
      const data = {
        phone: '9876543210',
      };

      const result = updateUserSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('should accept updating only role', () => {
      const data = {
        role: 'USER',
      };

      const result = updateUserSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('should reject empty update object', () => {
      const data = {};

      expect(() => updateUserSchema.parse(data)).toThrow(ZodError);
      expect(() => updateUserSchema.parse(data)).toThrow(
        'Debe proporcionar al menos un campo para actualizar'
      );
    });

    it('should reject empty name', () => {
      const data = {
        name: '',
      };

      expect(() => updateUserSchema.parse(data)).toThrow(ZodError);
    });

    it('should reject name that is too long', () => {
      const data = {
        name: 'a'.repeat(256),
      };

      expect(() => updateUserSchema.parse(data)).toThrow(ZodError);
    });

    it('should accept name with exactly 255 characters', () => {
      const data = {
        name: 'a'.repeat(255),
      };

      const result = updateUserSchema.parse(data);

      expect(result.name).toBe('a'.repeat(255));
    });

    it('should accept valid roles', () => {
      const adminData = { role: 'ADMIN' };
      const userData = { role: 'USER' };

      expect(updateUserSchema.parse(adminData).role).toBe('ADMIN');
      expect(updateUserSchema.parse(userData).role).toBe('USER');
    });

    it('should reject invalid role', () => {
      const data = {
        role: 'SUPERADMIN',
      };

      expect(() => updateUserSchema.parse(data)).toThrow(ZodError);
    });

    it('should reject empty phone', () => {
      const data = {
        phone: '',
      };

      expect(() => updateUserSchema.parse(data)).toThrow(ZodError);
    });

    it('should reject phone that is too long', () => {
      const data = {
        phone: '1'.repeat(21),
      };

      expect(() => updateUserSchema.parse(data)).toThrow(ZodError);
    });

    it('should accept phone at max length', () => {
      const data = {
        phone: '1'.repeat(20),
      };

      const result = updateUserSchema.parse(data);

      expect(result.phone).toBe('1'.repeat(20));
    });

    it('should accept both name and role together', () => {
      const data = {
        name: 'John Admin',
        role: 'ADMIN',
      };

      const result = updateUserSchema.parse(data);

      expect(result).toEqual(data);
    });

    it('should accept name, phone and role together', () => {
      const data = {
        name: 'John Admin',
        phone: '1234567890',
        role: 'ADMIN',
      };

      const result = updateUserSchema.parse(data);

      expect(result).toEqual(data);
    });
  });
});
