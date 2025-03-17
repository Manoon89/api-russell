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
    const id = req.params.catwayNumber
    const temp = ({
        catwayState: req.body.catwayState, 
    });

    try {
        let catway = await Catway.findOne(id);

        if (catway) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]){
                    catway [key] = temp [key];
                }
            });

            await catway.save();
            return res.status(201).json(catway);
        }

        return res.status(404).json('catway_not_found');
    }
    catch (error) {
        return res.status(501).json(error);
    }
}

// Supprimer un catway
exports.delete = async (req, res, next) => {
    const id = req.params.catwayNumber
    
    try {
        await Catway.deleteOne(id);
        return res.status(204).json('delete_ok');
    }
    catch (error) {
        return res.status(501).json(error);
    }
}