const express = require('express');
const router = express.Router({mergeParams: true});
const private = require('../middlewares/private');

const serviceReservations = require('../services/reservations')

/* Je n'ai pas su faire en sorte que les réservations soient une sous-ressource des catways.
Peut-être aurait-il fallu prévoir une page par Catway puis dans cette page y intégrer les possibilités d'un point de vue réservation ?
Mais en même temps il était censé y avoir une page spécifique pour les opérations CRUD pour les réservations. */    

/**
 * @swagger
 * /reservations/:
 *      get:
 *          summary: Affiche la liste des réservations
 *          description: Cette route récupère toutes les réservations enregistrées dans la base de données et rend une vue avec des messages facultatifs de succès ou d'erreur. 
 *          tags: [Reservations]
 *          security: 
 *              - JWT: []
 *          responses: 
 *                  200: 
 *                      description: vue contenant la liste des réservations rendue avec succès
 *                  500: 
 *                      description: erreur du serveur lors de la récupération des réservations
 */
router.get('/', private.checkJWT, serviceReservations.getAll);

/**
 * @swagger
 * /reservations/add: 
 *      get: 
 *          summary: Affiche la page pour créer une nouvelle réservation
 *          description: Cette route permet à l'utilisateur d'accéder à la page permettant de créer une nouvelle réservation
 *          tags: [Reservations]
 *          security: 
 *              - JWT: []
 *          responses: 
 *              200: 
 *                  description: la page pour créer une nouvelle réservation s'affiche
 */
router.get('/add', private.checkJWT, serviceReservations.goToAdd);

/**
 * @swagger
 * /reservations/: 
 *      post: 
 *          summary: Crée une nouvelle réservation
 *          description: Cette route permet de créer une nouvelle réservation dans la base de données et de renvoyer sur la page de gestion des réservations
 *          tags: [Reservations]
 *          security: 
 *              - JWT: []
 *          requestBody: 
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Reservation'
 *          responses: 
 *              302: 
 *                  description: redirection vers la page de gestion des réservations avec un message de succès
 *              500: 
 *                  description: erreur du serveur lors de la création de la nouvelle réservation
 *                  
 */
router.post('/', private.checkJWT, serviceReservations.add);

/**
 * @swagger
 * /reservations/{id}:
 *      get: 
 *          summary: Récupère et affiche les détails d'une réservation
 *          description: Cette route récupère les informations d'une réservation et les rend dans une page spécifique. 
 *          tags: [Reservations]
 *          security: 
 *              - JWT: []
 *          parameters: 
 *              in: path
 *              name: id
 *              required: true
 *              schema: 
 *                  type: string
 *                  description: identifiant unique de la réservation
 *          responses:
 *              200: 
 *                  description: détails de la réservation récupérés avec succès & rendus dans une page spécifique
 *              400: 
 *                  description: rend la page de gestion des réservations avec un message d'erreur si le numéro d'identification n'est pas trouvé
 *              500: 
 *                  description: erreur du serveur lors de la récupération des informations de la réservation
 * 
 */
router.get('/:id', private.checkJWT, serviceReservations.getOne);

/**
 * @swagger
 * /reservations/edit/{id}:
 *      get: 
 *          summary: Affiche la page de modification d'une réservation
 *          description: Cette route récupère une réservation spécifique à partir de son identifiant et affiche la page de modification d'une réservation
 *          tags: [Reservations]
 *          security: 
 *              - JWT: []
 *          parameters: 
 *              in: path
 *              name: id
 *              required: true
 *              schema: 
 *                  type: String
 *                  description: identifiant unique de la réservation
 *          reponses:
 *              200: 
 *                  description: la page de modification est rendue avec succès
 *              302: 
 *                  description: redirection vers la page de gestion des réservations avec un message d'erreur si la réservation n'est pas trouvée
 *              500: 
 *                  description: erreur du serveur lors de la récupération des détails de la réservation pour modification
 */
router.get('/edit/:id', private.checkJWT, serviceReservations.goToEdit);

/**
 * @swagger
 * /reservations/{id}:
 *      put:
 *          summary: Met à jour une réservation existante
 *          description: Cette route met à jours les informations d'une réservation existante dans la base de données et renvoie vers la page de gestion des réservations avec un message de succès
 *          tags: [Reservations]
 *          security: 
 *              - JWT: []
 *          parameters: 
 *              in: path
 *              name: id
 *              required: true
 *              schema: 
 *                  type: string
 *                  description: identifiant unique de la réservation
 *          requestBody: 
 *              required: true
 *              content: 
 *                  application/json: 
 *                      schema: 
 *                          $ref: '#/components/schemas/Reservation'
 *          responses:
 *              302: 
 *                  description: redirection avec un message de succès vers la page de gestion des réservations
 *              400: 
 *                  description: réservation introuvable avec l'identifiant fourni
 *              500: 
 *                  description: erreur du serveur lors de la modification de la réservation
 *              
 */
router.put('/:id', serviceReservations.update);

/**
 * @swagger
 * /reservations/{id}: 
 *      delete: 
 *          summary: Supprime une réservation spécifique
 *          description: Cette route permet de supprimer une réservation à partir de son numéro d'identification et renvoie vers la page de gestion des réservations avec un message de succès
 *          tags: [Reservations]
 *          security: 
 *              - JWT: []
 *          parameters: 
 *              in: path
 *              name: id
 *              required: true
 *              schema: 
 *                  type: string
 *                  description: numéro d'identification unique de la réservation
 *          responses: 
 *              302: 
 *                  description: redirection vers la page de gestion des réservations avec un message de succès
 *              404:
 *                  description: réservation introuvable avec l'identifiant fourni
 *              500:
 *                  description: erreur du serveur lors de la suppression de la réservation.
 */
router.delete('/:id', serviceReservations.delete);

module.exports = router;