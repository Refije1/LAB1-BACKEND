const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your Node.js MSSQL backend',
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes directory
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
