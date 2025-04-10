const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');

/**
 * 
 * Cette fonction récupère tous les utilisateurs de la base de données et les rend dans la vue. 
 * 
 * Elle va : 
 * - Chercher tous les utilisateurs dans la base de données, 
 * - Afficher la page de gestion des utilisateurs si la requête est un succès,
 * - Retourner une erreur 501 en cas de problème de serveur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Retourne la vue 'users' ou renvoie un message d'erreur en cas de problème serveur. 
 */
exports.getAll = async (req, res, next) => {

    const { error, success } = req.query;

    try {
        const users = await User.find();
        
        return res.render('users', {
            users: users, 
            error: error || null, 
            success: success || null        
        });
    }

    catch (error) {
        res.status(500).send(error.message);
    }
}

/**
 * 
 * Cette fonction rend la vue de la page d'ajout d'un utilisateur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 */
exports.goToAdd = (req, res) => {
    res.render('addUser');
};

/**
 * 
 * Cette fonction permet d'ajouter un nouvel utilisateur à la base de données. 
 * 
 * Elle va : 
 * - Récupérer les données saisies, 
 * - Créer un nouvel utilisateur dans la base de données, 
 * - Redirige l'utilisateur vers la page de gestion des utilisateurs, 
 * - Retourner une erreur en cas de problème de validation ou de serveur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns redirige vers '/users' en cas de succès ou affiche les messages d'erreur. 
 */
exports.add = async (req, res, next) => {

    const temp = ({
        username: req.body.username, 
        email: req.body.email, 
        password: req.body.password
    });

    try {
        let user = await User.create(temp);
        return res.redirect('/users?success=Nouvel utlisateur créé avec succès !');
    }
    catch (error) {
        return res.status(501).json(error);
    }     
}

/**
 * 
 * Cette fonction permet de récupérer un utilisateur en particulier à partir de son email. 
 * 
 * Elle va : 
 * - Extraire l'adresse email depuis les paramètres, 
 * - Rechercher un utilisateur correspondant dans la base de données, 
 * - Retourner la vue de gestion des utilisateurs avec un message d'erreur, en cas d'erreur,  
 * - Retourner la vue de la page de détails en cas de succès.
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Retourne la vue de la page de détails en cas de succès, ou de la page de gestion des utilisateurs avec un message d'erreur sinon. 
 */
exports.getByEmail = async (req, res, next) => {

  try {
      const user = await User.findOne({ email: req.params.email }); // Recherche par email
      if (!user) {
          return res.redirect('/users?error=Utilisateur introuvable');
      }
      return res.render('detailsUser', { user: user });

  } catch (error) {
      console.error('Erreur lors de la récupération des détails :', error);
      return res.redirect('/users?error=Erreur lors de la récupération des détails');
  }
}

/**
 * 
 * Cette fonction permet de renvoyer sur la page de modification d'un utilisateur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * 
 * @returns Retourne la vue de modification d'un utilisateur en cas de succès, ou la vue de gestion des utilisateurs avec un message d'erreur sinon.
 */
exports.goToEdit = async (req, res) => {

  try {
      const user = await User.findOne({ email: req.params.email }); // Recherche par email
      if (!user) {
          return res.redirect('/users?error=Utilisateur introuvable');
      }
      return res.render('editUser', { user: user });

  } catch (error) {
      console.error('Erreur lors de la récupération pour modification :', error);
      return res.redirect('/users?error=Erreur lors de la récupération pour modification');
  }
};

/**
 * 
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
 * @returns redirige vers '/users' avec un message de succès ou d'erreur. 
 */
exports.update = async (req, res, next) => {

    const email = req.params.email; // Récupère l'email depuis les paramètres
    const updatedData = {
        username: req.body.username,
        email: req.body.email 
    };

    if (req.body.password) {
        try {
            // Hache le nouveau mot de passe avant de l'ajouter à updatedData
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            updatedData.password = hashedPassword;
        } catch (hashError) {
            console.error('Erreur lors du hachage du mot de passe :', hashError);
            return res.redirect('/users?error=Erreur lors du hachage du mot de passe');
        }
    }

    try {
        const user = await User.findOneAndUpdate({ email: email }, updatedData, { new: true, runValidators: true });

        if (!user) {
            console.error('Utilisateur introuvable pour l\'email :', email);
            return res.redirect('/users?error=Utilisateur introuvable');
        }

        console.log('Utilisateur mis à jour avec succès :', user);
        return res.redirect('/users?success=Utilisateur modifié avec succès');
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        return res.redirect('/users?error=Erreur lors de la mise à jour');
    }
};

/**
 * 
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
 * @returns Redirige vers '/users' avec un message de succès ou envoie une erreur en cas d'utilisateur introuvable
 */
exports.delete = async (req, res, next) => {
    const email = req.params.email
    
    try {
        const result = await User.findOneAndDelete({ email: email }); 

        if (!result) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        return res.redirect('/users?success=Utilisateur supprimé avec succès');
    }
    catch (error) {
        return res.status(500).json(error);
    }
}