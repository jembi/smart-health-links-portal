import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: './src/app/api/v1', // define api folder under app folder
    outputFile: '/swagger.json',
    schemaFolders: ['./src/domain/dtos'],
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Share Link API',
        version: '1.0',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
