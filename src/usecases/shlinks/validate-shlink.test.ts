import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkValidationError, validateSHLinkUseCase } from "./validate-shlink";

describe('validateSHLinkUseCase', () => {
  it('should return true for a valid active SHLink with matching passcode', () => {
    const validSHLink = new SHLinkModel(
      'unique-user-id',
      5,
      true,
      'management-token',
      'valid-passcode',
      new Date(Date.now() + 10000), // future date
      'link-id'
    );
    const result = validateSHLinkUseCase({ shlink: validSHLink, passcode: 'valid-passcode' });
    expect(result).toBe(true);
  });

  it('should throw SHLinkValidationError if the SHLink is inactive', () => {
    const invalidSHLink = new SHLinkModel(
      'unique-user-id',
      5,
      false,
      'management-token',
      'valid-passcode',
      new Date(Date.now() + 10000), // future date
      'link-id'
    );
    expect(() => validateSHLinkUseCase({ shlink: invalidSHLink, passcode: 'valid-passcode' }))
      .toThrow(SHLinkValidationError);
  });

  it('should throw SHLinkValidationError if the SHLink is expired', () => {
    const expiredSHLink = new SHLinkModel(
      'unique-user-id',
      5,
      true,
      'management-token',
      'valid-passcode',
      new Date(Date.now() - 10000), // past date
      'link-id'
    );
    expect(() => validateSHLinkUseCase({ shlink: expiredSHLink, passcode: 'valid-passcode' }))
      .toThrow(SHLinkValidationError);
  });

  it('should return false if the passcode does not match', () => {
    const validSHLink = new SHLinkModel(
      'unique-user-id',
      5,
      true,
      'management-token',
      'correct-passcode',
      new Date(Date.now() + 10000), // future date
      'link-id'
    );
    const result = validateSHLinkUseCase({ shlink: validSHLink, passcode: 'wrong-passcode' });
    expect(result).toBe(false);
  });

  it('should return true if no passcode is required and the SHLink is valid', () => {
    const validSHLink = new SHLinkModel(
      'unique-user-id',
      5,
      true,
      'management-token',
      undefined,
      new Date(Date.now() + 10000), // future date
      'link-id'
    );
    const result = validateSHLinkUseCase({ shlink: validSHLink });
    expect(result).toBe(true);
  });

  it('should throw SHLinkValidationError with correct message and code', () => {
    try {
      const invalidSHLink = new SHLinkModel(
        'unique-user-id',
        5,
        true,
        'management-token',
        'passcode',
        new Date(Date.now() - 10000), // past date
        'link-id'
      );
      validateSHLinkUseCase({ shlink: invalidSHLink, passcode: 'wrong-passcode' });
    } catch (error) {
      expect(error).toBeInstanceOf(SHLinkValidationError);
      expect(error.message).toBe('Inactive share link access');
      expect(error.code).toBe(403);
    }
  });
});
