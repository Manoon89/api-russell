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

/* à regarder de plus près 
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

// Modifier l'état d'un reservation
exports.update = async (req, res, next) => {
    const id = req.params.reservationNumber
    const temp = ({
        reservationState: req.body.reservationState, 
    });

    try {
        let reservation = await Reservation.findOne(id);

        if (reservation) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]){
                    reservation [key] = temp [key];
                }
            });

            await reservation.save();
            return res.status(201).json(reservation);
        }

        return res.status(404).json('reservation_not_found');
    }
    catch (error) {
        return res.status(501).json(error);
    }
}

// Supprimer un reservation
exports.delete = async (req, res, next) => {
    const id = req.params.reservationNumber
    
    try {
        await Reservation.deleteOne(id);
        return res.status(204).json('delete_ok');
    }
    catch (error) {
        return res.status(501).json(error);
    }
}
*/