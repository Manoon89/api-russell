const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('..models/user');

exports.login = async (req, res, next) => {
    const {email, password} = req.body; 

    try {
        const user = await User.findOne ({email: email});
        if (!user) {
            return res.status(404).json('user_not_found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json('wrong_credentials');
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email}, 
            process.env.SECRET_KEY, 
            {expiresIn: '1h'}
        );

        return res.status(200).json({token});
    }
    catch (error) {
        return res.status(501).json(error);
    }
};

exports.logout = (req, res, next) => {
    return res.status(200).json('logout_success');
}