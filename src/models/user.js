const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema;

const User = new userSchema ({
    username: {
        type: String, 
        trim: true, 
        required: [true, 'le nom d\'utilisateur est requis'], 
        minlength: [3, 'le nom d\'utilisateur doit contenir au moins 3 caractères'], 
        // On impose pour le nom d'utilisateur de n'utiliser que des chiffres et des lettres (majuscules ou minuscules)
        match: [/^[a-zA-Z0-9]+$/, 'le nom d\'utilisateur ne doit avoir que des chiffres et des lettres'],
        unique: true
    }, 
    email: {
        type: String, 
        trim: true, 
        required: [true, 'l\'adresse e-mail est requise'], 
        /* On impose un format particulier à l'adresse mail. \S correspond à tout caractère sauf un espace, + indique qu'il doit
        y avoir au moins un de ces caractères ou plus. */
        match: [/^\S+@\S+\.\S+$/, 'l\'adresse e-mail saisie n\'est pas valide'],
        unique: true, 
        lowercase: true
    }, 
    password: {
        type: String, 
        trim: true, 
        required: [true, 'le mot de passe est requis'], 
        /* On impose un format particulier au mot de passe. (?=...) vérifie qu'une condition est remplie, quelque part dans la chaîne.
        \d indique un chiffre de 0 à 9, .* indique qu'il peut y avoir 0 ou 1 ou plusieurs caractères avant ce chiffre. De la même 
        manière, \W représente tout caractère non alphanumérique ; il est suivi de _ pour indiquer qu'on accepte aussi le caractère
        "_". Enfin, {8,} indique que le mot de passe doit faire minimum 8 caractères. 
        */
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, 'le mot de passe doit faire au moins 8 caractères et contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial']
    }
}, {
    // Pour rajouter createdAt & updateAt
    timestamps: true
});

/**
 * Middleware de mongoose qui s'exécute avant la sauvegarde dans la base de données. 
 * Si le champ "password" de l'utilisateur a été modifié, il hash le mot de passe avec un nombre de rounds de 10 & passe 
 * au middleware suivant. 
 * 
 * @params {Function} next : callback qui passe au middleware suivant. 
 */
User.pre('save', function(next) {
    if (!this.isModified('password')){
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.model('User', User);