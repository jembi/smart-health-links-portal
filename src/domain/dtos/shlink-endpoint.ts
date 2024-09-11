/**
 * @swagger
 * components:
 *   schemas:
 *     CreateSHLinkEndpoint:
 *       type: object
 *       properties:
 *         shlinkId:
 *           type: string
 *           description: A string representing the share link's unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         managementToken:
 *           type: string
 *           description: A string representing the share link's management token.
 *           example: hWWNwskdGOnEdq0KIQ3S
 */
export class CreateSHLinkEndpointDto {
  shlinkId?: string;
  serverConfigId?: string;
  urlPath: string;
  managementToken?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SHLinkEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: A string representing the share link endpoint's unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         shlinkId:
 *           type: string
 *           description: A string representing the share link's unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         managementToken:
 *           type: string
 *           description: A string representing the share link's management token.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         serverConfigId:
 *           type: string
 *           description: A string representing the server config's unique identifier for the endpoint.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         urlPath:
 *           type: string
 *           description: An optional string representing the share link endpoint's query parameters.
 *           example: 
 */
export class SHLinkEndpointDto extends CreateSHLinkEndpointDto {
  id: string;
}
