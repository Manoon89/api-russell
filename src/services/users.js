const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');

exports.add = async (req, res, next) => {
    const temp = ({
        username: req.body.username, 
        email: req.body.email, 
        password: req.body.password
    });

    try {
        let user = await User.create(temp);
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(501).json(error);
    }    
}


//TODO : exports.getAll = 

// Chercher un utilisateur via son email
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