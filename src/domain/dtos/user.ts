/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       properties:
 *         patientId:
 *           type: string
 *           description: The patient's unique identifier in the external system.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         userId:
 *           type: string
 *           description: The user's unique identifier in the SSO system.
 *           example: 5AMl62z2XDmgrh2XsI2O
 */
export class CreateUserDto {
  userId: string;
  patientId: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user unique identifier.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         patientId:
 *           type: string
 *           description: The patient's unique identifier in the external system.
 *           example: hWWNwskdGOnEdq0KIQ3S
 *         userId:
 *           type: string
 *           description: The user's unique identifier in the SSO system.
 *           example: 5AMl62z2XDmgrh2XsI2O
 */
export class UserDto extends CreateUserDto {
  id: string;
}
