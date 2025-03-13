const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema;

const User = new userSchema ({
    username: {
        type: String, 
        trim: true, 
        required: [true, 'le nom d\'utilisateur est requis'], 
        minlength: [3, 'le nom d\'utilisateur doit contenir au moins 3 caractères'], 
        match: [/^[a-zA-Z0-9]+$/, 'le nom d\'utilisateur ne doit avoir que des chiffres et des lettres'],
        unique: true
    }, 
    email: {
        type: String, 
        trim: true, 
        required: [true, 'l\'adresse e-mail est requise'], 
        match: [/^\S+@\S+\.\S+$/, 'l\'adresse e-mail saisie n\'est pas valide'],
        unique: true, 
        lowercase: true
    }, 
    password: {
        type: String, 
        trim: true, 
        required: [true, 'le mot de passe est requis'], 
        minlength: [8, 'le mot de passe doit contenir au moins 8 caractères'], 
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, 'le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial']
    }
}, {
    timestamps: true
});

User.pre('save', function(next) {
    if (!this.isModified('password')){
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.model('User', User);