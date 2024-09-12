/**
 * @swagger
 * components:
 *   schemas:
 *     SHLinkQRCodeRequest:
 *       type: object
 *       properties:
 *         managementToken:
 *           type: string
 *           description: A string representing the share link's management token.
 *           example: hWWNwskdGOnEdq0KIQ3S
 */

export class SHLinkQRCodeRequestDto {
    managementToken: string;
}