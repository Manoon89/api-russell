const Catway = require('../models/catway');

// Fonction pour ajouter un nouveau catway
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

        // Vérifiez si c'est une erreur de validation
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

// Lister l'ensemble des catways
exports.getAll = async (req, res, next) => {
    try {
        let catways = await Catway.find();
        return res.status(200).json(catways);
    }
    catch (error) {
        return res.status(501).json(error);
    }
}

// Chercher un catway via son numéro 
exports.getOne = async (req, res, next) => {
    const id = req.params.catwayNumber
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

// Modifier l'état d'un catway
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

// Supprimer un catway
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