const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res, next) => {
    const {email, password} = req.body; 

    console.log('Données reçues :', req.body);

    if (!email || !password) {
        return res.status(400).json('Email and password are required');
    }

    try {
        
        console.log('email reçu :', email);

        const user = await User.findOne ({ email: email });

        if (!user) {
            console.log('Utilisateur non trouvé');
            return res.status(404).json('user_not_found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Mot de passe incorrect');
            return res.status(401).json('wrong_credentials');
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email}, 
            process.env.SECRET_KEY, 
            {expiresIn: '1h'}
        );

        console.log('Utilisateur connecté avec succès');
        return res.redirect('/dashboard');
        /*return res.status(200).json({token});*/
    }
    catch (error) {
        console.error('Erreur lors de la connexion: ', error);
        return res.status(500).json('Internal server error');
    }
};

exports.logout = (req, res, next) => {
    return res.status(200).json('logout_success');
}