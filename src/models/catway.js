const mongoose = require('mongoose');

const catwaySchema = mongoose.Schema; 

const Catway = new catwaySchema ({
    catwayNumer: {
        type: Number, 
        trim: true, 
        unique: true, 
        required: [true, 'le numéro du catway est obligatoire']
    }, 
    catwayType: {
        type: String, 
        trim: true, 
        required: [true, 'le type du catway est obligatoire'], 
        enum: ['long', 'short']
    }, 
    catwayState: {
        type: String, 
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Catway', Catway);