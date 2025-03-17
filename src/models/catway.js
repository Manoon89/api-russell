const mongoose = require('mongoose');

const catwaySchema = mongoose.Schema; 

const Catway = new catwaySchema ({
    catwayNumber: {
        type: Number, 
        trim: true, 
        unique: true, 
        required: [true, 'le numéro du catway est obligatoire']
    }, 
    catwayType: {
        type: String, 
        trim: true, 
        required: [true, 'le type du catway est obligatoire'], 
        // enum permet de limiter ce champ aux possibilités énumérées, ici "long" ou "short"
        enum: ['long', 'short']
    }, 
    catwayState: {
        type: String, 
        trim: true
    }
}, {
    // Pour rajouter createdAt & updateAt
    timestamps: true
});

module.exports = mongoose.model('Catway', Catway);