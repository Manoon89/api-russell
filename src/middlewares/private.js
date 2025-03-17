const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Cette fonction permet de vérifier si le token enregistré en cookie (ou en en-tête) correspond au token d'authentification. 
 * S'ils correspondent, la fonction crée un nouveau token, puis passe la main au middleware suivant.
 * 
 * @param {Object} req Requête (http) envoyée par le client au serveur
 * @param {Object} res Réponse (http) que le serveur envoie au client
 * @param {Object} next Objet utilisé pour passer la main au middleware suivant
 * 
 * @throws {Error} Retourne une erreur 401 s'il n'y a pas de token, ou si le token ne correspond pas. 
 * 
 * @example 
 * // On ajoutera ce middleware aux routes que l'on souhaite protéger. 
 * Penser dans un premier temps à importer le middleware puis l'intégrer aux routes, par ex. : 
 * router.post('/', private.checkJWT, serviceUsers.add);
 */

exports.checkJWT = async (req, res, next) => {

    let token = req.cookies.authToken || req.headers['authorization'];

    // Si le token commence par Bearer, retire les 7 premiers caractères (qui correspondent à 'Bearer' pour en extraire le token. 
    if(!!token && token.startsWith('Bearer')) {
        token = token.slice(7, token.lenght); 
    }

    // On vérifie ensuite la validité du token avec la clé secrète
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {

            // Si le token ne correspond pas, renvoie un message d'erreur indiquant que le token n'est pas valide
            if(err) {
                return res.status(401).json('token_not_valid');
            } 
            
            else {
                // On stocke toutes les données de la requête & on crée un nouveau token, valable 1H
                req.decoded = decoded; 
                const expiresIn = 60*60*1000 ;
                const newToken = jwt.sign ({
                    user: decoded.user
                },
                SECRET_KEY,
                {
                    expiresIn: expiresIn
                });

                // On rajoute le nouveau token aux en-têtes de la réponse
                res.header('Authorization', 'Bearer' + newToken);
                next();
            }
        });
    }
    else {
        // Si aucun token n'est fourni
        return res.status(401).json('token_required');
    }
}