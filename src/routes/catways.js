const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');

const serviceCatways = require('../services/catways')

/**
 * @swagger
 * /catways/:
 *      get: 
 *          summary: Récupère et affiche la liste des catways
 *          description: Cette route renvoie une vue contenant tous les Catways de la base de données, ainsi que des messages facultatifs de succès ou d'erreur. 
 *          tags: [Catways]
 *          security: 
 *              - JWT: []
 *          responses: 
 *            200: 
 *                description: vue rendue avec succès
 *            500:
 *                description: erreur du serveur
 */
router.get('/', private.checkJWT, serviceCatways.getAll);

/**
 * @swagger
 * /catways/add:
 *      get:
 *          summary: Affiche la page de création d'un nouveau catway
 *          description: Cette route permet à l'utilisateur d'accéder à la page de création d'un nouveau catway
 *          tags: [Catways]
 *          security: 
 *              - JWT: []
 *          responses: 
 *              200:
 *                  description: vue rendue avec succès     
 */
router.get('/add', private.checkJWT, serviceCatways.goToAdd);

/**
 * @swagger
 * /catways/:
 *      post:
 *          summary: Crée un nouveau catway
 *          description: Cette route permet d'envoyer la création du nouveau catway et redirige vers la page de gestion des catways en cas de succès
 *          tags: [Catways]
 *          security: 
 *              - JWT: []
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/json: 
 *                      schema:
 *                          $ref: '#/components/schemas/Catway'
 *          responses: 
 *              302: 
 *                  description: redirection vers la liste des catways avec un message de succès si la création est réussie
 *              400: 
 *                  description: données invalides fournies dans le corps de la requête. Message d'erreur sur la vue de création du catway
 *              500: 
 *                  description: erreur du serveur lors de la création du catway
 */
router.post('/', private.checkJWT, serviceCatways.add);

/**
 * @swagger
 * /catways/{id}:
 *      get:
 *          summary: Récupère les détails d'un catway
 *          description: Cette route permet de récupérer toutes les informations d'un catway en particulier
 *          tags: [Catways]
 *          security: 
 *              - JWT: []
 *          parameters:
 *              in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *                  description: L'identifiant unique du Catway.
 *          responses: 
 *              200: 
 *                  description: détails du catways affichés avec succès
 *              302: 
 *                  description: redirection avec un message d'erreur si le catway n'est pas trouvé
 *              500: 
 *                  description: erreur du serveur lors de la récupération du catway
 */
router.get('/:id', private.checkJWT, serviceCatways.getOne);

/**
 * @swagger
 * /catways/edit/{id}:
 *      get: 
 *          summary: Affiche la page de modification pour un catway
 *          description: Cette route récupère les informations d'un catway à partir de son id, et rend une vue permettant de le modifier
 *          tags: [Catways]
 *          security: 
 *              - JWT: []
 *          parameters:
 *              in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *                  description: L'identifiant unique du Catway.
 *          responses: 
 *              200: 
 *                  description: la page de modification est rendue avec succès
 *              302: 
 *                  description: redirection avec un message d'erreur si le catway n'est pas trouvé
 *              500: 
 *                  description: erreur du serveur lors de la récupération du catway
 */
router.get('/edit/:id', private.checkJWT, serviceCatways.goToEdit);

/**
 * @swagger
 * /catways/{id}:
 *      put: 
 *          summary: Met à jour l'état d'un catway
 *          description: Cette route met à jour uniquement l'état d'un catway en fonction de son identifiant. 
 *          tags: [Catways]
 *          security: 
 *              - JWT: []
 *          parameters:
 *              in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *                  description: L'identifiant unique du Catway.
 *          requestBody:
 *              required: true
 *              content:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          catwayState:
 *                              type: string
 *                              description: Le nouvel état du Catway.
 *                              example: "3 tâches de peinture bleue sont visibles sur le catway"
 *          responses: 
 *              302: 
 *                  description: redirection vers la liste des catways avec un message de succès si la modification est réussie
 *              400: 
 *                  description: catway introuvable par son identifiant
 *              500: 
 *                  description: erreur du serveur lors de la mise à jour du catway
 */
router.put('/:id', private.checkJWT, serviceCatways.update);

/**
 * @swagger
 * /catways/{id}:
 *      delete: 
 *          summary: Supprime un catway en particulier
 *          description: Cette route supprime un Catway à partir de son identifiant. 
 *          tags: [Catways]
 *          security: 
 *              - JWT: []
 *          parameters:
 *              in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *                  description: L'identifiant unique du Catway.
 *          responses: 
 *              302: 
 *                  description: redirection vers la liste des catways avec un message de succès si la suppression est réussie
 *              400: 
 *                  description: catway introuvable par son identifiant
 *              500: 
 *                  description: erreur du serveur lors de la suppression du catway
 */
router.delete('/:id', private.checkJWT, serviceCatways.delete);

module.exports = router;