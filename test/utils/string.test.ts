
import {
  normalizeString,
  truncateString,
  extractNumber,
  extractLetter,
} from '../../src/utils/string';

describe('String Utils', () => {
  // Test para normalizeString
  describe('normalizeString', () => {
    test('should remove diacritical marks', () => {
      const input = 'Crème brûlée';
      const expected = 'Creme brulee';
      expect(normalizeString(input)).toBe(expected);
    });

    test('should trim whitespace', () => {
      const input = '  hello world  ';
      const expected = 'hello world';
      expect(normalizeString(input)).toBe(expected);
    });

    test('should handle empty strings', () => {
      const input = '';
      const expected = '';
      expect(normalizeString(input)).toBe(expected);
    });

    test('should handle strings without diacritics or extra whitespace', () => {
      const input = 'normal string';
      const expected = 'normal string';
      expect(normalizeString(input)).toBe(expected);
    });
  });

  // Test para truncateString
  describe('truncateString', () => {
    test('should truncate a string that is too long', () => {
      const input = 'This is a long string';
      const maxLength = 10;
      const expected = 'This is a ...';
      expect(truncateString(input, maxLength)).toBe(expected);
    });

    test('should not truncate a string that is within the length limit', () => {
      const input = 'Short';
      const maxLength = 10;
      expect(truncateString(input, maxLength)).toBe(input);
    });

    test('should handle a string that is exactly the max length', () => {
      const input = 'Ten chars.';
      const maxLength = 10;
      expect(truncateString(input, maxLength)).toBe(input);
    });
  });

  // Test para extractNumber
  describe('extractNumber', () => {
    test('should extract numbers from a string', () => {
      const input = 'abc123def45';
      const expected = '12345';
      expect(extractNumber(input)).toBe(expected);
    });

    test('should return an empty string if no numbers are present', () => {
      const input = 'abcdef';
      const expected = '';
      expect(extractNumber(input)).toBe(expected);
    });

    test('should convert a number input to a string', () => {
      const input = 12345;
      const expected = '12345';
      expect(extractNumber(input)).toBe(expected);
    });
  });

  // Test para extractLetter
  describe('extractLetter', () => {
    test('should extract letters from a string', () => {
      const input = '1a2b3c4d5e';
      const expected = 'abcde';
      expect(extractLetter(input)).toBe(expected);
    });

    test('should return an empty string if no letters are present', () => {
      const input = '123456';
      const expected = '';
      expect(extractLetter(input)).toBe(expected);
    });

    test('should handle strings with only letters', () => {
      const input = 'letters';
      const expected = 'letters';
      expect(extractLetter(input)).toBe(expected);
    });
  });
});
