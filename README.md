# Smart Health Links Portal

The Smart Health Links Portal is an innovative platform designed to empower patients by enabling them to securely share their medical records with relevant entities such as schools, hospitals, or government agencies through secure links.

## Project Overview

This project leverages the power of [Next.js](https://nextjs.org/), a React framework that allows us to seamlessly integrate client-side and server-side functionality. By utilizing Next.js, we are able to provide a high-performance, secure environment for managing and sharing sensitive health information.

### Key Features

- **Link Sharing:** Functionality to generate and manage links or qr code that allow patients to share their medical records securely with authorized entities.

## Documentation

For detailed API documentation and usage examples, please visit our [Postman Documentation](https://documenter.getpostman.com/view/9479419/2sAXjKaXx2).

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/smart-health-links-portal.git
   ```
2. Install dependencies:
   ```bash
   cd smart-health-links-portal
   yarn install
   ```
3. Run the development server:
   ```bash
   yarn run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` to view the portal.

## Generating swagger docs

To generate the swagger.json file for this application, run the following command.

```bash
yarn next-swagger-doc-cli next-swagger-doc.json
```

Once generated, you can view the API Swagger documentation by navigating to `/api/docs` in your browser.
