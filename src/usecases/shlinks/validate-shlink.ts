import { SHLinkModel } from '@/domain/models/shlink';

export class SHLinkValidationError extends Error {
  constructor(
    message: string,
    public code: number = 403,
  ) {
    super(message);
    this.name = 'SHLinkValidationError';
  }
}

export const validateSHLinkUseCase = (data: {
  shlink: SHLinkModel;
  passcode?: string;
}): boolean => {
  if (
    !data.shlink.getActive() ||
    (data.shlink.getConfigExp() && data.shlink.getConfigExp() < new Date())
  ) {
    throw new SHLinkValidationError('Inactive share link access', 410);
  }

  if (data.shlink.getPasscodeFailuresRemaining() < 1) {
    throw new SHLinkValidationError('Locked resource');
  }

  if (
    data.shlink.getConfigPasscode() &&
    data.shlink.getConfigPasscode() !== data.passcode
  ) {
    return false;
  }

  return true;
};
