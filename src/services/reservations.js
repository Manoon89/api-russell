const Reservation = require('../models/reservation');

/**
 * 
 * Cette fonction récupère toutes les réservations dans la base de données et les rend dans la vue. 
 * 
 * Elle va : 
 * - Vérifier la présence de réservations dans la base de données
 * - Renvoyer vers la vue de gestion des réservations si la requête est un succès
 * - Renvoyer un message d'erreur si la requête n'a pas abouti
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * 
 * @returns REnvoie la vue de la page '/reservations". 
 */
exports.getAll = async (req, res) => {
  
    try {
        const reservations = await Reservation.find();
        const { error, success } = req.query;

        console.log('Réservations récupérées :', reservations);
        
        return res.render('reservations', {
            reservations: reservations, 
            error: error || null, 
            success: success || null        
        });
    }

    catch (error) {
        res.status(500).send(error.message);
    }
}

/**
 * 
 * Cette fonction ajoute une nouvelle réservation dans la base de données. 
 * 
 * Elle va : 
 * - Récupérer les données de la requête pour créer une réservation, 
 * - Sauvegarder la réservation dans la base de données, 
 * - Rediriger l'utilisateur vers la page de gestion des réservations en cas de succès
 * - Retourner une erreur en cas de problème de validation ou de serveur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Redirige vers '/reservations' ou retourne une erreur. 
 */
exports.add = async (req, res, next) => {

    const temp = ({
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName, 
        boatName: req.body.boatName, 
        startDate: req.body.startDate, 
        endDate: req.body.endDate
    });

    try {
        let reservation = await Reservation.create(temp);
        return res.redirect('/reservations/?success=Nouvelle réservation créée avec succès !');
    }
    catch (error) {
        return res.status(500).json(error);
    }    
}

/* Pour avoir une API optimisée, il faudra rajouter une erreur si la création de la réservation se fait à des dates où le catway 
concerné est déjà réservé */

/**
 * 
 * Cette fonction rend la vue de la page d'ajout d'une réservation. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 */
exports.goToAdd = (req, res) => {
    res.render('addReservation');
}

/**
 * 
 * Cette fonction permet de récupérer les détails d'une réservation, y compris sa date de création et sa date de modification. 
 * 
 * Elle va : 
 * - Extraire l'id de la réservation, 
 * - Rechercher la réservation correspondante, 
 * - Retourner la vue de la page des détails de la réservation en cas de succès, 
 * - Retourner la vue de la page de gestion des réservations avec un message d'erreur en cas d'erreur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Envoie une réponse JSON contenant la réservation ou un message d'erreur.
 */
exports.getOne = async (req, res, next) => {

    try {
        const reservation = await Reservation.findById(req.params.id); 
        if (!reservation) {
            return res.redirect('/reservations?error=Réservation introuvable');
        }
        return res.render('detailsReservation', { reservation: reservation });

    } catch (error) {
        console.error('Erreur lors de la récupération des détails :', error);
        return res.redirect('/reservations?error=Erreur lors de la récupération des détails');
    }
}   

/**
 * 
 * Elle va : 
 * - Chercher la réservation concernée via son ID, 
 * - Retourner la page de modification de la réservation en cas de succès, 
 * - Retourner la page de gestion des réservations avec un message d'erreur en cas d'erreur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 *
 */
exports.goToEdit = async (req, res) => {

    try {
        const reservation = await Reservation.findById(req.params.id); // Recherche la réservation par son ID
        if (!reservation) {
            return res.redirect('/reservations?error=Réservation introuvable');
        }
        return res.render('editReservation', { reservation: reservation });

    } catch (error) {
        console.error('Erreur lors de la récupération pour modification :', error);
        return res.redirect('/reservations?error=Erreur lors de la récupération pour modification');
    }
};


/**
 * 
 * Cette fonction met à jour une réservation dans la base de données. 
 * 
 * Elle va : 
 * - Extraire l'id de la réservation, 
 * - Récupérer les nouvelles données de réservations saisies, 
 * - Mettre à jour la réservation correspondante dans la base de données, 
 * - Rediriger vers la page de gestion des réservations avec un message de succès, ou rediriger avec un message d'erreur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Redirige vers 'reservations' avec un message de succès ou d'erreur. 
 */
exports.update = async (req, res, next) => {
    const id = req.params.id;

    const updatedData = {
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    };

    try {
        const reservation = await Reservation.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!reservation) {
            console.error('Réservation introuvable pour l\'ID :', id);
            return res.redirect('/reservations?error=Réservation introuvable');
        }

        console.log('Réservation mise à jour avec succès :', reservation);
        return res.redirect('/reservations?success=Réservation modifiée avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la réservation :', error);
        return res.redirect('/reservations?error=Erreur lors de la mise à jour');
    }
};

/**
 * 
 * Cette fonction supprime une réservation dans la base de données. 
 * 
 * Elle va : 
 * - Extraire l'id de la réservation
 * - Chercher & supprimer la réservation
 * - Rediriger vers la page de gestion des réservations en cas de succès
 * - Retourner une erreur 404 si la réservation est introuvable ou une erreur 501 en cas de problème de serveur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 *  
 * @returns redirige vers '/reservations' avec un message de succès ou d'erreur. 
 */
exports.delete = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const result = await Reservation.findOneAndDelete({ _id: id }); 

        if (!result) {
            return res.status(404).json({ message: 'Réservation introuvable' });
        }

        return res.redirect('/reservations?success=Réservation supprimée avec succès');
    }
    catch (error) {
        return res.status(501).json(error);
    }
}