const Catway = require('../models/catway');

/**
 * Cette fonction ajoute un nouveau catway dans la base de données. 
 * Elle va : 
 * - Récupérer les données du formulaire (catwayNumber, catwayType & catwayState), 
 * - Créer un nouvel enregistrement dans la base de données, 
 * - Rediriger l'utilisateur vers la page de gestion des catways en cas de réussite, 
 * - Gérer les erreurs & les afficher dans la vue de création. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Redirige vers '/catways/manage' en cas de succès ou rend la vue 'addCatway' en cas d'erreur. 
 * 
 * @throws {Error} Renvoie un message d'erreur à l'utilisateur en cas d'erreur de validation ou de problème de serveur. 
 */
exports.add = async (req, res, next) => {
    const temp = ({
        catwayNumber: req.body.catwayNumber, 
        catwayType: req.body.catwayType, 
        catwayState: req.body.catwayState
    });

    try {
        let catway = await Catway.create(temp);
        return res.redirect('/catways/manage');
    }
    catch (error) {
        console.error('Erreur lors de la création du catway :', error);

        // Vérifie si c'est une erreur de validation
        if (error.name === 'ValidationError') {
            return res.render('addCatway', { 
                error: 'Attention, le type de Catway doit être "short" ou "long". Veuillez corriger votre saisie.' 
            });
        }

        // Pour tout autre type d'erreur
        return res.render('addCatway', { 
            error: 'Une erreur est survenue lors de la création du catway. Veuillez réessayer.' 
        });
    }
}

/**
 * Cette fonction récupère tous les catways présents dans la base de données & les retourne en format json. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant

 * @returns Envoie une réponse au format JSON avec tous les catways ou un message d'erreur. 
 */
exports.getAll = async (req, res, next) => {
    try {
        let catways = await Catway.find();
        return res.status(200).json(catways);
    }
    catch (error) {
        return res.status(501).json(error);
    }
}

/**
 * Cette fonction récupère un catway spécifique de la base de données avec son numéro d'identifiant. 
 * Elle va : 
 * - Extraire le numéro d'identifiant du catway, 
 * - Rechercher le catway correspondant dans la base de données, 
 * - Retourner le catway avec un code d'état 200 s'il a été trouvé, 
 * - Retourner un code d'état 404 s'il n'est pas trouvé, 
 * - Capturer les erreurs lors de la recherche & renvoyer une erreur 501 au besoin. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 *  
 * @returns 
 */
exports.getOne = async (req, res, next) => {
    const id = req.params.id
    try {
        let catway = await Catway.findOne(id);
        if (catway) {
            return res.status(200).json(catway);
        }
        return res.status(404).json('catway_not_found');
    }
    catch(error) {
        return res.status(501).json(error);
    }
}

/**
 * Cette fonction met à jour uniquement l'état d'un catway dans la base de données. 
 * Elle va : 
 * - Récupérer l'identifiant du catway, 
 * - Chercher le catway dans la base de données, 
 * - Mettre à jour uniquement l'attribut 'catwayState' avec la nouvelle valeur, 
 * - Sauvegarder les informations & rediriger vers la page de gestion des catways, 
 * - Gérer les erreurs si le catway est introuvable ou en cas de problème serveur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Redirige vers '/catway/manage' en cas de succès ou d'erreur, avec un message. 
 */
exports.update = async (req, res, next) => {
    const id = req.params.id; // Récupère l'ID du catway
    const updatedState = req.body.catwayState; // Récupère la nouvelle valeur pour catwayState

    try {
        const catway = await Catway.findById(id);

        if (!catway) {
            console.error('Catway introuvable pour l\'ID :', id);
            return res.redirect('/catways/manage?error=Catway introuvable');
        }

        catway.catwayState = updatedState; // Modifie uniquement catwayState
        await catway.save(); // Sauvegarde les modifications

        console.log('Catway mis à jour avec succès :', catway);
        return res.redirect('/catways/manage?success=Catway mis à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du catway :', error);
        return res.redirect('/catways/manage?error=Erreur lors de la mise à jour');
    }
};

/**
 * Cette fonction supprime un catway de la base de données. 
 * 
 * Elle va : 
 * - Récupérer l'id du catway, 
 * - Chercher & supprimer le catway correspondant, 
 * - Rediriger l'utilisateur vers la gestion des catways avec un message de réussite ou d'erreur. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @returns Redirige vers '/catways/manage' avec un message de succès ou d'erreur. 
 */
exports.delete = async (req, res, next) => {
    const id = req.params.id
    
    try {
        const result = await Catway.findOneAndDelete({ _id: id });

        if (!result) {
            console.error('Catway introuvable pour l\'ID :', id);
            return res.redirect('/catways/manage?error=Catway introuvable');
        }

        console.log('Catway supprimé avec succès :', result);
        return res.redirect('/catways/manage?success=Catway supprimé avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        return res.redirect('/catways/manage?error=Erreur lors de la suppression');
    }
};