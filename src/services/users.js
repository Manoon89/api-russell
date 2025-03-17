const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');

/**
 * Cette fonction permet d'ajouter un nouvel utilisateur à la base de données. 
 * 
 * Elle va : 
 * - Récupérer les données saisies, 
 * - Créer un nouvel utilisateur dans la base de données, 
 * - Redirige l'utilisateur vers la page de gestion des utilisateurs, 
 * - Renvoie des messages d'erreur spécifiques en cas d'erreur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns redirige vers '/users/manage' en cas de succès ou affiche les messages d'erreur. 
 */
exports.add = async (req, res, next) => {
    const temp = ({
        username: req.body.username, 
        email: req.body.email, 
        password: req.body.password
    });

    try {
        let user = await User.create(temp);
        return res.redirect('/users/manage');
    }
    catch (error) {
        console.error('Erreur de validation lors de la création de l\'utilisateur :', error);

        // Vérifie si c'est une erreur de validation
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message); // Récupère les messages d'erreur

            return res.render('addUser', { 
                errors: errorMessages, // Passe les erreurs à la vue
                formData: temp // Passe les données saisies pour les réafficher dans le formulaire
            });
        }

        // Pour tout autre type d'erreur, renvoyer une réponse générique
        return res.render('addUser', { 
            errors: ['Une erreur inconnue est survenue. Veuillez réessayer.'],
            formData: temp
        });
    }    
}

/**
 * Cette fonction récupère tous les utilisateurs de la base de données. 
 * 
 * Elle va : 
 * - Chercher tous les utilisateurs dans la base de données, 
 * - Retourner une réponse JSON contenant tous les utilisateurs, 
 * - Retourner une erreur 501 en cas de problème de serveur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Envoie une réponse JSON contenant les utilisateurs ou une erreur. 
 */
exports.getAll = async (req, res, next) => {
    try {
        let users = await User.find();
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(501).json(error);
    }
}

/**
 * Cette fonction permet de récupérer un utilisateur en particulier à partir de son email. 
 * 
 * Elle va : 
 * - Extraire l'adresse email depuis les paramètres, 
 * - Rechercher un utilisateur correspondant dans la base de données, 
 * - Retourner une réponse JSON avec les détails de l'utilisateur, 
 * - Retourner une erreur 404 si l'utilisateur est introuvable ou une erreur 501 en cas de problème de serveur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Envoie une réponse JSON avec l'utilisateur ou un message d'erreur. 
 */
exports.getByEmail = async (req, res, next) => {
    const email = req.params.email
    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json('user_not_found');
    }
    catch(error) {
        return res.status(501).json(error);
    }
}

/**
 * Cette fonction met à jour un utilisateur. 
 * 
 * Elle va : 
 * - Récupérer l'email de l'utilisateur depuis les paramètres, 
 * - Mettre à jour les champs dans la base de données, 
 * - Rediriger vers la page de gestion des utilisateurs avec un message de succès, 
 * - Rediriger avec un message d'erreur si l'utilisateur est introuvable ou s'il y a un problème de serveur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns redirige vers '/users/manage' avec un message de succès ou d'erreur. 
 */
exports.update = async (req, res, next) => {
    const email = req.params.email; // Récupère l'email depuis les paramètres
    const updatedData = {
        username: req.body.username,
        email: req.body.email 
    };

    try {
        const user = await User.findOneAndUpdate({ email: email }, updatedData, { new: true, runValidators: true });

        if (!user) {
            console.error('Utilisateur introuvable pour l\'email :', email);
            return res.redirect('/users/manage?error=Utilisateur introuvable');
        }

        console.log('Utilisateur mis à jour avec succès :', user);
        return res.redirect('/users/manage?success=Utilisateur modifié avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        return res.redirect('/users/manage?error=Erreur lors de la mise à jour');
    }
};

/**
 * Cette fonction supprimer un utilisateur de la base de données. 
 * 
 * Elle va : 
 * - Récupérer l'adresse e-mail depuis les paramètres, 
 * - Supprimer l'utilisateur correspondant dans la base de données, 
 * - Rediriger vers la page de gestion des utilisateurs avec un message de succès ou retourne une erreur en cas d'utilisateur introuvable. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Redirige vers '/users/manage' avec un message de succès ou envoie une erreur en cas d'utilisateur introuvable
 */
exports.delete = async (req, res, next) => {
    const email = req.params.email
    
    try {
        const result = await User.findOneAndDelete({ email: email }); 

        if (!result) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        return res.redirect('/users/manage');
    }
    catch (error) {
        return res.status(500).json(error);
    }
}

/**
 * Cette fonction permet d'authentifier un utilisateur et de générer un token pour la session. 
 * 
 * Elle va : 
 * - Extraire l'email et le mot de passe depuis le corps de la requête, 
 * - Rechercher l'utilisateur correspondant dans la base de données via l'email, 
 * - Vérifier si le mot de passe fourni correspond au mot de passe stocké en version chiffrée, 
 * - Générer un token valide, 
 * - Retourner une réponse JSON contenant le statut d'authentification ou une erreur en cas d'échec. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * @returns 
 */
exports.authenticate = async (req, res, next) => {
    
    const {email, password} = req.body; 
    
    try {
        let user = await UserActivation.findOne({email: email}, '-__v -createdAt -uptadedAt')
        if (user) {
            bcrypt.compare(password, user.password, function(err, response){
                if (err){
                    throw new Error(err);
                }
                if (response){
                    delete user._doc.password;
                    const expiresIn = 24*60*60*1000;
                    const token = jwt.sign ({
                        user: user
                    }, 
                    process.env.SECRET_KEY, 
                    {
                    expiresIn: expiresIn
                    });
                
                    res.header('Authorization', 'Bearer' + token);
                    return res.status(200).json('authenticate_succeed');
                }

                return res.status(404).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch(error){
            return res.status(501).json(error);
    }
}