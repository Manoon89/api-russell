const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');

// Fonction pour ajouter un nouvel utilisateur
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
        return res.status(501).json(error);
    }    
}

// Lister tous les utilisateurs
exports.getAll = async (req, res, next) => {
    try {
        let users = await User.find();
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(501).json(error);
    }
}

// Chercher un utilisateur via son email. 
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

// Modifier un utilisateur
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

// Supprimer un utilisateur
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