const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

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