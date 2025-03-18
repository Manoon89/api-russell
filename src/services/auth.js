const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Cette fonction affiche la page du tableau de bord, en passant les informations de l'utilisateur connecté. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * 
 * @returns Rend la vue ('dashboard') en passant les informations de l'utilisateur connecté. 
 */
exports.goToDashboard = (req, res) => {
    res.render('dashboard', { user: req.session?.user || null });
};

/**
 * Cette fonction permet d'authentifier un utilisateur (présent sur la base de données) en vérifiant son email & son mot de passe. 
 * Elle génère un token si les informations d'authentification sont valides. 
 * 
 * Elle va : 
 * - Vérifier si l'email & le mot de passe sont présents dans la requête ;
 * - Chercher l'utilisateur correspondant dans la base de données par l'e-mail ;
 * - Comparer le mot de passe fourni avec celui stocké de manière chiffré dans la base de données ;
 * - Créer un token en cas de succès
 * - Configurer un cookie https pour stocker le token pour une durée d'1h. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * @returns Redirige l'utilisateur vers la page Tableau de bord (dashboard) en cas de succès. 
 * Retourne un code d'état HTTP 400, 401, ou 404 avec un message approprié en cas d'erreur.
 * 
 * @throws {Error} Retourne un statut 500 ainsi qu'un message d'erreur en cas de problème serveur. 
 */
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
            return res.status(401).json('Mot de passe incorrect');
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username}, 
            process.env.SECRET_KEY, 
            {expiresIn: '1h'}
        );

        res.cookie('authToken', token, {
            httpOnly: true, 
            secure: true, 
            maxAge: 60 * 60 * 1000
        });

        console.log('Utilisateur connecté avec succès');
        return res.redirect('/dashboard');
    }
    catch (error) {
        console.error('Erreur lors de la connexion: ', error);
        return res.status(500).json('Internal server error');
    }
};

/**
 * Cette fonction déconnecte l'utilisateur en supprimant le cookie d'authentification. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 */
exports.logout = (req, res, next) => {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Déconnexion réussie' });
}