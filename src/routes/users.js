const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');

const serviceUsers = require('../services/users')

/**
 * @swagger
 * /users/: 
 *      get:
 *          summary: Affiche la liste de tous les utilisateurs
 *          description: Cette route permet d'affiche la liste de tous les utilisateurs présents dans la base de données
 *          tags: [Users]
 *          security: 
 *              - JWT: []
 *          responses: 
 *              200: 
 *                  description: retourne la page de gestion de tous les utilisateurs
 *              500: 
 *                  description: erreur du serveur lors de la récupération des utilisateurs
 */
router.get('/', private.checkJWT, serviceUsers.getAll);

/**
 * @swagger
 * /users/add: 
 *      get: 
 *          summary: Affiche la page d'ajout d'un utilisateur
 *          description: Cette route permet à l'utilisateur d'accéder à la page d'ajout d'un utilisateur. 
 *          tags: [Users]
 *          security: 
 *              - JWT: []
 *          responses: 
 *              200: 
 *                  description: la page d'ajout d'un utilisateur est rendue avec succès
 */
router.get('/add', private.checkJWT, serviceUsers.goToAdd);

/**
 * @swagger
 * /users/: 
 *      post: 
 *          summary: Crée un nouvel utilisateur
 *          description: Cette route permet de créer un nouvel utilisateur dans la base de données et retourne la page de gestion des utilisateurs avec un mesage de succès. 
 *          tags: [Users]
 *          security: 
 *              - JWT: []
 *          requestBody: 
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema: 
 *                           $ref: '#/components/schemas/User'
 *          reponses: 
 *              302: 
 *                  description: redirection avec un message de succès vers la page de gestion des utilisateurs
 *              500: 
 *                  description: erreur du serveur lors de la création d'un nouvel utilisateur
 */
router.post('/', private.checkJWT, serviceUsers.add);

/**
 * @swagger
 * /users/{email}:
 *      get:
 *          summary: Récupère les détails d'un utilisateur via son email
 *          description: Cette route récupère les détails d'un utilisateur via son email dans la base de données. 
 *          tags: [Users]
 *          security: 
 *              - JWT: []
 *          parameters: 
 *              in: path
 *              name: email
 *              required: true
 *              schema: 
 *                  type: email
 *                  description: adresse email unique de l'utilisateur
 *          responses: 
 *              200: 
 *                  description: Renvoie les détails de l'utilisateur sur une page spécifique
 *              302: 
 *                  description: Redirige vers la page de gestion des utilisateurs avec un message d'erreur en cas d'utilisateur non trouvé
 *              500: 
 *                  description: erreur du serveur lors de la récupération de l'utilisateur
 */
router.get('/:email', private.checkJWT, serviceUsers.getByEmail);

/**
 * @swagger
 * /users/edit/{email}:
 *      get:  
 *          summary: Affiche la page de modification d'un utilisateur
 *          description: Cette route récupère les informations d'un utilisateur et affiche la page de modification correspondante
 *          tags: [Users]
 *          security: 
 *              - JWT: []
 *          parameters: 
 *              in: path
 *              name: email
 *              required: true
 *              schema: 
 *                  type: email
 *                  description: adresse email unique de l'utilisateur
 *          responses: 
 *              200: 
 *                  description: la page de modification de l'utilisateur est rendue
 *              302: 
 *                  description: redirige vers la page de gestion des utilisateurs avec un message d'erreur si l'utilisateur n'est pas trouvé
 *              500: 
 *                  description: erreur du serveur lors de la récupération des inforamtions de l'utilisateur
 */
router.get('/edit/:email', private.checkJWT, serviceUsers.goToEdit);

/**
 * @swagger
 * /users/{email}:
 *      put:    
 *          summary: Met à jour un utilisateur
 *          description: Envoie les modifications d'un utilisateur à la base de données et renvoie vers la page de gestion des utilisateurs avec un message de succès. 
 *          tags: [Users]
 *          security: 
 *              - JWT: []
 *          parameters: 
 *              in: path
 *              name: email
 *              required: true
 *              schema: 
 *                  type: email
 *                  description: adresse email unique de l'utilisateur
 *          requestBody: 
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema: 
 *                           $ref: '#/components/schemas/User'
 *          responses: 
 *              302: 
 *                  description: redirection avec un message de succès vers la page de gestion des utilisateurs
 *              404: 
 *                  description: redirection avec un message d'erreur vers la page de gestion des utilisateurs si l'utilisateur n'a pas été trouvé
 *              500: 
 *                  description: erreur du serveur lors de la modification des données de l'utilisateur
 */
router.put('/:email', private.checkJWT, serviceUsers.update);

/**
 * @swagger
 * /users/{email}:
 *      delete:
 *          summary: Supprime un utilisateur
 *          description: Cette route récupère les informations d'un utilisateur & le supprime dans la base de données, puis renvoie vers la page de gestion des utilisateurs avrec un message de succès. 
 *          tags: [Users]
 *          security: 
 *              - JWT: []
 *          parameters: 
 *              in: path
 *              name: email
 *              required: true
 *              schema: 
 *                  type: email
 *                  description: adresse email unique de l'utilisateur
 *          reponses: 
 *              302: 
 *                  description: redirige vers la page de gestion des utilisateurs avec un message de succès
 *              404: 
 *                  description: redirige vers la page de gestion des utilisateurs avec un message d'erreur
 *              500: 
 *                  description: erreur du serveur lors de la suppression d'un utilisateur
 */
router.delete('/:email', private.checkJWT, serviceUsers.delete);

module.exports = router;