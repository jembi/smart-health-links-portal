/**
 * @swagger
 * components:
 *   schemas:
 *     CreateSHLink:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: A string representing the share link's unique user identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         name:
 *           type: string
 *           description: A string representing the share link's name.
 *           example: Jane Doe's Shlink
 *         configPasscode:
 *           type: string
 *           description: An optional string representing the share link's password.
 *           example:
 *         configExp:
 *           type: datetime
 *           description: An optional date representing the date when the share link expires.
 *           example:
 */
export class CreateSHLinkDto {
  userId: string;
  name: string;
  configPasscode?: string;
  configExp?: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SHLinkFile:
 *       type: object
 *       properties:
 *         contentType:
 *           type: string
 *           description: A string representing the content type of share link file.
 *           example: application/smart-api-access
 *         embedded:
 *           type: string
 *           description: An optional string representing the content of a share link's file.
 *           example:
 *         location:
 *           type: string
 *           description: A string representing the share link's API link.
 *           example: https://example.com/api/v1/shlinks/shlink-id/endpoints/endpoint-id?ticket=unique-ticket
 */
export class SHLinkFileDto {
  contentType: string;
  embedded?: string;
  location: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SHLink:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: A string representing the share links unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         userId:
 *           type: string
 *           description: A string representing the share link's unique user identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         name:
 *           type: string
 *           description: A string representing the share link's name.
 *           example: Jane Doe's Shlink
 *         configPasscode:
 *           type: string
 *           description: An optional string representing the share link's password.
 *           example:
 *         configExp:
 *           type: datetime
 *           description: An optional date representing the date when the share link expires.
 *           example:
 *         passcodeFailureRemaining:
 *           type: number
 *           description: An integer representing how many passcode failure attempts are remaining for the share link.
 *           example: 5
 *         managementToken:
 *           type: string
 *           description: A string representing the share link's unique management token used for managing the share link.
 *           example: hWWNwskdGOnEdq0KIQ3S
 */
export class SHLinkDto extends CreateSHLinkDto {
  id: string;
  passcodeFailuresRemaining: number;
  active: boolean;
  managementToken: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SHLinkMini:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: A string representing the share links unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         name:
 *           type: string
 *           description: A string representing the share link's name.
 *           example: Jane Doe's Shlink
 *         managementToken:
 *           type: string
 *           description: A string representing the share link's unique management token used for managing the share link.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         url:
 *           type: string
 *           description: A string representing the share link's encoded url.
 *           example: 5AMl62z2XDmgrh2XsI2O
 *         active:
 *           type: boolean
 *           description: A boolean indicating whether the share link is active.
 *           example: true
 *         passwordRequired:
 *           type: boolean
 *           description: A boolean indicating whether the share link has a passcode or not.
 *           example: true
 *         expiryDate:
 *           type: datetime
 *           required: false
 *           description: An optional date representing when the share link expires.
 *           example: 2024-09-09T09:45:00.479+00:00
 *         files:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SHLinkFile'
 */
export class SHLinkMiniDto {
  id: string;
  managementToken: string;
  files?: SHLinkFileDto[];
  expiryDate?: Date;
  passwordRequired?: boolean;
  name: string;
  url: string;
  active: boolean;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SHLinkRequest:
 *       type: object
 *       properties:
 *         passcode:
 *           type: string
 *           description: A string representing the share link's unique passcode.
 *           example: null
 *         recipient:
 *           type: string
 *           description: A string representing the share link's recipient.
 *           example: Jane Doe
 */
export class SHLinkRequestDto {
  recipient: string;
  passcode?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SHLinkUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: A string representing the share links unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         passcode:
 *           type: string
 *           description: An optional string representing the share link's new passcode.
 *           example:
 *         managementToken:
 *           type: string
 *           description: A string representing the share link's unique management token used for managing the share link.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         oldPasscode:
 *           type: string
 *           description: An optional string representing the share link's old passcode.
 *           example:
 *         expiryDate:
 *           type: datetime
 *           required: false
 *           description: An optional date representing when the share link expires.
 *           example: 2024-09-09T09:45:00.479+00:00
 */
export class SHLinkUpdateDto {
  id: string;
  managementToken: string;
  oldPasscode: string;
  passcode?: string;
  expiryDate?: Date;
}
