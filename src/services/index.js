/**
 * Cette fonction renvoie sur la page d'accueil. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 */
exports.goToIndex = async (req, res) => {
    res.render('index')
}

/**
 * Fonction qui gère la connexion d'un utilisateur en vérifiant ses informations d'identification. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * 
 * @returns Retourne la vue du tableau de bord si la connexion est réussie ; ou la page d'accueil avec un message d'erreur sinon. 
 */
exports.login = async(req, res) => {

    const {email, password} = req.body; 
    const user = await User.findOne({ email, password });
  
    if (user) {
      res.render('dashboard', {username: user.username})
    }

    else {
      res.redirect('/', { error: 'Email ou mot de passe incorrect' });
    }
}