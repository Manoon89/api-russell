const Reservation = require('../models/reservation');

// Fonction pour ajouter une nouvelle réservation
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

// Il faudrait ajouter une fonction pour que la création ne soit possible que si le catway n'est pas
// déjà réservé aux dates précisées.  

// Récupérer les détails d'une réservation
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

/* à regarder de plus près 

*/