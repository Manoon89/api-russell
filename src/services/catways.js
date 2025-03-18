const Catway = require('../models/catway');

/**
 * 
 * Cette fonction récupère tous les catways présents dans la base de données & les rend dans la vue.
 * 
 * Elle va : 
 * - Chercher tous les catways présents dans la base de données (Catway.find()), 
 * - Récupérer les paramètres success & error à partir de la requête, 
 * - Rendre la vue avec la liste des catways & les éventuels messages de succès ou d'erreur, 
 * - En cas d'erreur pendant la récupération des données, renvoie une erreur 500 avec le message correspondant. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant

 * @returns Renvoie une vue 'catways' ou renvoie un message d'erreur.
 */
exports.getAll = async (req, res, next) => {
    try {
        const catways = await Catway.find();
        const { error, success } = req.query;
        
        // retourne la liste des catways présents dans la base de données & les éventuels messages de succès ou d'erreur
        return res.render('catways', {
            catways: catways, 
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
 * Cette fonction ajoute un nouveau catway dans la base de données. 
 * 
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
 * @returns Redirige vers '/catways' en cas de succès ou rend la vue 'addCatway' en cas d'erreur. 
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
        return res.redirect('/catways/?success=Nouveau catway créé avec succès !');
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
            error: 'Une erreur est survenue lors de la création du catway. Veuillez vérifier que le numéro de Catway n\'est pas déjà utilisé.' 
        });
    }
}

/**
 * 
 * Cette fonction rend la vue de la page d'ajout d'un Catway. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 */
exports.goToAdd = (req, res) => {
    res.render('addCatway');
}

/**
 * 
 * Elle va : 
 * - Extraire le numéro d'identifiant du catway, 
 * - Rechercher le catway correspondant dans la base de données, 
 * - Renvoyer vers la page de gestion des catways avec un message d'erreur s'il n'a pas été trouvé ou s'il y a eu un problème lors de la récupération
 * - Renvoyer vers la page de détails du catway concerné en cas de succès.  
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 *  
 * @returns Retourne la vue correspondante : '/catways' en cas d'erreur ou '/catways/:id' en cas de succès. 
 */
exports.getOne = async (req, res, next) => {

    const id = req.params.id

    try {
        const catway = await Catway.findById(id); 
        if (!catway) {
            return res.redirect('/catways?error=Catway introuvable');
        }
        return res.render('detailsCatway', { catway: catway });

    } catch (error) {
        console.error('Erreur lors de la récupération du catway :', error);
        return res.redirect('/catways?error=Erreur lors de la récupération');
    }
}

/**
 * 
 * Cette fonction permet d'accéder à la page de modification d'un Catway. 
 * 
 * Elle va : 
 * - Rechercher le catway via son identifiant dans la base de données, 
 * - Afficher un message d'erreur si le catway n'existe pas dans la base de données ou s'il y a eu un problème lors de la récupération, 
 * - Retourner la vue de modification d'un catway s'il a bien été trouvé.
 * 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * 
 * @returns Retourne une vue, vers 'editCatway' si le catway a été trouvé, sinon vers '/catways' avec un message d'erreur. 
 */
exports.goToEdit = async (req, res) => {

    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.redirect('/catways?error=Catway introuvable');
        }
        return res.render('editCatway', { catway: catway });

    } catch (error) {
        console.error('Erreur lors de la récupération du catway :', error);
        return res.redirect('/catways?error=Erreur lors de la récupération');
    }
};

/**
 * 
 * Cette fonction met à jour uniquement l'état d'un catway dans la base de données. 
 * 
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
 * @returns Rend la vue vers '/catway' en cas de succès ou d'erreur, avec un message. 
 */
exports.update = async (req, res, next) => {
    const id = req.params.id; // Récupère l'ID du catway
    const updatedState = req.body.catwayState; // Récupère la nouvelle valeur pour catwayState

    try {
        const catway = await Catway.findById(id);

        if (!catway) {
            console.error('Catway introuvable pour l\'ID :', id);
            return res.redirect('/catways?error=Catway introuvable');
        }

        catway.catwayState = updatedState; // Modifie uniquement catwayState
        await catway.save(); // Sauvegarde les modifications

        console.log('Catway mis à jour avec succès :', catway);
        return res.redirect('/catways?success=Catway mis à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du catway :', error);
        return res.redirect('/catways?error=Erreur lors de la mise à jour');
    }
};

/**
 * 
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
 * @returns Redirige vers '/catways' avec un message de succès ou d'erreur. 
 */
exports.delete = async (req, res, next) => {
    const id = req.params.id
    
    try {
        const result = await Catway.findOneAndDelete({ _id: id });

        if (!result) {
            console.error('Catway introuvable pour l\'ID :', id);
            return res.redirect('/catways?error=Catway introuvable');
        }

        console.log('Catway supprimé avec succès :', result);
        return res.redirect('/catways?success=Catway supprimé avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        return res.redirect('/catways?error=Erreur lors de la suppression');
    }
};