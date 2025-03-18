const swaggerJSDoc = require('swagger-jsdoc');

// Définissez les options pour Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API du Port de Plaisance de Russell',
            version: '1.0.0',
            description: 'Documentation de l\'API du projet'
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Serveur de développement'
            }
        ]
    },
    apis: ['../src/**/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
