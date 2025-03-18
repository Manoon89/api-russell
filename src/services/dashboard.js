const Reservation = require('../models/reservation');

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Affiche le tableau de bord de l'utilisateur connecté avec la liste des réservations
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Vue du tableau de bord affichée avec succès
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Erreur interne lors de la récupération des données
 * 
 * Cette fonction renvoie à la page du tableau de bord. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * 
 * @returns Retourne la vue du tableau de bord en passant des informations sur les réservations et l'utilisateur connecté en cas de
 * succès ou affiche les messages d'erreur.
 */
exports.goToDashboard = async(req, res) => {

    try {
        const reservations = await Reservation.find();
        const user = req.decoded;
             
        return res.render('dashboard', {reservations: reservations, user: user});
    }
    
    catch (error) {
        res.status(500).send(error.message);
    }
};