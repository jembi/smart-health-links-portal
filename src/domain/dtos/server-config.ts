/**
 * @swagger
 * components:
 *   schemas:
 *     CreateServerConfig:
 *       type: object
 *       properties:
 *         endpointUrl:
 *           type: string
 *           description: A string representing the external endpoint to retrieve data from.
 *           example: https://example.com
 *         clientId:
 *           type: string
 *           required: false
 *           description: A string representing a client's unique identifier for the external endpoint.
 *           example:
 *         clientSecret:
 *           type: string
 *           description: A string representing a client's secret for the external endpoint.
 *           example:
 *           required: false
 *         tokenEndpoint:
 *           type: string
 *           required: false
 *           description: An optional string representing the external endpoint to get a session token.
 *           example: https://example.com
 */
export class CreateServerConfigDto {
  tokenEndpoint?: string;
  endpointUrl: string;
  clientSecret?: string;
  clientId?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ServerConfig:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         endpointUrl:
 *           type: string
 *           description: A string representing the external endpoint to retrieve data from.
 *           example: https://example.com
 *         clientId:
 *           type: string
 *           description: A string representing a client's unique identifier for the external endpoint.
 *           example: 5AMl62z2XDmgrh2XsI2O
 *         clientSecret:
 *           type: string
 *           description: A string representing a client's secret for the external endpoint.
 *           example: 5AMl62z2XDmgrh2XsI2O
 *         tokenEndpoint:
 *           type: string
 *           description: An optional string representing the external endpoint to get a session token.
 *           example: https://example.com
 *         createdAt:
 *            type: datetime
 *            description: A date representing the date the share link endpoint was created.
 *            example: 2024-09-26T10:03:39.379Z
 *         updatedAt:
 *            type:datetime
 *            description: A date representing the date the share link endpoint was updated.
 *            example: 2024-09-26T10:03:39.379Z
 */
export class ServerConfigDto extends CreateServerConfigDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  accessTokenResponse?: string;
  refreshToken?: string;
  refreshTime?: Date;
  configKey?: string;
}
