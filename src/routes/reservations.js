const express = require('express');
const router = express.Router({mergeParams: true});
const Reservation = require('../models/reservation');
const private = require('../middlewares/private');

const serviceReservations = require('../services/reservations')

/* Je n'ai pas su faire en sorte que les réservations soient une sous-ressource des catways.
Peut-être aurait-il fallu prévoir une page par Catway puis dans cette page y intégrer les possibilités d'un point de vue réservation ?
Mais en même temps il était censé y avoir une page spécifique pour les opérations CRUD pour les réservations. */    

// Permet d'accéder à la page de gestion des réservations avec la liste de toutes les réservations
router.get('/', private.checkJWT, serviceReservations.getAll);

// Permet d'accéder à la page de création d'une nouvelle réservation
router.get('/add', private.checkJWT, serviceReservations.goToAdd);

// Permet de créer une nouvelle réservation
router.post('/', private.checkJWT, serviceReservations.add);

// Permet d'accéder aux détails d'une réservation, y compris la date de création & la date de modification
router.get('/:id', private.checkJWT, serviceReservations.getOne);

// Permet d'accéder à la page de modification d'une réservation
router.get('/edit/:id', private.checkJWT, serviceReservations.goToEdit);

// Permet de modifier une réservation
router.put('/:id', serviceReservations.update);

// Permet de supprimer une réservation
router.delete('/:id', serviceReservations.delete);

module.exports = router;