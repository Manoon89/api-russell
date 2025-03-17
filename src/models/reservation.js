const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema; 

const Reservation = new reservationSchema ({
    catwayNumber: {
        type: Number, 
        trim: true, 
        required: [true, 'le numéro du catway est obligatoire']
    }, 
    clientName: {
        type: String, 
        trim: true, 
        required: [true, 'le nom du client est obligatoire']
    }, 
    boatName: {
        type: String, 
        trim: true
    }, 
    startDate: {
        type: Date, 
        trim: true, 
        required: [true, 'la date de début est obligatoire']
    }, 
    endDate: {
        type: Date, 
        trim: true, 
        required: [true, 'la date de fin est obligatoire']
    }
}, {
    // Pour rajouter createdAt & updateAt
    timestamps: true, 
});

module.exports = mongoose.model('Reservation', Reservation);