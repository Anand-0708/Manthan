import fs from "fs";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const apiPath = path.resolve(
  process.cwd(),
  "src/modules/**/*.routes.ts"
);

console.log("Swagger scanning:", apiPath);
console.log("Exists:", fs.existsSync(apiPath));

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Manthan API",
      version: "1.0.0",
      description: "Conference Management System API",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/${env.API_VERSION}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  apis: [apiPath],
});