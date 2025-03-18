/**
 * @swagger
 * /:
 *   get:
 *     summary: Affiche la page d'accueil de l'application
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: Page d'accueil affichée avec succès
 * 
 * Cette fonction renvoie sur la page d'accueil. 
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 */
exports.goToIndex = async (req, res) => {
    res.render('index')
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentifie un utilisateur en vérifiant son email et son mot de passe
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie, redirection vers le tableau de bord
 *       400:
 *         description: Informations d'identification manquantes
 *       401:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Utilisateur non trouvé
 * 
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