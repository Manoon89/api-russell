/**
 * 
 * Cette fonction renvoie sur la page d'accueil. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 */
exports.goToIndex = async (req, res) => {
    res.render('index')
}