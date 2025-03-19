const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API du Port de Plaisance de Russell',
            version: '1.0.0',
            description: 'Documentation de l\'API du projet'
        },
        components: {
            schemas: {
                Catway: {
                    type: 'object', 
                    required: ['catwayNumber', 'catwayType'], 
                    properties: {
                        catwayNumber: {
                            type: 'Number',
                            description: 'numéro de catway unique'
                        }, 
                        catwayType: {
                            type: 'String', 
                            enum: ['long', 'short'], 
                            description: 'type de catway'
                        }, 
                        catwayState: {
                            type: 'String', 
                            description: 'état du catway, correspondant à une description de l\'état de la passerelle'
                        }
                    }
                }, 
                Reservation: {
                    type: 'object', 
                    required: ['catwayNumber', 'clientName', 'startDate', 'endDate'], 
                    properties: {
                        catwayNumber: {
                            type: 'Number', 
                            description: 'numéro du catway réservé'
                        }, 
                        clientName: {
                            type: 'String', 
                            description: 'nom du client ayant effectué la réservation'
                        }, 
                        boatName: {
                            type: 'String', 
                            description: 'nom du bateau amarré'
                        }, 
                        startDate: {
                            type: 'Date', 
                            description: 'date de début de la réservation'
                        }, 
                        endDate: {
                            type: 'Date', 
                            description: 'date de fin de la réservation'
                        }
                    }
                }, 
                User: {
                    type: 'Object', 
                    required: ['username', 'email', 'password'], 
                    properties: {
                        username: {
                            type: 'String', 
                            minlength: 3, 
                            match: '/^[a-zA-Z0-9]+$/',
                            description: 'nom d\'utilisateur'
                        }, 
                        email: {
                            type: 'String', 
                            match: '/^\S+@\S+\.\S+$/', 
                            lowercase: 'true', 
                            description: 'adresse de messagerie unique'
                        }, 
                        password: {
                            type: 'String', 
                            match: '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/', 
                            description: 'mot de passe'
                        }
                    }
                }
            }, 
            securitySchemes: {
                bearerAuth: {
                    type: 'http', 
                    scheme: 'bearer', 
                    bearerFormat: 'JWT'
                }
            }
        }, 
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Serveur de développement'
            }
        ]
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
