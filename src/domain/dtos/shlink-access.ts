/**
 * @swagger
 * components:
 *   schemas:
 *     SHLinkAccessRequest:
 *       type: object
 *       properties:
 *         managementToken:
 *           type: string
 *           description: A string representing the share link's management token.
 *           example: hWWNwskdGOnEdq0KIQ3S
 */
export class SHLinkAccessRequestDto {
    managementToken: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SHLinkAccess:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: A string representing the share link access' unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         shlinkId:
 *           type: string
 *           description: A string representing the unique identifier of share link.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         recipient:
 *           type: string
 *           description: A string representing the name of the viewer of the share link.
 *           example: Jane Doe
 *         accessTime:
 *           type: datetime
 *           description: A date representing the timestamp when the share link is accessed.
 *           example: 2024-09-09T09:45:00.479+00:00
 */
export class SHLinkAccessDto {
    shlinkId: string;
    accessTime: Date;
    recipient: string;
    id?: string;
}