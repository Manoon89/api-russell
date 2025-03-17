const Reservation = require('../models/reservation');

/**
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
 * @returns Redirige vers '/reservations/manage' ou retourne une erreur. 
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
        return res.redirect('/reservations/manage');
    }
    catch (error) {
        return res.status(501).json(error);
    }    
}

/* Pour avoir une API optimisée, il faudra rajouter une erreur si la création de la réservation se fait à des dates où le catway 
concerné est déjà réservé */

/**
 * Cette fonction permet de récupérer les détails d'une réservation, y compris sa date de création et sa date de modification. 
 * 
 * Elle va : 
 * - Extraire l'id de la réservation et le numéro de catway, 
 * - Rechercher la réservation correspondante, 
 * - Retourner la réservation avec un code 200 en cas de succès, 
 * - Retourner une erreur 404 si la réservation est introuvable. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Envoie une réponse JSON contenant la réservation ou un message d'erreur.
 */
exports.getOne = async (req, res, next) => {
    const catwayId = req.params.catwayNumber;
    const idReservation = req.params.idReservation;

    try {
        let reservation = await Reservation.findOne({ catwayId, idReservation });
        if (reservation) {
            return res.status(200).json(reservation);
        }
        return res.status(404).json('reservation_not_found');
    }
    catch(error) {
        return res.status(501).json(error);
    }
}   

// Lister l'ensemble des réservations
exports.getAll = async (req, res, next) => {

    const catwayId = req.params.catwayNumber;

    try {
        let reservations = await Reservation.find( {catwayNumber: catwayId});
        return res.status(200).json(reservations);
    }
    catch (error) {
        return res.status(501).json(error);
    }
}

// Modifier l'état d'une réservation

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
            return res.redirect('/reservations/manage?error=Réservation introuvable');
        }

        console.log('Réservation mise à jour avec succès :', reservation);
        return res.redirect('/reservations/manage?success=Réservation modifiée avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la réservation :', error);
        return res.redirect('/reservations/manage?error=Erreur lors de la mise à jour');
    }
};

// Supprimer une réservation
exports.delete = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const result = await Reservation.findOneAndDelete({ _id: id }); 

        if (!result) {
            return res.status(404).json({ message: 'Réservation introuvable' });
        }

        return res.redirect('/reservations/manage');
    }
    catch (error) {
        return res.status(501).json(error);
    }
}